const db = require("../db/db");

exports.list = async (req, res) => {
    const sql = "SELECT * FROM acc.technicien";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err.message);
        return res.status(200).json(result.rows[0]);
    });
}

exports.show = async (req, res) => {
    const { id_technicien } = Number(req.params.id_technicien);

    const sql = "SELECT * FROM acc.technicien where id_technicien=$1";
    db.query(sql, [id_technicien], (err, result) => {
        if (err) return res.status(500).json(err.message);
        return res.status(200).json(result.rows[0]);
    });
}

exports.create = async (req, res) => {
    const { nom, prenom, matricule_techn, cin, telephone, email, specialite, date_embauche, status } = req.body;
    const sql = "INSERT INTO acc.technicien(nom, prenom, matricule_techn, cin, telephone, email, specialite, date_embauche, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";

    const formattedDateEmbauche = moment(date_embauche, 'YYYY-MM-DD').format("YYYY-MM-DD");

    db.query(sql, [nom, prenom, matricule_techn, cin, telephone, email, specialite, formattedDateEmbauche, status], (err, result) => {

        if (err) return res.status(500).json(err.message);
        return res.status(200).json({ message: "Technician created successfully!", result: result.rows[0] });
    });
}

exports.update = async (req, res) => {
    const { id_technicien } = Number(req.params.id_technicien);
    const { nom, prenom, matricule_techn, cin, telephone, email, specialite, date_embauche, status } = req.body;

    const sql = "UPDATE acc.technicien SET nom=$1, prenom=$2, matricule_techn=$3, cin=$4, telephone=$5, email=$6, specialite=$7, date_embauche=$8, status=$9 WHERE id_technicien=$10 RETURNING *";

    const formattedDateEmbauche = moment(date_embauche, 'YYYY-MM-DD').format("YYYY-MM-DD");

    db.query(sql, [nom, prenom, matricule_techn, cin, telephone, email, specialite, formattedDateEmbauche, status, id_technicien], (err, result) => {

        if (err) return res.status(500).json(err.message);
        return res.status(200).json({ message: "Technician updated successfully!", result: result.rows[0] });
    });
}

exports.show = async (req, res) => {
    const { id_technicien } = Number(req.params.id_technicien);

    const sql = "DELETE FROM acc.technicien where id_technicien=$1";
    db.query(sql, [id_technicien], (err, result) => {
        if (err) return res.status(500).json(err.message);
        return res.status(200).json({ message: "Technician deleted successfully!", result: result.rows[0] });
    });
}