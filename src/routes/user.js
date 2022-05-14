const express = require('express');
const router = express.Router();
const { isAuth } = require('../middlewares/auth');
const userController = require('../app/controllers/UserControllers');
const uploads = require('../middlewares/multer')

router.post('/signup', userController.handleSignup);

router.post('/login', userController.handleLogin);

router.post('/changePassword', userController.handleChangePassword)

router.post('/postHistory', userController.postHistory)

router.post('/getHistory', userController.getHistory)

router.post('/uploadProfile', isAuth, uploads.single('profile'), userController.uploadProfile)

module.exports = router;