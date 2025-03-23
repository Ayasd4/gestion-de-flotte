const db = require("../db/db");
const moment = require('moment');


exports.list = async (req, res) => {
    const sql = `SELECT d.id_demande, 
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
    d.statut
    FROM acc.demandes AS d
    JOIN acc.vehicule AS v ON d.id_vehicule = v.idvehicule
    JOIN acc.chauffeur AS c ON d.id_chauffeur = c.id_chauf;`;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(result.rows);
    });
}


exports.show = async (req, res) => {
    const id_demande = Number(req.params.id_demande);
    const sql = "SELECT * FROM acc.demandes WHERE id_demande=$1";

    db.query(sql, [id_demande], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(result.rows);
    });
}


exports.create = async (req, res) => {
    try {
        // Extraction des données depuis le corps de la requête
        const { date_demande, type_avarie, description, date_avarie, heure_avarie, statut, vehicule, chauffeur } = req.body;

        // Vérification que les données du véhicule et du chauffeur sont présentes
        if (!vehicule || !chauffeur) {
            return res.status(400).json({ error: "Missing vehicle or driver" });
        }

        const { numparc } = vehicule;
        const { nom } = chauffeur;

        // Vérification des données
        if (!numparc || !nom) {
            return res.status(400).json({ error: "Missing information for vehicle or driver" });
        }

        // 1. Récupérer l'ID du véhicule
        const vehiculeResult = await db.query("SELECT idvehicule FROM acc.vehicule WHERE numparc = $1", [numparc]);
        if (vehiculeResult.rows.length === 0) {
            return res.status(400).json({ error: "Vehicle not found!" });
        }
        const id_vehicule = vehiculeResult.rows[0].idvehicule;

        // 2. Récupérer l'ID du chauffeur
        const chauffeurResult = await db.query("SELECT id_chauf FROM acc.chauffeur WHERE nom = $1", [nom]);
        if (chauffeurResult.rows.length === 0) {
            return res.status(400).json({ error: "Driver not found!" });
        }
        const id_chauffeur = chauffeurResult.rows[0].id_chauf;

        // 3. Formater les dates
        const formattedDateDemande = moment(date_demande, 'YYYY-MM-DD').format("YYYY-MM-DD");
        const formattedDateAvarie = moment(date_avarie, 'YYYY-MM-DD').format("YYYY-MM-DD");

        // 4. Insérer la demande dans la base de données
        const sql = `
      INSERT INTO acc.demandes (date_demande, type_avarie, description, date_avarie, heure_avarie, statut, id_vehicule, id_chauffeur)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id_demande, date_demande, type_avarie, description, date_avarie, heure_avarie, statut, id_vehicule, id_chauffeur
    `;
        const result = await db.query(sql, [formattedDateDemande, type_avarie, description, formattedDateAvarie, heure_avarie, statut, id_vehicule, id_chauffeur]);

        // 5. Retourner la demande enregistrée avec les IDs
        return res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Erreur lors de la création de la demande:', err);
        return res.status(500).json({ error: err.message });
    }
};


exports.update = async (req, res) => {
    try {

        const id_demande = Number(req.params.id_demande);

        // Extraction des données depuis le corps de la requête
        const { date_demande, type_avarie, description, date_avarie, heure_avarie, statut, vehicule, chauffeur } = req.body;

        // Vérification que l'ID de la demande est bien fourni
        if (!id_demande) {
            return res.status(400).json({ error: "Missing ID of request " });
        }

                

        // Vérification que les données du véhicule et du chauffeur sont présentes
        if (!vehicule || !chauffeur) {
            return res.status(400).json({ error: "Missing driver or vehicle" });
        }

        const { numparc } = vehicule;
        const { nom } = chauffeur;

        // Vérification des données
        if (!numparc || !nom) {
            return res.status(400).json({ error: "Missing information for vehicle or driver" });
        }

        // 1. Récupérer l'ID du véhicule
        const vehiculeResult = await db.query("SELECT idvehicule FROM acc.vehicule WHERE numparc = $1", [numparc]);
        if (vehiculeResult.rows.length === 0) {
            return res.status(400).json({ error: "Vehicle not found!" });
        }
        const id_vehicule = vehiculeResult.rows[0].idvehicule;
        //const vehiculeInfo = vehiculeResult.rows[0];

        // 2. Récupérer l'ID du chauffeur
        const chauffeurResult = await db.query("SELECT id_chauf FROM acc.chauffeur WHERE nom = $1", [nom]);
        if (chauffeurResult.rows.length === 0) {
            return res.status(400).json({ error: "Driver not found" });
        }
        const id_chauffeur = chauffeurResult.rows[0].id_chauf;
        //const chauffeurInfo = chauffeurResult.rows[0];

        // 3. Formater les dates
        const formattedDateDemande = moment(date_demande, 'YYYY-MM-DD').format("YYYY-MM-DD");
        const formattedDateAvarie = moment(date_avarie, 'YYYY-MM-DD').format("YYYY-MM-DD");

        // 4. Mettre à jour la demande dans la base de données
        const sql = `
            UPDATE acc.demandes 
            SET date_demande = $1, type_avarie = $2, description = $3, date_avarie = $4, 
                heure_avarie = $5, statut = $6, id_vehicule = $7, id_chauffeur = $8 
            WHERE id_demande = $9 
            RETURNING *`;

        const result = await db.query(sql, [
            formattedDateDemande, type_avarie, description, formattedDateAvarie, heure_avarie, statut, id_vehicule, id_chauffeur, id_demande
        ]);

        
        // Vérifier si la mise à jour a bien eu lieu
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Demande non trouvée ou non mise à jour" });
        }

        // 5. Retourner la demande mise à jour
        return res.status(200).json({ message: "Demande mise à jour avec succès", demande: result.rows[0] });
       //return res.status(200).json({ message: "Demande mise à jour avec succès", demandeInfo: { ...vehiculeInfo, ...chauffeurInfo } });


    } catch (error) {
        console.error('Erreur lors de la mise à jour de la demande:', error);
        return res.status(500).json({ error: error.message });
    }
};


