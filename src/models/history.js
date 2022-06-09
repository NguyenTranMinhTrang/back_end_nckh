const pool = require('../config/db/dbpool')

const History = (history) => {
    this.id = history.id
    this.time = history.time
    this.animalID = history.animalID
}

History.save = (id, animalID, time) => {
    return new Promise(function (resolve, reject) {
        pool.query(`INSERT INTO history(id,animalID,time) VALUES ('${id}',${animalID},'${time}')`, (err, data) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(data);
            }
        })
    })
}

History.find = (id) => {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT h.animalID, a.name, a.img, h.time FROM history h, animal a WHERE h.id = '${id}' and h.animalID = a.id`, (err, data) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(Object.values(data));
            }
        })
    })
}

History.delete = (id, animalID, time) => {
    return new Promise(function (resolve, reject) {
        pool.query(`DELETE FROM history WHERE id = '${id}' AND animalID = '${animalID}' AND time = '${time}'`, (err, data) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(data);
            }
        })
    })
}

module.exports = History;