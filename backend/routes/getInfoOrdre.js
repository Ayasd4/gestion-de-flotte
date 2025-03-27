const express = require("express");
const router = express.Router();
const infosController = require('../controllers/getInfoOrdre');

//les infos
router.get('/diagnostic', async (req, res) => {
    await infosController.getAllDiagnostic(req, res);
});

router.get('/atelier', async (req, res) => {
    await infosController.getAllAtelier(req, res);
});

router.get('/technicien', async (req, res) => {
    await infosController.getAllTechnicien(req, res);
});


module.exports = router;
