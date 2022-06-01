const pool = require('../config/db/dbpool')

const User = (user) => {
    this.id = user.id
    this.password = user.password
    this.email = user.email
}

User.findUser = (email, result) => {
    pool.query(`SELECT * FROM user WHERE email = '${email}'`, (err, data) => {
        if (err) {
            result({ error: err })
        }
        else {
            result(data);
        }
    })
}

User.findUserByID = (id, result) => {
    pool.query(`SELECT * FROM user WHERE id = '${id}'`, (err, data) => {
        if (err) {
            result({ error: err })
        }
        else {
            result(data);
        }
    })
}

User.saveUser = (id, email, password, result) => {
    pool.query(`INSERT INTO user(id,email,password,avatar) VALUES ('${id}','${email}','${password}','')`, (err, data) => {
        if (err) {
            result({ error: err })
        }
        else {
            result(data);
        }
    })
}

User.saveHistory = (id, animalID, time, result) => {
    pool.query(`INSERT INTO history(id,animalID,time) VALUES ('${id}',${animalID},'${time}')`, (err, data) => {
        if (err) {
            result({ error: err })
        }
        else {
            result(data);
        }
    })
}

User.findHistory = (id, result) => {
    pool.query(`SELECT h.animalID, a.name, a.img, h.time FROM history h, animal a WHERE h.id = '${id}' and h.animalID = a.id`, (err, data) => {
        if (err) {
            result({ error: err })
        }
        else {
            result(data);
        }
    })
}

User.updatePassword = (email, newPassword, result) => {
    pool.query(`UPDATE user SET password = '${newPassword}' WHERE email = '${email}';`, (err, data) => {
        if (err) {
            result({ error: err })
        }
        else {
            result(data);
        }
    })
}

User.updateProfile = (id, profile, result) => {
    pool.query(`UPDATE user SET avatar = '${profile}' WHERE id = '${id}';`, (err, data) => {
        if (err) {
            result({ error: err })
        }
        else {
            result(data);
        }
    })
}

module.exports = User;