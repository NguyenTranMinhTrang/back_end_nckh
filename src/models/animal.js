const db = require('../config/db/dbpool')

const Animal = (animal) => {
    this.id = animal.id;
    this.name = animal.name;
    this.img = img;
    this.sciencename = sciencename;
    this.conservation = conservation;
    this.description = description;
}

Animal.getAll = () => {
    return new Promise(function (resolve, reject) {
        db.query('SELECT * FROM animal', (err, animal) => {
            if (err) {
                return reject(err)
            } else {
                return resolve(animal)
            }
        })
    })
}

Animal.getById = (id) => {
    return new Promise(function (resolve, reject) {
        db.query(`SELECT * FROM animal WHERE id = ${id}`, (err, animal) => {
            if (err) {
                return reject(err)
            }
            else {
                return resolve(animal)
            }
        })
    })
}

module.exports = Animal;