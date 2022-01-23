const express = require('express');
const router = express.Router();
const apiController = require('../app/controllers/APIControllers');


router.get('/image', apiController.image);


module.exports = router;