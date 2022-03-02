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

User.save = (name, email, password, result) => {
    db.query(`INSERT INTO user(name,email,password) VALUES ('${name}','${email}','${password}')`, (err, data) => {
        if (err) {
            result({ error: err })
        }
        else {
            result(data);
        }
    })
}

module.exports = User;