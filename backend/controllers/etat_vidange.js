const db = require('../db/db');
const moment = require('moment');

exports.list = async (req, res) => {
    const sql = ` SELECT e.id_vidange,
        v.numparc,
        k."vehiculeId",
        k.calcul,
        COALESCE(vd.km_vidange, '0') AS km_vidange,
        e.km_prochaine_vd,
        e.reste_km,
        e.date
        FROM acc.etat_vidange AS e
        JOIN acc.vehicule AS v ON e.id_vehicule = v.idvehicule
        JOIN acc.kilometrage AS k ON e.id_kilometrage = k.id
        LEFT JOIN acc.vidanges AS vd ON e.km_derniere_vd = vd.km_vidange AND e.id_vehicule = vd.id_vehicule
        `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(result.rows);
    });
};
//JOIN acc.vidanges AS vd ON e.id_vidange = vd.id_vd
/*utiliser COALESCE pour forcer l’affichage de 0 au lieu de null grâce à COALESCE(vd.km_vidange, '0'). */

exports.show = async (req, res) => {
    const id_vidange = Number(req.params.id_vidange);
    const sql = `SELECT * FROM acc.etat_vidange WHERE id_vidange=$1`;

    db.query(sql, [id_vidange], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Vidange not found!" });
        }

        return res.status(200).json(result.rows);
    });
};

exports.create = async (req, res) => {
    try {
        const { vehicule, kilometrage, date } = req.body;

        const { numparc } = vehicule;
        const { calcul } = kilometrage;

        // 1. Récupérer l'ID du véhicule
        const vehiculeResult = await db.query("SELECT idvehicule FROM acc.vehicule WHERE numparc = $1", [numparc]);
        if (vehiculeResult.rows.length === 0) {
            return res.status(400).json({ error: "Vehicle not found!" });
        }
        const id_vehicule = vehiculeResult.rows[0].idvehicule;

        //2. Récupérer le km actuelle(calcul) de la table kilometrage 
        const KmQuery = `SELECT id FROM acc.kilometrage WHERE calcul=$1 AND "vehiculeId" = $2 ORDER BY date DESC LIMIT 1`;
        const KmResult = await db.query(KmQuery, [calcul, id_vehicule]);
        if (KmResult.rows.length === 0) {
            return res.status(400).json({ error: "Matching mileage not found!" });
        }
        const id_kilometrage = KmResult.rows[0].id;
        const KmActuel = calcul;

        //3. Récupérer le km derniere vidange de la table vidange
        const vidangeQuery = `
          SELECT km_vidange 
          FROM acc.vidanges 
          WHERE id_vehicule = $1 
          ORDER BY id_vd DESC LIMIT 1
        `;
        const vidangeResult = await db.query(vidangeQuery, [id_vehicule]);
        //vidangeResult.rows.length > 0 ? si le vehicule a fait un vidange 
        //vidangeResult.rows[0].km_vidange : 0 si le vehicule n'a pas fait un vidange donc =0 
        const kmDerniereVidange = vidangeResult.rows.length > 0 ? vidangeResult.rows[0].km_vidange : 0;

        const frequce_km = 10000
        //4. calcul
        const kmDerniereVidangeNum = parseInt(kmDerniereVidange, 10);
        const kmProchaineVidange = kmDerniereVidangeNum + frequce_km;
        const resteKm = kmProchaineVidange - KmActuel;

        const formattedDate = moment(date, 'YYYY-MM-DD').format("YYYY-MM-DD");

        const sql = `INSERT INTO acc.etat_vidange(id_vehicule, id_kilometrage, km_derniere_vd, km_prochaine_vd, reste_km, date)
        VALUES($1,$2,$3,$4,$5,$6) RETURNING *`;

        db.query(sql, [id_vehicule, id_kilometrage, kmDerniereVidange, kmProchaineVidange, resteKm, formattedDate], (err, result) => {
            if (err) return res.status(200).json({ error: err.message });
            return res.status(200).json({ message: "Planning Oil change added Successfully", vidange: result.rows[0] })
        });

    } catch (error) {
        console.error('Error while creating Oil change:', err);
        return res.status(500).json({ error: err.message });
    }
}

