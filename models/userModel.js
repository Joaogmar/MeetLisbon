const pool = require('../config/dbConfig');

async function getAllUsers() {
    const result = await pool.query('SELECT * FROM users WHERE role = $1', ['user']);
    return result.rows;
}

async function getAllAdmins() {
    const result = await pool.query('SELECT * FROM users WHERE role = $1', ['admin']);
    return result.rows;
}

async function deleteUser(id) {
    const result = await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [id]);
    return result.rows[0];
}

async function updateUserRole(id, role) {
    const result = await pool.query(
        'UPDATE users SET role = $1 WHERE user_id = $2 RETURNING *',
        [role, id]
    );
    return result.rows[0];
}

async function updateUserPassword(id, hashedPassword) {
    const result = await pool.query(
        'UPDATE users SET password = $1 WHERE user_id = $2 RETURNING *',
        [hashedPassword, id]
    );
    return result.rows[0];
}

module.exports = { getAllUsers, getAllAdmins, deleteUser, updateUserRole, updateUserPassword };