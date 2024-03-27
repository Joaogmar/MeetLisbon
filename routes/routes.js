const express = require('express');
const pool = require('../db');

const router = express.Router();


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        if (result.rows.length > 0) {
            res.send('Login successful');
        } else {
            res.send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
