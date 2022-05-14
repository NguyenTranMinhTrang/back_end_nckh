const express = require('express');
const router = express.Router();
const apiController = require('../app/controllers/APIControllers');
const uploads = require('../middlewares/multer')

router.get('/animal/:id', apiController.detail);

router.get('/animal', apiController.animal);

router.get('/image/:id', apiController.imageDetail);

router.get('/image', apiController.image);

router.post('/image', uploads.single('image'), apiController.imagePredict);

module.exports = router;