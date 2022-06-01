const animal = require('../../models/animal')
const image = require('../../models/image')
const predict = require('../../../predict_models/predict')
const fs = require('fs')
class APIControllers {
    // [GET] api/animal

    animal(req, res) {
        animal.getAll((data) => {
            res.json({ result: data })
        })
    }

    // [GET] api/animal/id
    detail(req, res) {
        animal.getById(req.params.id, (data) => {
            res.json({ result: data })
        })
    }

    // [GET] api/image
    image(req, res) {
        image.getAll((data) => {
            res.json({ result: data })
        })
    }

    // [GET] api/image/id    
    imageDetail(req, res) {
        image.getById(req.params.id, (data) => {
            res.json({ result: data })
        })
    }

    //[POST] api/image
    async imagePredict(req, res) {
        const { base64 } = req.body
        const fileBuffer = Buffer.from(base64, 'base64');
        try {
            const id = await predict(fileBuffer);
            if (id >= 1 && id <= 30) {
                animal.getById(id, (data) => {
                    res.json({
                        status: 'SUCCESS',
                        result: data
                    })
                })
            }
            else {
                res.json({
                    status: 'FAILED',
                    message: 'Fail to predict the image!! Please try again'
                })
            }
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }
}

module.exports = new APIControllers;