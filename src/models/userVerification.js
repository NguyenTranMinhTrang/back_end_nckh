const pool = require('../config/db/dbpool')

const UserVerification = (userVrf) => {
    this.userId = userVrf.userId
    this.uniqueString = userVrf.uniqueString
    this.createdAt = userVrf.createdAt
    this.expiresAt = userVrf.expiresAt
}

UserVerification.save = (userId, uniqueString, createdAt, expiresAt) => {
    return new Promise(function (resolve, reject) {
        pool.query(`INSERT INTO user_verification(userId,uniqueString,createdAt,expiresAt) VALUES ('${userId}','${uniqueString}','${createdAt}','${expiresAt}')`, (err, data) => {
            if (err) {
                return reject(err)
            }
            else {
                return resolve(data);
            }
        })
    })
}

UserVerification.delete = (userId) => {
    return new Promise(function (resolve, reject) {
        pool.query(`DELETE FROM user_verification WHERE userId = '${userId}'`, (err, data) => {
            if (err) {
                return reject(err)
            }
            else {
                return resolve(data);
            }
        })
    })
}

UserVerification.find = (userId) => {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT * FROM user_verification WHERE userId = '${userId}'`, (err, data) => {
            if (err) {
                return reject(err)
            }
            else {
                return resolve(Object.values(data));
            }
        })
    })
}

module.exports = UserVerification;