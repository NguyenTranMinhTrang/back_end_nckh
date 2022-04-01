const db = require('../config/db/index')

const User = (user) => {
    this.id = user.id
    this.password = user.password
    this.email = user.email
}

User.find = (email, result) => {
    db.query(`SELECT * FROM user WHERE email = '${email}'`, (err, data) => {
        if (err) {
            result({ error: err })
        }
        else {
            result(data);
        }
    })
}

User.save = (id, email, password, result) => {
    db.query(`INSERT INTO user(id,email,password) VALUES ('${id}','${email}','${password}')`, (err, data) => {
        if (err) {
            result({ error: err })
        }
        else {
            result(data);
        }
    })
}

User.saveHistory = (id, url, time, result) => {
    db.query(`INSERT INTO history(id,url,time) VALUES ('${id}','${url}','${time}')`, (err, data) => {
        if (err) {
            result({ error: err })
        }
        else {
            result(data);
        }
    })
}

User.updatePassword = (email, newPassword, result) => {
    db.query(`UPDATE user SET password = '${newPassword}' WHERE email = '${email}';`, (err, data) => {
        if (err) {
            result({ error: err })
        }
        else {
            result(data);
        }
    })
}

module.exports = User;