const express = require('express');
const router = express.Router();
const poiController = require('../controllers/poiController');

router.get('/getAllPOI', poiController.getAllPOI);
router.post('/createPOI', poiController.createPOI);
router.delete('/deletePOI:id', poiController.deletePOI);

module.exports = router;