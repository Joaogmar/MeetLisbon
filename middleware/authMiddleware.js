const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('JWT verification error:', err.message);
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        console.log('Decoded JWT payload:', user);

        req.user = {
            user_id: user.userId,  
            role: user.role,
        };

        console.log('req.user after middleware:', req.user);

        next();
    });
};

const checkRole = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        console.log(`Access denied: user role is ${req.user.role}, required role is ${role}`);
        return res.status(403).json({ message: 'Forbidden: insufficient role privileges' });
    }
    next();
};

module.exports = { authenticateToken, checkRole };