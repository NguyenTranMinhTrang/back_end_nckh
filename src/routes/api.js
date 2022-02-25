const express = require('express');
const router = express.Router();
const apiController = require('../app/controllers/APIControllers');

router.get('/animal/:id', apiController.detail);

router.get('/animal', apiController.animal);

router.get('/image/:id', apiController.imageDetail);

router.get('/image', apiController.image);

router.post('/image', apiController.imagePredict);

router.get('/getImg', apiController.getImg)


module.exports = router;