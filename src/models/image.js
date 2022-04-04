const db = require('../config/db/dbpool')

const Image = (image) => {
    this.id = image.id;
    this.name = image.name;
}

Image.getAll = (result) => {
    db.query('SELECT * FROM user_image', (err, image) => {
        if (err) {
            result({ error: err })
        }
        else {
            result(image)
        }
    })
}

Image.getById = (id, result) => {
    db.query(`SELECT * FROM user_image WHERE id = ${id}`, (err, image) => {
        if (err) {
            result({ error: err })
        }
        else if (image.length == 0) {
            result(null)
        }
        else {
            result(image[0])
        }
    })
}

Image.postImage = (name, response) => {
    db.query(`INSERT INTO user_image (image) VALUES ('${name}')`, function (err, result) {
        if (err) {
            response(err)
        }
        else {
            response('Upload successfull');
        }
    });
}

module.exports = Image;

