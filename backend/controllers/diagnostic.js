const db = require("../db/db");
const moment = require('moment');

exports.list = async (req, res) => {
    sql = `SELECT diag.id_diagnostic,
    d.id_demande,
    d.date_demande,
    d.type_avarie,
    d.description,
    d.date_avarie,
    d.heure_avarie,
    v.numparc,
    v.immatricule,
    v.modele,
    c.nom,
    c.prenom,
    c.matricule_chauf,
    c.cin,
    c.telephone,
    c.email,
    diag.description_panne,
    diag.causes_panne,
    diag.actions,
    diag.date_diagnostic,
    diag.heure_diagnostic
    FROM acc.diagnostic AS diag
    JOIN acc.demandes AS d ON diag.id_demande = d.id_demande
    JOIN acc.vehicule AS v ON d.id_vehicule = v.idvehicule
    JOIN acc.chauffeur AS c ON d.id_chauffeur = c.id_chauf;`;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(200).json(result.rows);
    });
}

exports.show = async (req, res) => {
    const id_diagnostic = Number(req.params.id_diagnostic);

    sql = "SELECT * FROM acc.diagnostic WHERE id_diagnostic=$1";

    db.query(sql, [id_diagnostic], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(200).json(result.rows);
    });
}

exports.create = async (req, res) => {
    const { id_demande, description_panne, causes_panne, actions, date_diagnostic, heure_diagnostic } = req.body;

    if (!id_demande) {
        return res.status(400).json({ error: "Missing Request (id_demande is required)" });
    }

    // Vérifier si la demande existe dans la table demandes
    const demandeResult = await db.query("SELECT id_demande FROM acc.demandes WHERE id_demande= $1", [id_demande]);
    if (demandeResult.rows.length === 0) {
        return res.status(400).json({ error: "Request not found (id_demande does not exist)!" });
    }
    //const id_demande = demandeResult.rows[0].id_demande;

    const formattedDateDiagnostic = moment(date_diagnostic, 'YYYY-MM-DD').format("YYYY-MM-DD");
    const formattedHeureDiagnostic = moment(heure_diagnostic, 'HH:mm').format("HH:mm");

    sql = `INSERT INTO acc.diagnostic(id_demande, description_panne, causes_panne, actions, date_diagnostic, heure_diagnostic) 
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id_diagnostic, id_demande, description_panne, causes_panne, actions, date_diagnostic, heure_diagnostic`;

    db.query(sql, [id_demande, description_panne, causes_panne, actions, formattedDateDiagnostic, formattedHeureDiagnostic], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(200).json({ message: "diagnostic created successfully!", result: result.rows[0] });
    });
}

exports.update = async (req, res) => {

    const id_diagnostic = Number(req.params.id_diagnostic);
    const { id_demande, description_panne, causes_panne, actions, date_diagnostic, heure_diagnostic } = req.body;

    if (!id_demande) {
        return res.status(400).json({ error: "Missing Request (id_demande is required)" });
    }

    // Vérifier si la demande existe dans la table demandes
    const demandeResult = await db.query("SELECT id_demande FROM acc.demandes WHERE id_demande= $1", [id_demande]);
    if (demandeResult.rows.length === 0) {
        return res.status(400).json({ error: "Request not found (id_demande does not exist)!" });
    }
    //const id_demande = demandeResult.rows[0].id_demande;

    const formattedDateDiagnostic = moment(date_diagnostic, 'YYYY-MM-DD').format("YYYY-MM-DD");
    const formattedHeureDiagnostic = moment(heure_diagnostic, 'HH:mm').format("HH:mm");

    sql = `UPDATE acc.diagnostic 
    SET id_demande=$1, description_panne=$2, causes_panne=$3, actions=$4, date_diagnostic=$5, heure_diagnostic=$6
    WHERE id_diagnostic=$7
    RETURNING *`;

    db.query(sql, [id_demande, description_panne, causes_panne, actions, formattedDateDiagnostic, formattedHeureDiagnostic, id_diagnostic], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(200).json({ message: "diagnostic updated successfully!", result: result.rows[0] });
    });
}


exports.delete = async (req, res) => {
    const id_diagnostic = Number(req.params.id_diagnostic);

    sql = "DELETE FROM acc.diagnostic WHERE id_diagnostic=$1";

    db.query(sql, [id_diagnostic], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(200).json({message: "Diagnostic deleted successfully!", result: result.rows[0]});
    });
}
