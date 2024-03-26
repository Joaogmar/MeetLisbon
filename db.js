const pg = require('pg');

const Pool = pg.Pool

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    max: 20
});

module.exports = pool

// em qualquer parte que precise de usar a bd tenho de pôr
// const pool = require("../db"); -> no inicio do ficheiro para o import
// utilizamos assim: const dbResult = await pool.query("SELECT * FROM modes");
// para ir buscar o resultado : dbResult.rows