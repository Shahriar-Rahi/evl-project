const express = require('express');
const userController = require('../controllers/user')
const router = express.Router();


router.get('/get-user', userController.getUser);
router.post('/add-user', userController.addUser);
router.put('/update-user/:userId', userController.updateUser);
router.delete('/delete-user/:userId', userController.deleteUser);

module.exports = router;