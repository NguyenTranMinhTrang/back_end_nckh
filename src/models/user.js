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

User.saveUser = (id, email, password, result) => {
    pool.query(`INSERT INTO user(id,email,password) VALUES ('${id}','${email}','${password}')`, (err, data) => {
        if (err) {
            result({ error: err })
        }
        else {
            result(data);
        }
    })
}

User.saveHistory = (id, url, time, result) => {
    pool.query(`INSERT INTO history(id,url,time) VALUES ('${id}','${url}','${time}')`, (err, data) => {
        if (err) {
            result({ error: err })
        }
        else {
            result(data);
        }
    })
}

User.findHistory = (id, result) => {
    pool.query(`SELECT * FROM history WHERE id = '${id}'`, (err, data) => {
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

module.exports = User;