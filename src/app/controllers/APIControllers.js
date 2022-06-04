const animal = require('../../models/animal')
const predict = require('../../../predict_models/predict')
const fs = require('fs')
class APIControllers {
    // [GET] api/animal

    animal(req, res) {
        animal.getAll((result) => {
            if (result.error) {
                res.json({
                    status: "FAILED",
                    message: "An erorr occurred while searching animal ID!",
                });
            }
            else {
                res.json({
                    status: "SUCCESS",
                    data: result
                })
            }
        })
    }

    // [GET] api/animal/id
    animalById(req, res) {
        animal.getById(req.query.id, (result) => {
            if (result.error) {
                res.json({
                    status: "FAILED",
                    message: "An erorr occurred while searching animal ID!",
                });
            }
            else {
                res.json({
                    status: "SUCCESS",
                    data: result
                })
            }
        })
    }

    // [GET] api/animal/id
    detail(req, res) {
        animal.getById(req.params.id, (result) => {
            if (result.error) {
                res.json({
                    status: "FAILED",
                    message: "An erorr occurred while searching animal ID!",
                });
            }
            else {
                res.json({
                    status: "SUCCESS",
                    data: result
                })
            }
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
                        data: data
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