const express = require("express");
const router = express.Router();
const ordreController = require("../controllers/ordre");

router.get('/', async (req, res) => {
    await ordreController.list(req, res);
});

router.get('/:id_ordre', async (req, res) => {
    await ordreController.show(req, res);
});

router.post('/', async (req, res) => {
    await ordreController.create(req, res);
});

router.put('/:id_ordre', async (req, res) => {
    await ordreController.update(req, res);
});

router.delete('/:id_ordre', async (req, res) => {
    await ordreController.delete(req, res);
});

router.put('/status/:id_ordre', async (req, res) => {
    await ordreController.updateStatus(req, res);
});

router.get('/diagnostic/:description_panne', ordreController.getDiagnosticByPanne);
router.get('/atelier/:nom_atelier', ordreController.getAtelierByNom);
router.get('/technicien/:matricule_techn', ordreController.getTechnicienByMatricule);


module.exports = router;