const pool = require('../config/db/dbpool')

const passReset = (passReset) => {
    this.email = passReset.email
    this.pin = passReset.pin
    this.createdAt = passReset.createdAt
    this.expiresAt = passReset.expiresAt
}

passReset.save = (email, pin, createdAt, expiresAt) => {
    return new Promise(function (resolve, reject) {
        pool.query(`INSERT INTO password_reset(email,pin,createdAt,expiresAt) VALUES ('${email}','${pin}','${createdAt}','${expiresAt}')`, (err, data) => {
            if (err) {
                return reject(err)
            }
            else {
                return resolve(data);
            }
        })
    })
}

passReset.delete = (email) => {
    return new Promise(function (resolve, reject) {
        pool.query(`DELETE FROM password_reset WHERE email = '${email}'`, (err, data) => {
            if (err) {
                return reject(err)
            }
            else {
                return resolve(data);
            }
        })
    })
}

passReset.find = (email) => {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT * FROM password_reset WHERE email = '${email}'`, (err, data) => {
            if (err) {
                return reject(err)
            }
            else {
                return resolve(Object.values(data));
            }
        })
    })
}

module.exports = passReset;