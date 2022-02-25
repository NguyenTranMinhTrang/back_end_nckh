
const { response } = require('express')
const animal = require('../../models/animal')
const image = require('../../models/image')
const predict = require('../../../predict_models/predict')
var path = require('path');

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
        const { name, base64 } = req.body
        const filename = `${name} - ${Date.now()}.png`

        const buffer = Buffer.from(base64, 'base64');
        const id = await predict(buffer);

        animal.getById(id, (data) => {
            res.json({ result: data })
        })

        // fs.writeFile(`public/${filename}`, base64, { encoding: 'base64' }, function (err) {
        //     if (err) {
        //         res.send(err)
        //         return
        //     }
        //     else {
        //         console.log('File created!!')
        //         image.postImage(filename, (response) => {
        //             res.json({ message: response })
        //         })
        //     }
        // });

    }

    getImg(req, res) {

        res.sendFile(path.resolve(__dirname + '../../../../public/1_44.jpg'))
    }
}

module.exports = new APIControllers;