const db = require("../db/db");

exports.list = async (req, res) =>{
    sql = "SELECT * FROM acc.atelier";

    db.query(sql, (err, result)=>{
        if(err) return res.status(500).json({error: err.message});

        return res.status(200).json(result.rows);
    });
}

exports.show = async (req, res) =>{
    const id_atelier = Number(req.params.id_atelier);
    sql = "SELECT * FROM acc.atelier WHERE id_atelier=$1";

    db.query(sql, [id_atelier], (err, result)=>{
        if(err) return res.status(500).json({error: err.message});

        if(!id_atelier){
            return res.status(400).json({ error: "id_atelier not found!" });
        }else{
            return res.status(200).json(result.rows[0]);
        }
    });
}

exports.create = async (req, res) =>{
    const {nom_atelier, telephone, email, capacite, statut} = req.body;

    sql = "INSERT INTO acc.atelier(nom_atelier, telephone, email, capacite, statut) VALUES ($1, $2, $3, $4, $5) RETURNING *";

    db.query(sql,[nom_atelier, telephone, email, capacite, statut], (err, result)=>{
        if(err) return res.status(500).json({error: err.message});
        
        return res.status(200).json({message: "Workshop created successfully!", atelier: result.rows[0]});
    });
}

exports.update = async (req, res) =>{
    const id_atelier = Number(req.params.id_atelier);

    const {nom_atelier, telephone, email, capacite, statut} = req.body;

    sql = "UPDATE acc.atelier SET nom_atelier=$1, telephone=$2, email=$3, capacite=$4, statut=$5 WHERE id_atelier=$6"

    db.query(sql,[nom_atelier, telephone, email, capacite, statut, id_atelier], (err, result)=>{
        if(err) return res.status(500).json({error: err.message});

        if(id_atelier){
            return res.status(200).json({message: "Workshop updated successfully!", atelier: result.rows[0]});
        }else{
            return res.status(500).json({error: "id_atelier not found!"});
        }

    });
}

exports.delete = async (req, res) =>{
    const id_atelier = Number(req.params.id_atelier);
    sql = "DELETE FROM acc.atelier WHERE id_atelier=$1 RETURNING id_atelier";

    db.query(sql, [id_atelier], (err, result)=>{
        if(err) return res.status(500).json({error: err.message});

        return res.status(200).json({message: "Workshop deleted successfully!", atelier: result.rows[0]});
    });
}