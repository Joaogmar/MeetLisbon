const express = require('express');
const router = express.Router();
const poiController = require('../controllers/poiController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/getAllPOI', poiController.getAllPOI);
router.post('/createPOI', poiController.createPOI);
router.delete('/deletePOI:id', poiController.deletePOI);
router.get('/getFavoritedPOIs', authenticateToken, poiController.getFavoritedPOIs);
router.post('/favoritePOI', authenticateToken, poiController.favoritePOI);
router.delete('/removeFavoritePOI/:poi_id', authenticateToken, poiController.removeFavoritePOI);

router.post('/routes/save', authenticateToken, poiController.saveUserRoute);
router.delete('/routes/delete/:fr_id', authenticateToken, poiController.deleteUserRoute);
router.get('/routes', authenticateToken, poiController.showUserRoutes);  

module.exports = router;