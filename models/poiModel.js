const pool = require('../config/dbConfig');

async function getAllPOI() {
    const result = await pool.query('SELECT * FROM poi');
    return result.rows;
}

async function createPOI(location_name, location_address, longitude, latitude, info, image_url) {
    const result = await pool.query(
        'INSERT INTO poi (location_name, location_address, longitude, latitude, info, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [location_name, location_address, longitude, latitude, info, image_url]
    );
    return result.rows[0];
}

async function deletePOI(id) {
    const result = await pool.query('DELETE FROM poi WHERE location_id = $1 RETURNING *', [id]);
    return result.rows[0]; 
}

module.exports = { getAllPOI, createPOI, deletePOI };
