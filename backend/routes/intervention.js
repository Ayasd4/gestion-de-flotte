const express = require("express");
const router = express.Router();
const interventionController = require("../controllers/intervention");

router.get('/', async (req, res) => {
    await interventionController.list(req, res);
});

router.get('/:id_intervention', async (req, res) => {
    await interventionController.show(req, res);
});

router.post('/', async (req, res) => {
    await interventionController.create(req, res);
});

router.put('/:id_intervention', async (req, res) => {
    await interventionController.update(req, res);
});

router.delete('/:id_intervention', async (req, res) => {
    await interventionController.delete(req, res);
});

router.get('/ordre/:travaux', interventionController.getOrdreByTravaux);
router.get('/technicien/:matricule_techn', interventionController.getTechnicienByMatricule);


module.exports = router;