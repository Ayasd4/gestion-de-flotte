const express = require("express");
const router = express.Router();

const diagnosticControllers = require("../controllers/diagnostic");

router.get('/', async (req, res)=>{
    await diagnosticControllers.list(req,res);
});

router.get('/:id_diagnostic', async (req, res)=>{
    await diagnosticControllers.show(req,res);
});

router.post('/', async (req, res)=>{
    await diagnosticControllers.create(req,res);
});

router.put('/:id_diagnostic', async (req, res)=>{
    await diagnosticControllers.update(req,res);
});

router.delete('/:id_diagnostic', async (req, res)=>{
    await diagnosticControllers.delete(req,res);
});


module.exports = router;