exports.delete = async (req, res) => {
    const id_demande = Number(req.params.id_demande);
    const sql = "DELETE FROM acc.demandes WHERE id_demande=$1";

    db.query(sql, [id_demande], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json({ message: "demand deleted successfully" });
    });
}


// Route pour obtenir les informations du véhicule par numparc
exports.getVehiculeByNumparc = async (req, res) => {
    const numparc = req.params.numparc;
    const sql = "SELECT  numparc, immatricule, modele FROM acc.vehicule WHERE numparc=$1";
    //idvehicule,
    db.query(sql, [numparc], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(result.rows[0]);
    });
}


// Route pour obtenir les informations du chauffeur par nom
exports.getChauffeurByNom = async (req, res) => {
    const nom = req.params.nom;
    const sql = "SELECT  nom, prenom, matricule_chauf, cin, telephone, email FROM acc.chauffeur WHERE nom=$1";
    //id_chauf,
    db.query(sql, [nom], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(result.rows[0]);
    });
}

exports.getDemande = async (req, res) => {
    const  id_demande  = req.params.id_demande;

    if (!id_demande) {
        return res.status(400).json({ error: 'id_demande is required' });
    }

    const sql = `SELECT d.*, 
                        v.numparc, 
                        v.immatricule,
                        v.modele,
                        c.nom,
                        c.prenom,
                        c.matricule_chauf,
                        c.telephone,
                        c.cin,
                        c.email
                 FROM acc.demandes AS d
                 JOIN acc.vehicule AS v ON d.id_vehicule = v.idvehicule
                 JOIN acc.chauffeur AS c ON d.id_chauffeur = c.id_chauf
                 WHERE d.id_demande = $1;`;

    db.query(sql, [id_demande], (err, result) => {
        if (err) return res.status(400).json({ error: err.message });

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Demande not found' });
        }
        
        return res.status(200).json(result.rows);
    });
}












/*exports.update = async (req, res) => {
    try {

        const id_demande = Number(req.params.id_demande);

        // Extraction des données depuis le corps de la requête
        const { date_demande, type_avarie, description, date_avarie, heure_avarie, statut, vehicule, chauffeur } = req.body;

        // Vérification que l'ID de la demande est bien fourni
        if (!id_demande) {
            return res.status(400).json({ error: "ID de la demande manquant" });
        }

        // Vérification que les données du véhicule et du chauffeur sont présentes
        if (!vehicule || !chauffeur) {
            return res.status(400).json({ error: "Véhicule ou chauffeur manquant" });
        }

        const { numparc } = vehicule;
        const { nom } = chauffeur;

        // Vérification des données
        if (!numparc || !nom) {
            return res.status(400).json({ error: "Informations manquantes pour le véhicule ou le chauffeur" });
        }

        // 1. Récupérer l'ID du véhicule
        const vehiculeResult = await db.query("SELECT idvehicule, numparc, immatricule, modele FROM acc.vehicule WHERE numparc = $1", [numparc]);
        if (vehiculeResult.rows.length === 0) {
            return res.status(400).json({ error: "Véhicule non trouvé" });
        }
        const id_vehicule = vehiculeResult.rows[0].idvehicule;
        //const vehiculeInfo = vehiculeResult.rows[0];

        // 2. Récupérer l'ID du chauffeur
        const chauffeurResult = await db.query("SELECT id_chauf, nom, prenom,matricule_chauf,cin,telephone, email FROM acc.chauffeur WHERE nom = $1", [nom]);
        if (chauffeurResult.rows.length === 0) {
            return res.status(400).json({ error: "Chauffeur non trouvé" });
        }
        const id_chauffeur = chauffeurResult.rows[0].id_chauf;
        //const chauffeurInfo = chauffeurResult.rows[0];

        // 3. Formater les dates
        const formattedDateDemande = moment(date_demande, 'YYYY-MM-DD').format("YYYY-MM-DD");
        const formattedDateAvarie = moment(date_avarie, 'YYYY-MM-DD').format("YYYY-MM-DD");

        // 4. Mettre à jour la demande dans la base de données
        const sql = `
            UPDATE acc.demandes 
            SET date_demande = $1, type_avarie = $2, description = $3, date_avarie = $4, 
                heure_avarie = $5, statut = $6, id_vehicule = $7, id_chauffeur = $8 
            WHERE id_demande = $9 
            RETURNING *`;

        const result = await db.query(sql, [
            formattedDateDemande, type_avarie, description, formattedDateAvarie, heure_avarie, statut, id_vehicule, id_chauffeur, id_demande
        ]);

        
        // Vérifier si la mise à jour a bien eu lieu
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Demande non trouvée ou non mise à jour" });
        }

        // 5. Retourner la demande mise à jour
        return res.status(200).json({ message: "Demande mise à jour avec succès", demande: result.rows[0] });
       //return res.status(200).json({ message: "Demande mise à jour avec succès", demandeInfo: { ...vehiculeInfo, ...chauffeurInfo } });


    } catch (error) {
        console.error('Erreur lors de la mise à jour de la demande:', error);
        return res.status(500).json({ error: error.message });
    }
};*/
