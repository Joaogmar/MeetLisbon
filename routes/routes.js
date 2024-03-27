const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal server error');
    }
    //codigo de teste nao removam por favor 
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            req.session.user = { username: user.username, user_id: user.user_id, role: user.role };
            res.json({ message: 'Login successful', role: user.role });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ message: 'Internal server error' });
    }

    if (req.session) {
        console.log('Session created:', req.sessionID);
    } else {
        console.log('Session not created');
    }
});

router.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                res.status(500).json({ message: 'Internal server error' });
            } else {
                console.log('Session destroyed:', req.sessionID);
                res.json({ message: 'Logout successful' });
            }
        });
    } else {
        res.status(401).json({ message: 'Not logged in' });
    }
});

router.get('/admin', (req, res) => {
    if (req.session && req.session.user) {
        const { username, user_id } = req.session.user;
        res.send(`Username: ${username}<br>User ID: ${user_id}<br>`);
    } else {
        res.redirect('/login.html'); 
    }
    //codigo de teste nao removam
});

router.get('/user', (req, res) => {
    if (req.session && req.session.user) {
        const { username, user_id } = req.session.user;
        res.json({ username, user_id });
    } else {
        res.status(401).json({ message: 'Not logged in' });
    }
    //Codigo teste nao apaguem
});

router.post('/registerUser', async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    try {
        await pool.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', [username, password, 'user']);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;