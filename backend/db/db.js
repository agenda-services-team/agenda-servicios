//const { Pool } = require("pg");
//require("dotenv").config();
/*
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

module.exports = pool;
*/
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: "postgresql://postgres:oaxaca12345proyecto$@db.ngafdtugowmhskxikeyf.supabase.co:5432/postgres",
    ssl: {
    rejectUnauthorized: false,
    },
});

module.exports = pool;
