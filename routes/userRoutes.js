const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/getAllUsers', userController.getAllUsers);
router.get('/getAllAdmins', userController.getAllAdmins);
router.delete('/deleteUser/:id', userController.deleteUser);
router.patch('/promoteToAdmin/:id', userController.promoteToAdmin);
router.patch('/demoteToUser/:id', userController.demoteToUser);

module.exports = router;