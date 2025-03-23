const db = require("../db/db");

//methode get
exports.list = async(req, res) => {
    const sql = "SELECT * FROM acc.vehicule";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({error: err.message});
        return res.status(200).json(result.rows);
    });
}

//methode get par id
exports.show = async(req, res) =>{
    const valueId = Number(req.params.idvehicule); 
    const sql = "SELECT * FROM acc.vehicule where idvehicule=$1";
    db.query(sql, [valueId], (err, result) => {
        if (err) return res.status(500).json({error: err.message});
        return res.status(200).json(result.rows);
    });
}

//methode post
exports.create = async(req, res)=>{
    const { numparc, immatricule, modele, annee, etat } = req.body;
    const sql = "INSERT INTO acc.vehicule(numparc, immatricule, modele, annee, etat) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    db.query(sql, [numparc, immatricule, modele, annee, etat], (err, result) => {
        if (err) return res.status(500).json({error: err.message});
        return res.status(200).json({ message: "vehicule created", vehicule: result.rows[0] });
    });
}

//methode put
exports.update= async(req, res)=>{
    const valueId = Number(req.params.idvehicule);
    const { numparc, immatricule, modele, annee, etat } = req.body;
    const sql = "UPDATE acc.vehicule SET numparc=$1, immatricule=$2, modele=$3, annee=$4, etat=$5 WHERE idvehicule=$6";
    db.query(sql, [numparc, immatricule, modele, annee, etat,valueId], (err, result) => {
        if (err) return res.status(500).json({error: err.message});
        return res.status(200).json({ message: "vehicule modifié", vehicule: result.rows[0] });
    });
}

//methode delete
exports.delete= async(req, res)=>{
    const valueId = Number(req.params.idvehicule);
    const sql = "DELETE FROM acc.vehicule WHERE idvehicule=$1 RETURNING idvehicule";
    db.query(sql, [valueId], (err, result) => {
        if (err) return res.status(500).json({error: err.message});
        return res.status(200).json({ message: "vehicule supprimer", daletedId: result.rows[0]?.idvehicule });
    });
}

