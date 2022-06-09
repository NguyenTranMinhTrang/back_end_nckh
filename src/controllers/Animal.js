const Animal = require('../models/animal')
const predict = require('../../predict_models/predict')
class AnimalControllers {
    // [GET] api/animal

    async animal(req, res) {
        try {
            const animals = await Animal.getAll()
            res.json({
                status: "SUCCESS",
                data: animals
            })
        } catch (error) {
            res.json({
                status: "FAILED",
                message: error.message
            })
        }

    }

    // [GET] api/animal
    async animalById(req, res) {
        try {
            const animal = await Animal.getById(req.query.id)
            res.json({
                status: "SUCCESS",
                data: animal[0]
            })
        } catch (error) {
            res.json({
                status: "FAILED",
                message: error.message
            })
        }

    }

    // [GET] api/animal/id
    async detail(req, res) {
        try {
            const animal = await Animal.getById(req.params.id)
            res.json({
                status: "SUCCESS",
                data: animal[0]
            })
        } catch (error) {
            res.json({
                status: "FAILED",
                message: error.message
            })
        }
    }

    //[POST] api/image
    async imagePredict(req, res) {
        try {
            const { base64 } = req.body
            const fileBuffer = Buffer.from(base64, 'base64');

            const id = await predict(fileBuffer);
            if (id >= 1 && id <= 30) {
                const animal = await Animal.getById(id)
                res.json({
                    status: 'SUCCESS',
                    data: animal[0]
                })
            }
            else {
                throw Error('Dự đoán ảnh không thành công!! Hãy thử lại')
            }

        } catch (error) {
            res.json({
                status: 'FAILED',
                message: error.message
            })
        }

    }
}

module.exports = new AnimalControllers;