exports.update = async (req, res) => {
    try {
        const id_vidange = Number(req.params.id_vidange);
        const { vehicule, kilometrage, date } = req.body;

        const { numparc } = vehicule;
        const { calcul } = kilometrage;

        // 1. Récupérer l'ID du véhicule
        const vehiculeResult = await db.query("SELECT idvehicule FROM acc.vehicule WHERE numparc = $1", [numparc]);
        if (vehiculeResult.rows.length === 0) {
            return res.status(400).json({ error: "Vehicle not found!" });
        }
        const id_vehicule = vehiculeResult.rows[0].idvehicule;

        //2. Récupérer le km actuelle(calcul) de la table kilometrage 
        const KmQuery = `SELECT id FROM acc.kilometrage WHERE calcul=$1 AND "vehiculeId" = $2 ORDER BY date DESC LIMIT 1`;
        const KmResult = await db.query(KmQuery, [calcul, id_vehicule]);
        if (KmResult.rows.length === 0) {
            return res.status(400).json({ error: "Matching mileage not found!" });
        }
        const id_kilometrage = KmResult.rows[0].id;
        const KmActuel = calcul;

        // Vérifie que le kilometrage correspond bien au véhicule sélectionné
        /* const verifQuery = `SELECT "vehiculeId" FROM acc.kilometrage WHERE id = $1`;
         const verifResult = await db.query(verifQuery, [id_kilometrage]);
 
         if (verifResult.rows.length === 0 || verifResult.rows[0].vehiculeId !== id_vehicule) {
             return res.status(400).json({ error: "The selected mileage does not match the chosen vehicle!" });
         }*/


        //3. Récupérer le km derniere vidange de la table vidange
        const vidangeQuery = `
          SELECT km_vidange 
          FROM acc.vidanges 
          WHERE id_vehicule = $1 
          ORDER BY id_vd DESC LIMIT 1
        `;
        const vidangeResult = await db.query(vidangeQuery, [id_vehicule]);
        //vidangeResult.rows.length > 0 ? si le vehicule a fait un vidange 
        //vidangeResult.rows[0].km_vidange : 0 si le vehicule n'a pas fait un vidange donc =0 
        const kmDerniereVidange = vidangeResult.rows.length > 0 ? vidangeResult.rows[0].km_vidange : 0;

        const frequce_km = 10000;

        //4. calcul
        const kmDerniereVidangeNum = parseInt(kmDerniereVidange, 10);
        const kmProchaineVidange = kmDerniereVidangeNum + frequce_km;
        const resteKm = kmProchaineVidange - KmActuel;

        const formattedDate = moment(date, 'YYYY-MM-DD').format("YYYY-MM-DD");

        const sql = `UPDATE acc.etat_vidange SET id_vehicule=$1, id_kilometrage=$2, km_derniere_vd=$3, km_prochaine_vd=$4, reste_km=$5, date=$6
        WHERE id_vidange=$7
        RETURNING id_vehicule, id_kilometrage, km_derniere_vd, km_prochaine_vd, reste_km, date`;

        db.query(sql, [id_vehicule, id_kilometrage, kmDerniereVidange, kmProchaineVidange, resteKm, formattedDate, id_vidange], (err, result) => {
            if (err) return res.status(200).json({ error: err.message });
            return res.status(200).json({ message: "Planning Oil change updated Successfully", vidange: result.rows[0] })
        });

    } catch (error) {
        console.error('Error while creating Oil change:', error);
        return res.status(500).json({ error: error.message });
    }
}

exports.delete = async (req, res) => {
    const id_vidange = Number(req.params.id_vidange);
    const sql = `DELETE FROM acc.etat_vidange WHERE id_vidange=$1`;

    db.query(sql, [id_vidange], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(200).json({ message: "Oil change deleted successfully!"});
    });
}

/*exports.getNumparc = async (req, res)=>{
    const sql = "SELECT numparc FROM acc.vehicule";

    db.query(sql, (err, result)=> {
        if (err) return res.status(500).json({ error: err.message });

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Vehicle not found!" });
        }

        return res.status(200).json(result.rows);
    });
}*/