const express = require('express');
const router = express.Router();
const intershipService = require('../services/intership');

router.post('/', async (req, res) => {
  try {
    const created = await intershipService.createDemande(req.body);
    return res.status(201).json(created);
  } catch (err) {
    const status = err.status || 500;
    const message = err.message || 'Erreur serveur';
    return res.status(status).json({ error: message });
  }
});


router.get('/', async (req, res) => {
  try {
    const listes = await intershipService.listDemandes();
    return res.status(200).json(listes);
  } catch (err) {
    const status = err.status || 500;
    const message = err.message || 'Erreur serveur';
    return res.status(status).json({ error: message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const demande = await intershipService.getDemandeById(req.params.id);
    return res.status(200).json(demande);
  } catch (err) {
    const status = err.status || 500;
    const message = err.message || 'Erreur serveur';
    return res.status(status).json({ error: message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await intershipService.updateDemandeStatus(req.params.id, status);
    return res.status(200).json(updated);
  } catch (err) {
    const statusCode = err.status || 500;
    const message = err.message || 'Erreur serveur';
    return res.status(statusCode).json({ error: message });
  }
});

module.exports = router;