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

async function favoritePOI(userId, poiId) {
    try {
        console.log('Favorite POI function called with:', { userId, poiId });

        const nextIdResult = await pool.query(`SELECT COALESCE(MAX(fp_id), 0) + 1 AS next_id FROM favorite_places`);
        const nextId = nextIdResult.rows[0].next_id;

        console.log('Generated next ID for favorite_places:', nextId);

        const result = await pool.query(
            `INSERT INTO favorite_places (fp_id, user_id, poi_id) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [nextId, userId, poiId]
        );

        console.log('Successfully inserted favorite place:', result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('Error in favoritePOI function:', error.message);

        throw error;
    }
}

async function getFavoritedPOIs(user_id) {
    const result = await pool.query(
        `SELECT poi.* 
         FROM favorite_places 
         INNER JOIN poi ON favorite_places.poi_id = poi.location_id 
         WHERE favorite_places.user_id = $1`,
        [user_id]
    );
    return result.rows;
}

async function removeFavorite(userId, poiId) {
    try {
        const result = await pool.query(
            `DELETE FROM favorite_places WHERE user_id = $1 AND poi_id = $2 RETURNING *`,
            [userId, poiId]
        );

        return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error in removeFavorite function:', error.message);
        throw error;
    }
}

module.exports = { getAllPOI, createPOI, deletePOI, favoritePOI, getFavoritedPOIs, removeFavorite };