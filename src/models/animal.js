const db = require('../config/db/index')

const Animal = (animal) => {
    this.id = animal.id;
    this.name = animal.name;
    this.img = img;
    this.sciencename = sciencename;
    this.conservation = conservation;
    this.description = description;
}

Animal.getAll = (result) => {
    db.query('SELECT * FROM animal', (err, animal) => {
        if (err) {
            result({ error: err })
        } else {
            result(animal)
        }
    })
}

Animal.getById = (id, result) => {
    db.query(`SELECT * FROM animal WHERE id = ${id}`, (err, animal) => {
        if (err) {
            result({ error: err })
        }
        else if (animal.length == 0) {
            result(null)
        }
        else {
            result(animal[0])
        }
    })
}

module.exports = Animal;