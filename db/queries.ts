const pool = require('./pool')

export async function getLangData() {
    const [rows] = await pool.query("SELECT * FROM langs");
    return rows
}