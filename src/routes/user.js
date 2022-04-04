const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/UserControllers');

router.post('/signup', userController.handleSignup);

router.post('/login', userController.handleLogin);

router.post('/changePassword', userController.handleChangePassword)

router.post('/postHistory', userController.postHistory)

router.get('/getHistory', userController.getHistory)

module.exports = router;