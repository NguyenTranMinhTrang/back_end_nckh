const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/UserControllers');

router.use('/signup', userController.handleSignup);

router.use('/login', userController.handleLogin);

router.use('/changePassword', userController.handleChangePassword)

module.exports = router;