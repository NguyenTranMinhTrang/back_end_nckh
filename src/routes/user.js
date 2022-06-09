const express = require('express');
const router = express.Router();
const { isAuth } = require('../middlewares/auth');
//Controllers
const userController = require('../controllers/User');
const historyController = require('../controllers/History');
const userVerificationControllers = require('../controllers/UserVerification');
const passwordReset = require('../controllers/PasswordReset')

const uploads = require('../middlewares/multer')

router.post('/signup', userController.handleSignup);

router.post('/login', userController.handleLogin);

router.post('/changePassword', userController.handleChangePassword)

router.post('/postHistory', historyController.postHistory)

router.post('/getHistory', historyController.getHistory)

router.post('/deleteHistory', historyController.deleteHistory)

router.post('/uploadProfile', isAuth, uploads.single('profile'), userController.uploadProfile)

router.get('/verify/:id/:uniqueString', userVerificationControllers.verifyEmail)

router.post('/resendVerificationLink', userVerificationControllers.resendVerificationLink)

router.post('/resetPassword', isAuth, userController.resetPassword)

router.post('/verifyPinCode', passwordReset.verifyPinCode)

router.post('/requestPasswordReset', passwordReset.requestPasswordReset)

router.post('/resendPIN', passwordReset.resendPIN)

router.get('/verified', userVerificationControllers.verified)

module.exports = router;