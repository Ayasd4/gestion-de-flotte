const express = require("express");
const router = express.Router();
const demandesController = require("../controllers/demandes");

router.get('/', async (req, res) => {
    await demandesController.list(req, res);
});

router.get('/:id_demande', async (req, res) => {
    await demandesController.show(req, res);
});

router.get('/getDemande/:id_demande', async (req, res)=>{
    await demandesController.getDemande(req, res);
});

router.post('/', async (req, res) => {
    await demandesController.create(req, res);
});

router.put('/:id_demande', async (req, res) => {
    await demandesController.update(req, res);
});

router.delete('/:id_demande', async (req, res) => {
    await demandesController.delete(req, res);
});

router.get('/vehicule/:numparc', demandesController.getVehiculeByNumparc);
router.get('/chauffeur/:nom', demandesController.getChauffeurByNom);

module.exports = router;