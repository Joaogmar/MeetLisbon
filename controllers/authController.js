const authModel = require('../models/authModel');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
    try {
        const { username, password, role, age_group, gender, location, nationality } = req.body;
        const user = await authModel.registerUser(username, password, role, age_group, gender, location, nationality);
        
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await authModel.authenticateUser(username, password);

        console.log('User during login:', user);

        const token = jwt.sign({ userId: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token, role: user.role });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

module.exports = { register, login };