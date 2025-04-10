const db = require("../db/db");
const moment = require("moment");
//const { content } = require("pdfkit/js/page");
const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.generatePdf = async (req, res) => {
    try {
        const id_ordre = Number(req.params.id_ordre);

        console.log('ID Order received:', id_ordre);

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
    tech.telephone_techn,
    tech.specialite,
    v.numparc
    FROM acc.ordre_travail AS o
    JOIN acc.diagnostic AS diag ON o.id_diagnostic = diag.id_diagnostic
    JOIN acc.atelier AS a ON o.id_atelier = a.id_atelier
    JOIN acc.technicien AS tech ON o.id_technicien = tech.id_technicien
    JOIN acc.demandes AS d ON diag.id_demande = d.id_demande
    JOIN acc.vehicule AS v ON d.id_vehicule = v.idvehicule
    WHERE id_ordre=$1`;


        db.query(sql, [id_ordre], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Order Not Found!' });
            }

            const ordre = result.rows[0];


            // Création du PDF
            const doc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');

            doc.pipe(res); // envoyer directement dans la réponse


            const logoPath = 'assets/srtj.png'; // chemin relatif vers ton logo
            if (fs.existsSync(logoPath)) {
                doc.image(logoPath, 50, 30, { width: 50 }); // x = 50, y = 30, largeur = 80
                doc.moveDown(); // petit espace après le logo

                doc.fontSize(12).font('Helvetica-Bold').text('S.R.T JENDOUBA', 400, 30, { align: 'left' });
                doc.fontSize(11).font('Helvetica').text('Division Technique', 400, 50, { align: 'left' });
                doc.font('Helvetica').text('Service Maintenance', 400, 65, { align: 'left' });
                
                /*doc.fontSize(12).font('Helvetica-Bold').text('S.R.T JENDOUBA', { align: 'right' });
                //doc.moveDown()
                doc.font('Helvetica').text('Division Technique', { align: 'right' });
                //doc.moveDown()
                doc.font('Helvetica').text('service Maintenance', { align: 'right' });*/
            }
            doc.x = 50;

            doc.moveTo(50, 100).lineTo(550, 100).stroke();
            doc.moveDown(3); 
            //doc.y = 120;
            doc.fontSize(25)
                .font('Helvetica')
                .text(`Ordre de travail N° ${ordre.id_ordre} - SRT Jendouba`, {
                    align: 'center',
                    underline: true,
                });
            doc.moveDown(1);

            doc.fontSize(13).font('Helvetica-Bold').text(`Numéro de Vehicule: ${ordre.numparc}`);
            doc.moveDown(1);

            //diagnostic
            doc.fontSize(15).font('Helvetica-Bold').text('Diagnostic et controle:',50, doc.y, { underline: true });
            doc.font('Helvetica').text(`Description de panne: ${ordre.description_panne}`)
            doc.font('Helvetica').text(`causes: ${ordre.causes_panne}`);
            doc.font('Helvetica').text(`Actions: ${ordre.actions}`);
            doc.font('Helvetica').text(`Date de diagnostic: ${ordre.date_diagnostic}`);
            doc.font('Helvetica').text(`heure de diagnostic: ${ordre.heure_diagnostic}`);

            doc.moveDown(1);

            //atelier
            doc.fontSize(15).font('Helvetica-Bold').text('Atelier de réparation:', { underline: true });
            doc.font('Helvetica').text(`• Nom de l'atelier: ${ordre.nom_atelier}`);
            doc.font('Helvetica').text(`• Email: ${ordre.email}`);
            doc.font('Helvetica').text(`• Capacité d'accueil : ${ordre.capacite}`);
            doc.font('Helvetica').text(`• Telephone: ${ordre.telephone}`);

            doc.moveDown(1);

            //technicien
            doc.fontSize(15).font('Helvetica-Bold').text('Technicien Concerné :', { underline: true });
            doc.font('Helvetica').text(`Numéro de technicien: ${ordre.matricule_techn}`);
            doc.font('Helvetica').text(`Nom: ${ordre.nom} ${ordre.prenom}`);
            doc.font('Helvetica').text(`E-mail: ${ordre.email_techn}`);
            doc.font('Helvetica').text(`Téléphone: ${ordre.telephone_techn}`);
            doc.font('Helvetica').text(`Specialité: ${ordre.specialite}`);

            doc.fontSize(14).font('Helvetica').text('----------------------------------------------------------------------------------------------------');

            doc.moveDown(1);
            
            // Informations de la demande
            doc.fontSize(14).font('Helvetica');
            doc.font('Helvetica-Bold').text(`Information sur L'ordre de travail ${ordre.id_ordre}`);
            doc.font('Helvetica').text(`Travaux Effectué: ${ordre.travaux}`);
            doc.font('Helvetica').text(`Materiel Requis: ${ordre.material_requis}`);
            doc.font('Helvetica').text(`Plannification de L'intervention: ${ordre.planning}`);
            doc.font('Helvetica').text(`Date de création: ${ordre.date_ordre?.toLocaleDateString?.() || ordre.date_ordre}`);

            doc.moveDown(1); // saut de 2 lignes

            const y = doc.y + 20; // position verticale actuelle + un petit espace

            doc.fontSize(12);
            doc.text('Jendouba le  ......./....../.........', 50, y); // côté gauche
            doc.text('Signature Chef Service', 467, y);   // côté droit

            doc.end();

        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
} 

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
    tech.specialite,
    v.numparc
    FROM acc.ordre_travail AS o
    JOIN acc.diagnostic AS diag ON o.id_diagnostic = diag.id_diagnostic
    JOIN acc.atelier AS a ON o.id_atelier = a.id_atelier
    JOIN acc.technicien AS tech ON o.id_technicien = tech.id_technicien
    JOIN acc.demandes AS d ON diag.id_demande = d.id_demande
    JOIN acc.vehicule AS v ON d.id_vehicule = v.idvehicule;`;

    //-- Jointure avec demandes
    //-- Jointure avec vehicule à partir de demandes

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
