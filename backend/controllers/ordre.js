const db = require("../db/db");
const moment = require("moment");

exports.search = async (req, res) => {
    try {
        let conditions = [];
        let values = [];
        let paramIndex = 1;

        if (req.query.id_diagnostic) {
            conditions.push(`diag.id_diagnostic = $${paramIndex}`);
            values.push(req.query.id_diagnostic);
            paramIndex++;
        }

        if (req.query.id_atelier) {
            conditions.push(`a.id_atelier = $${paramIndex}`);
            values.push(req.query.id_atelier);
            paramIndex++;
        }

        if (req.query.id_technicien) {
            conditions.push(`tech.id_technicien = $${paramIndex}`);
            values.push(req.query.id_technicien);
            paramIndex++;
        }

        //diag
        if (req.query.date_diagnostic) {
            conditions.push(`diag.date_diagnostic::text ILIKE $${paramIndex}`);
            values.push(`%${req.query.date_diagnostic}%`);
            paramIndex++;
        }

        //atelier
        if (req.query.nom_atelier) {
            conditions.push(`a.nom_atelier = $${paramIndex}`);
            values.push(`%${req.query.nom_atelier}%`);
            paramIndex++;
        }

        //technicien
        if (req.query.matricule_techn) {
            conditions.push(`(tech.matricule_techn || ' ' || tech.nom || ' ' || tech.prenom) ILIKE $${paramIndex}`);
            values.push(`%${req.query.matricule_techn}%`);
            paramIndex++;
        }

        //ordre
        if (req.query.urgence_panne) {
            conditions.push(`o.urgence_panne ILIKE $${paramIndex}`);
            values.push(`%${req.query.urgence_panne}%`);
            paramIndex++;
        }

        if (req.query.travaux) {
            conditions.push(`o.travaux ILIKE $${paramIndex}`);
            values.push(`%${req.query.travaux}%`);
            paramIndex++;
        }

        if (req.query.material_requis) {
            conditions.push(`o.material_requis ILIKE $${paramIndex}`);
            values.push(`%${req.query.material_requis}%`);
            paramIndex++;
        }

        if (req.query.planning) {
            conditions.push(`o.planning ILIKE $${paramIndex}`);
            values.push(`%${req.query.planning}%`);
            paramIndex++;
        }

        if (req.query.date_ordre) {
            conditions.push(`o.date_ordre::DATE = $${paramIndex}`);
            values.push(`%${req.query.date_ordre}%`);
            paramIndex++;
        }

        if (req.query.status) {
            conditions.push(`o.status ILIKE $${paramIndex}`);
            values.push(`%${req.query.status}%`);
            paramIndex++;
        }

        let sql = `SELECT o.id_ordre,
    diag.id_diagnostic,
    diag.date_diagnostic,
    o.urgence_panne,
    o.travaux,
    o.material_requis,
    o.planning,
    o.date_ordre,
    o.status,
    a.nom_atelier,
    tech.nom,
    tech.prenom,
    tech.matricule_techn
    FROM acc.ordre_travail AS o
    JOIN acc.diagnostic AS diag ON o.id_diagnostic = diag.id_diagnostic
    JOIN acc.atelier AS a ON o.id_atelier = a.id_atelier
    JOIN acc.technicien AS tech ON o.id_technicien = tech.id_technicien`;


        if (conditions.length > 0) {
            sql += " WHERE " + conditions.join(" AND ");
        }

        db.query(sql, values, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.status(200).json(result.rows);
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

}
exports.list = async (req, res) => {
    const sql = `SELECT o.id_ordre,
    diag.id_diagnostic,
    diag.description_panne,
    diag.causes_panne,
    diag.actions,
    diag.date_diagnostic,
    diag.heure_diagnostic,
    o.urgence_panne,
    o.travaux,
    o.material_requis,
    o.planning,
    o.date_ordre,
    o.status,
    a.nom_atelier,
    a.telephone,
    a.email,
    a.capacite,
    a.statut,
    tech.nom,
    tech.prenom,
    tech.matricule_techn,
    tech.email_techn,
    tech.specialite
    FROM acc.ordre_travail AS o
    JOIN acc.diagnostic AS diag ON o.id_diagnostic = diag.id_diagnostic
    JOIN acc.atelier AS a ON o.id_atelier = a.id_atelier
    JOIN acc.technicien AS tech ON o.id_technicien = tech.id_technicien;`;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(result.rows);
    });
}

exports.show = async (req, res) => {
    const id_ordre = Number(req.params.id_ordre);
    const sql = "SELECT * FROM acc.ordre_travail WHERE id_ordre=$1";

    db.query(sql, [id_ordre], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Order not found!" });
        }

        return res.status(200).json(result.rows);
    });
}


