const pool = require('../config/dbConfig');
const bcrypt = require('bcrypt');

async function registerUser(username, password, role, age_group, gender, location, nationality) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
        'INSERT INTO users (username, password, role, age_group, gender, location, nationality) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [username, hashedPassword, role, age_group, gender, location, nationality]
    );
    return result.rows[0];
}

async function authenticateUser(username, password) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    return user;
}

module.exports = { registerUser, authenticateUser };