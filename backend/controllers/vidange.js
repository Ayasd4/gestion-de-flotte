const db = require('../db/db');

exports.list = async (req, res) => {
    const sql = `
        SELECT vd.id_vidange,
        v.numparc,
        vd.date_vidange,
        k.date,
        k.calcul,
        vd.calcul_vidange
        FROM acc.vidange AS vd
        JOIN acc.vehicule AS v ON vd.id_vehicule = v.idvehicule
        JOIN acc.kilometrage AS k ON vd.id_kilometrage = k.id`;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(result.rows);
    });
};

exports.show = async (req, res) => {
    const id_vidange = Number(req.params.id_vidange);
    const sql = `
        SELECT * FROM acc.vidange WHERE id_vidange=$1`;

    db.query(sql, [id_vidange], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Emptying not found!" });
        }

        return res.status(200).json(result.rows);
    });
};

exports.create = async (req, res) => {
    try {
        const { id_vehicule, date_vidange, id_kilometrage, calcul_vidange } = req.body;



    } catch (error) {

    }
}