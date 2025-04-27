// controllers/conStatistique.js
const db = require("../db/db");

// Fonction : somme de consommation par mois et par véhicule
exports.totalConsomationByVehiculeAndMonth = async (req, res) => {
    const sql = `
        SELECT 
            v.numparc AS vehicule_numparc,
            EXTRACT(YEAR FROM c."dateDebut") AS annee,
            EXTRACT(MONTH FROM c."dateDebut") AS mois,
            SUM(c."QteCarb") AS total_consommation
        FROM acc."consomationCarb" c
        LEFT JOIN acc.vehicule v ON c."idVehicule" = v.idvehicule
        GROUP BY v.numparc, annee, mois
        ORDER BY v.numparc, annee, mois
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        return res.status(200).json(result.rows);
    });
};
