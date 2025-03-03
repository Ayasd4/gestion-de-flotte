const pool = require("../db/db");

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM acc.admin WHERE email = $1 AND password = $2";

    try {
        const { rows } = await pool.query(sql, [email, password]);
        if (rows.length > 0) {
            return res.status(200).json(rows[0]);
        } else {
            return res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
