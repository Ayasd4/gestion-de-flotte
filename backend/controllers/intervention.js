const db = require("../db/db");
const moment = require("moment");

exports.list = async (req, res) => {

    sql = `SELECT i.id_intervention,
    o.urgence_panne,
    o.travaux,
    o.material_requis,
    o.planning,
    o.date_ordre,
    tech.nom,
    tech.prenom,
    tech.matricule_techn,
    tech.email_techn,
    tech.specialite,
    i.date_debut,
    i.heure_debut,
    i.date_fin,
    i.heure_fin,
    i.status_intervention,
    i.commentaire
    FROM acc.intervention AS i
    JOIN acc.ordre_travail AS o ON i.id_ordre = o.id_ordre
    JOIN acc.technicien AS tech ON i.id_technicien = tech.id_technicien;`;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(result.rows);
    });
}

exports.show = async (req, res) => {
    const id_intervention = Number(req.params.id_intervention);
    const sql = "SELECT * FROM acc.intervention WHERE id_intervention=$1";

    db.query(sql, [id_intervention], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Intervention not found!" });
        }

        return res.status(200).json(result.rows);
    });
}

exports.create = async (req, res) => {
    try {
        const { ordre, technicien, date_debut, heure_debut, date_fin, heure_fin, status_intervention, commentaire } = req.body;
        
        // Vérification que les données sont présentes
        if (!ordre || !technicien) {
            return res.status(400).json({ error: "Missing order or technician" });
        }

        const { travaux } = ordre;
        const { matricule_techn } = technicien;

        const ordreResult = await db.query("SELECT id_ordre FROM acc.ordre_travail WHERE travaux = $1", [travaux]);
        if (ordreResult.rows.length === 0) {
            return res.status(400).json({ error: "atelier not found!" });
        }
        const id_ordre = ordreResult.rows[0].id_ordre;


        const technicienResult = await db.query("SELECT id_technicien FROM acc.technicien WHERE matricule_techn = $1", [matricule_techn]);
        if (technicienResult.rows.length === 0) {
            return res.status(400).json({ error: "technicien not found!" });
        }
        const id_technicien = technicienResult.rows[0].id_technicien;


        const formattedDateDebut = moment(date_debut, 'YYYY-MM-DD').format("YYYY-MM-DD");
        const formattedHeureDebut = moment(heure_debut, 'HH:mm').format("HH:mm");
        const formattedDateFin = moment(date_fin, 'YYYY-MM-DD').format("YYYY-MM-DD");
        const formattedHeureFin = moment(heure_fin, 'HH:mm').format("HH:mm");

        
        const sql = `INSERT INTO acc.intervention(id_ordre, id_technicien, date_debut, heure_debut, date_fin, heure_fin, status_intervention, commentaire)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id_ordre, id_technicien, date_debut, heure_debut, date_fin, heure_fin, status_intervention, commentaire`;

        db.query(sql, [id_ordre, id_technicien, formattedDateDebut, formattedHeureDebut, formattedDateFin, formattedHeureFin, status_intervention, commentaire ], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Intervention not found!" });
            }

            return res.status(200).json({ message: "Intervention added successfully!", Intervention: result.rows});
        });
    } catch (error) {
        return res.status(500).json({ message: error.message })

    }
}

exports.update = async (req, res) => {
    try {
        const id_intervention = Number(req.params.id_intervention);
        const { ordre, technicien, date_debut, heure_debut, date_fin, heure_fin, status_intervention, commentaire } = req.body;
        
        // Vérification que les données sont présentes
        if (!ordre || !technicien) {
            return res.status(400).json({ error: "Missing order or technician" });
        }

        const { travaux } = ordre;
        const { matricule_techn } = technicien;

        const ordreResult = await db.query("SELECT id_ordre FROM acc.ordre_travail WHERE travaux = $1", [travaux]);
        if (ordreResult.rows.length === 0) {
            return res.status(400).json({ error: "atelier not found!" });
        }
        const id_ordre = ordreResult.rows[0].id_ordre;


        const technicienResult = await db.query("SELECT id_technicien FROM acc.technicien WHERE matricule_techn = $1", [matricule_techn]);
        if (technicienResult.rows.length === 0) {
            return res.status(400).json({ error: "technicien not found!" });
        }
        const id_technicien = technicienResult.rows[0].id_technicien;


        const formattedDateDebut = moment(date_debut, 'YYYY-MM-DD').format("YYYY-MM-DD");
        const formattedHeureDebut = moment(heure_debut, 'HH:mm').format("HH:mm");
        const formattedDateFin = moment(date_fin, 'YYYY-MM-DD').format("YYYY-MM-DD");
        const formattedHeureFin = moment(heure_fin, 'HH:mm').format("HH:mm");

        
        const sql = `UPDATE acc.intervention SET id_ordre=$1, id_technicien=$2, date_debut=$3, heure_debut=$4, date_fin=$5, heure_fin=$6, status_intervention=$7, commentaire=$8
        WHERE id_intervention= $9
        RETURNING *`;

        db.query(sql, [id_ordre, id_technicien, formattedDateDebut, formattedHeureDebut, formattedDateFin, formattedHeureFin, status_intervention, commentaire, id_intervention ], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Intervention not found!" });
            }

            return res.status(200).json({ message: "Intervention updated successfully!", Intervention: result.rows});
        });
    } catch (error) {
        return res.status(500).json({ message: error.message })

    }
}


exports.delete = async (req, res) => {
    const id_intervention = Number(req.params.id_intervention);
    const sql = "DELETE FROM acc.intervention WHERE id_intervention=$1 RETURNING *";

    db.query(sql, [id_intervention], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Intervention not found!" });
        }

        return res.status(200).json({message: "Intervention deleted successfully", intervention: result.rows});
    });
}

exports.getOrdreByTravaux = async (req, res) => {
    const travaux = req.params.travaux;
    const sql = "SELECT  travaux, urgence_panne, material_requis, planning, date_ordre FROM acc.ordre_travail WHERE travaux=$1";
    //idvehicule,
    db.query(sql, [travaux], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(result.rows[0]);
    });
}

exports.getTechnicienByMatricule = async (req, res) => {
    const matricule_techn = req.params.matricule_techn;
    const sql = "SELECT  matricule_techn, nom, prenom, email_techn, specialite FROM acc.technicien WHERE matricule_techn=$1";
    //idvehicule,
    db.query(sql, [matricule_techn], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(result.rows[0]);
    });
}