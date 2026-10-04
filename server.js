const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-123';

app.use(cors());
app.use(express.json());

// Serve static HTML/JS files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Default route loads Login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Login.html'));
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }
        req.user = decodedUser;
        next();
    });
};

// 1. LOGIN ENDPOINT
// 1. LOGIN ENDPOINT
app.post('/api/v1/auth/login', async (req, res) => {
    // Accept either username or studentId from req.body
    const identifier = req.body.username || req.body.studentId;
    const password = req.body.password;

    if (!identifier || !password) {
        return res.status(400).json({ success: false, message: 'Student ID and password are required' });
    }

    try {
        // Query database by studentId or email
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { studentId: identifier },
                    { email: identifier }
                ]
            }
        });

        if (!user) {
            console.log('User not found:', identifier);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Verify password against passwordHash column
        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            console.log('Password mismatch for:', identifier);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, studentId: user.studentId },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        return res.json({
            success: true,
            message: 'Login successful',
            token
        });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ success: false, message: 'Server error during login' });
    }
});


// 2. DASHBOARD DATA ENDPOINT
app.get('/api/v1/student/dashboard', authenticateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: {
                financials: true,
                // Include courses/enrollments relation if added to schema
            }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User profile not found' });
        }

        // Shape response for Student.html
        const dashboardData = {
            profile: {
                name: `${user.firstName} ${user.lastName}`.trim(),
                studentId: user.studentId,
                program: user.program || 'Computer Science',
                avatarUrl: user.avatarUrl || ''
            },
            stats: {
                feeBalance: user.financials ? Number(user.financials.balance) : 0.00,
                currentGPA: Number(user.currentGPA ?? 0),
                enrolledCoursesCount: 0
            },
            courses: [],
            announcements: []
        };

        return res.json({ success: true, data: dashboardData });

    } catch (error) {
        console.error('Dashboard Error:', error);
        return res.status(500).json({ success: false, message: 'Server error fetching dashboard' });
    }
});
// Set port to 5000 to match your browser URL
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
