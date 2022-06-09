const pool = require('../config/db/dbpool')

const User = (user) => {
    this.id = user.id
    this.password = user.password
    this.email = user.email
    this.verified = user.verified
}

User.updateVerified = (id, verified) => {
    return new Promise(function (resolve, reject) {
        pool.query(`UPDATE user SET verified = '${verified}' WHERE id = '${id}';`, (err, data) => {
            if (err) {
                return reject(err)
            }
            return resolve(data)
        })
    });
}

User.findByEmail = (email) => {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT * FROM user WHERE email = '${email}'`, (err, data) => {
            if (err) {
                return reject(err)
            }
            return resolve(Object.values(data));

        })
    })
}

User.findByID = (id) => {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT * FROM user WHERE id = '${id}'`, (err, data) => {
            if (err) {
                return reject(err)
            }
            return resolve(Object.values(data))
        })
    })
}

User.save = (id, email, password, verified) => {
    return new Promise(function (resolve, reject) {
        pool.query(`INSERT INTO user(id,email,password,avatar,verified) VALUES ('${id}','${email}','${password}','','${verified}')`, (err, data) => {
            if (err) {
                return reject(err)
            }
            else {
                resolve(User.findByID(id))
            }
        })
    })
}

User.delete = (id) => {
    return new Promise(function (resolve, reject) {
        pool.query(`DELETE FROM user WHERE id = '${id}'`, (err, data) => {
            if (err) {
                return reject(err)
            }
            return resolve(data)
        })
    })
}

User.updatePassword = (id, newPassword) => {
    return new Promise(function (resolve, reject) {
        pool.query(`UPDATE user SET password = '${newPassword}' WHERE id = '${id}';`, (err, data) => {
            if (err) {
                return reject(err)
            }
            return resolve(data)
        })
    })
}

User.updateProfile = (id, profile) => {
    return new Promise(function (resolve, reject) {
        pool.query(`UPDATE user SET avatar = '${profile}' WHERE id = '${id}';`, (err, data) => {
            if (err) {
                return reject(err)
            }
            else {
                return resolve(data)
            }
        })
    })
}

module.exports = User;