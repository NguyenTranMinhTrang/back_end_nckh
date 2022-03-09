const db = require('../config/db/index')

const User = (user) => {
    this.userName = user.userName
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

User.save = (email, password, result) => {
    db.query(`INSERT INTO user(email,password) VALUES ('${email}','${password}')`, (err, data) => {
        if (err) {
            result({ error: err })
        }
        else {
            result(data);
        }
    })
}

module.exports = User;