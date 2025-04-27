// controllers/conStatistique.js
const db = require("../db/db");

exports.totalConsomationByVehiculeAndMonth = async (req, res) => {
    try {

        const numparc = req.params.numparc;

         // Vérifier si le véhicule existe d'abord
         const checkVehicule = await db.query(`SELECT numparc FROM acc.vehicule WHERE numparc = $1`, [numparc]);

         if (checkVehicule.rows.length === 0) {
             return res.status(404).json({ error: "Véhicule non trouvé" });
         }
 
         const sql = `
             SELECT c."numPark" AS vehicule_numparc,
                 EXTRACT(YEAR FROM c."dateDebut") AS annee,
                 EXTRACT(MONTH FROM c."dateDebut") AS mois,
                 SUM(c."QteCarb") AS total_consommation
             FROM acc."consomationCarb" c
             WHERE c."numPark" = $1
             GROUP BY c."numPark", annee, mois
             ORDER BY annee, mois
         `;

        const result = await db.query(sql, [numparc]);

        // Si le véhicule existe mais pas de consommation trouvée
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Aucune consommation trouvée pour ce véhicule" });
        }

        // Sinon renvoyer les résultats
        return res.status(200).json(result.rows);

        //const result = await db.query(sql);
        //return res.status(200).json(result.rows[0]);

    } catch (error) {
        return res.status(500).json({ error: error.message });

    }
};



//numParK
/*exports.totalConsomationByVehiculeAndMonth = async (req, res) => {
    try {

        const numparc = req.params.numparc;

        // Vérifier si le véhicule existe d'abord
        const checkVehicule = await db.query(`SELECT idvehicule FROM acc.vehicule WHERE numparc = $1`, [numparc]);

        if (checkVehicule.rows.length === 0) {
            return res.status(404).json({ error: "Véhicule non trouvé" });
        }

        const idvehicule = checkVehicule.rows[0].idvehicule;

        const sql = `
            SELECT $1::text AS vehicule_numparc,
                EXTRACT(YEAR FROM c."dateDebut") AS annee,
                EXTRACT(MONTH FROM c."dateDebut") AS mois,
                SUM(c."QteCarb") AS total_consommation
            FROM acc."consomationCarb" c
            WHERE c."numPark" = $2
            GROUP BY annee, mois
            ORDER BY annee, mois
        `;

        const result = await db.query(sql, [numparc, idvehicule]);

        // Si le véhicule existe mais pas de consommation trouvée
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Aucune consommation trouvée pour ce véhicule" });
        }

        // Sinon renvoyer les résultats
        return res.status(200).json(result.rows);

        //const result = await db.query(sql);
        //return res.status(200).json(result.rows[0]);

    } catch (error) {
        return res.status(500).json({ error: error.message });

    }
};*/

// Fonction : somme de consommation par mois et par véhicule
/*exports.totalConsomationByVehiculeAndMonth = async (req, res) => {
    try {
        const sql = `
        SELECT 
            v.numparc AS vehicule_numparc,
            EXTRACT(YEAR FROM c."dateDebut") AS annee,
            EXTRACT(MONTH FROM c."dateDebut") AS mois,
            SUM(c."QteCarb") AS total_consommation
        FROM acc."consomationCarb" c
        LEFT JOIN acc.vehicule v ON c."idVehicule" = v.idvehicule
        GROUP BY v.numparc, EXTRACT(YEAR FROM c."dateDebut"), EXTRACT(MONTH FROM c."dateDebut")
        ORDER BY v.numparc, annee, mois
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        return res.status(200).json(result.rows);
    });

        //const result = await db.query(sql);
        //return res.status(200).json(result.rows[0]);

    } catch (error) {
        return res.status(500).json({ error: error.message });

    }
};*/
