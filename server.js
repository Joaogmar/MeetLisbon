require('dotenv').config();
const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const { authenticateToken } = require('./middleware/authMiddleware'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); 

app.use('/api/auth', authRoutes); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
});

app.get('/api/userinfo', authenticateToken, (req, res) => {
    res.json({ message: 'User specific information', userId: req.user.userId });
});

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
