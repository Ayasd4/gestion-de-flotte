const db = require("../db/db");

exports.getAllOrdre = async (req, res) => {
    try {
        const sql = "SELECT travaux FROM acc.ordre_travail";

        db.query(sql, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Order not found!" });
            }

            return res.status(200).json(result.rows);
        });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.getAllTechnicien = async (req, res) => {
    const sql = "SELECT matricule_techn FROM acc.technicien";

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Technician not found!" });
        }

        return res.status(200).json(result.rows);
    });
}