exports.create = async (req, res) => {
    try {
        const { diagnostic, urgence_panne, travaux, material_requis, planning, date_ordre, status, atelier, technicien } = req.body;

        // Vérification que les données sont présentes
        if (!diagnostic || !atelier || !technicien) {
            return res.status(400).json({ error: "Missing diagnostic or workshop or technician" });
        }

        const { description_panne } = diagnostic;
        const { nom_atelier } = atelier;
        const { matricule_techn } = technicien;

        // Vérification des données
        if (!description_panne || !nom_atelier || !matricule_techn) {
            return res.status(400).json({ error: "Missing information for vehicle or driver" });
        }

        const diagnosticResult = await db.query("SELECT id_diagnostic FROM acc.diagnostic WHERE description_panne = $1", [description_panne]);
        if (diagnosticResult.rows.length === 0) {
            return res.status(400).json({ error: "diagnostic not found!" });
        }
        const id_diagnostic = diagnosticResult.rows[0].id_diagnostic;

        const atelierResult = await db.query("SELECT id_atelier FROM acc.atelier WHERE nom_atelier = $1", [nom_atelier]);
        if (atelierResult.rows.length === 0) {
            return res.status(400).json({ error: "atelier not found!" });
        }
        const id_atelier = atelierResult.rows[0].id_atelier;


        const technicienResult = await db.query("SELECT id_technicien FROM acc.technicien WHERE matricule_techn = $1", [matricule_techn]);
        if (technicienResult.rows.length === 0) {
            return res.status(400).json({ error: "technicien not found!" });
        }
        const id_technicien = technicienResult.rows[0].id_technicien;


        const formattedDateOrdre = moment(date_ordre, 'YYYY-MM-DD').format("YYYY-MM-DD");

        const sql = `INSERT INTO acc.ordre_travail(id_diagnostic, urgence_panne, travaux, material_requis, planning, date_ordre, status, id_atelier, id_technicien) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING id_diagnostic, urgence_panne, travaux, material_requis, planning, date_ordre, status, id_atelier, id_technicien`;

        db.query(sql, [id_diagnostic, urgence_panne, travaux, material_requis, planning, formattedDateOrdre, status, id_atelier, id_technicien], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.status(200).json({ message: "work order added successfully!", order: result.rows });
        });

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


exports.update = async (req, res) => {
    try {
        const id_ordre = Number(req.params.id_ordre);

        const { diagnostic, urgence_panne, travaux, material_requis, planning, date_ordre, status, atelier, technicien } = req.body;

        if (!id_ordre) {
            return res.status(400).json({ error: "Missing ID of Order " });
        }

        // Vérification que les données sont présentes
        if (!diagnostic || !atelier || !technicien) {
            return res.status(400).json({ error: "Missing diagnostic or workshop or technician" });
        }

        const { description_panne } = diagnostic;
        const { nom_atelier } = atelier;
        const { matricule_techn } = technicien;

        // Vérification des données
        if (!description_panne || !nom_atelier || !matricule_techn) {
            return res.status(400).json({ error: "Missing information for vehicle or driver" });
        }

        const diagnosticResult = await db.query("SELECT id_diagnostic FROM acc.diagnostic WHERE description_panne = $1", [description_panne]);
        if (diagnosticResult.rows.length === 0) {
            return res.status(400).json({ error: "diagnostic not found!" });
        }
        const id_diagnostic = diagnosticResult.rows[0].id_diagnostic;

        const atelierResult = await db.query("SELECT id_atelier FROM acc.atelier WHERE nom_atelier = $1", [nom_atelier]);
        if (atelierResult.rows.length === 0) {
            return res.status(400).json({ error: "atelier not found!" });
        }
        const id_atelier = atelierResult.rows[0].id_atelier;


        const technicienResult = await db.query("SELECT id_technicien FROM acc.technicien WHERE matricule_techn = $1", [matricule_techn]);
        if (technicienResult.rows.length === 0) {
            return res.status(400).json({ error: "technicien not found!" });
        }
        const id_technicien = technicienResult.rows[0].id_technicien;


        const formattedDateOrdre = moment(date_ordre, 'YYYY-MM-DD').format("YYYY-MM-DD");

        const sql = `UPDATE acc.ordre_travail SET id_diagnostic=$1, urgence_panne=$2, travaux=$3, 
        material_requis=$4, planning=$5, date_ordre=$6, 
        status=$7, id_atelier=$8, id_technicien=$9
        WHERE id_ordre = $10
        RETURNING *`;

        db.query(sql, [id_diagnostic, urgence_panne, travaux, material_requis, planning, formattedDateOrdre, status, id_atelier, id_technicien, id_ordre], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            // Vérifier si la mise à jour a bien eu lieu
            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Order not found!" });
            }

            return res.status(200).json({ message: "work order updated successfully!", order: result.rows[0] });
        });

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.delete = async (req, res) => {
    const id_ordre = Number(req.params.id_ordre);
    const sql = "DELETE FROM acc.ordre_travail WHERE id_ordre=$1 RETURNING *";

    db.query(sql, [id_ordre], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json({ message: "Order deleted successfully", order: result.rows });
    });
}

//selection
exports.getDiagnosticByPanne = async (req, res) => {
    const description_panne = req.params.description_panne;
    const sql = "SELECT description_panne, causes_panne, actions, date_diagnostic, heure_diagnostic FROM acc.diagnostic WHERE description_panne=$1";
    //idvehicule,
    db.query(sql, [description_panne], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(result.rows[0]);
    });
}

exports.getAtelierByNom = async (req, res) => {
    const nom_atelier = req.params.nom_atelier;
    const sql = "SELECT  nom_atelier, telephone, email, capacite FROM acc.atelier WHERE nom_atelier=$1";
    //idvehicule,
    db.query(sql, [nom_atelier], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(result.rows[0]);
    });
}

exports.getTechnicienByMatricule = async (req, res) => {
    const matricule_techn = req.params.matricule_techn;
    const sql = "SELECT  matricule_techn, nom, prenom, telephone_techn, email_techn, specialite FROM acc.technicien WHERE matricule_techn=$1";
    //idvehicule,
    db.query(sql, [matricule_techn], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(result.rows[0]);
    });
}

exports.updateStatus = async (req, res) => {
    const id_ordre = Number(req.params.id_ordre);
    const { status } = req.body;

    sql = "UPDATE acc.ordre_travail SET status=$1 WHERE id_ordre=$2";

    db.query(sql, [status, id_ordre], (err, result) => {
        if (err) res.status(500).json({ error: err.message });
        res.status(200).json({ message: "status updated successfully!", demande: result.rows });
    });
}
