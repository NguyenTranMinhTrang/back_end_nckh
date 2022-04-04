const mysql = require('mysql');

var db_config = {
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'b8068a5f67c0f2',
    password: 'c823b7c6',
    database: 'heroku_ee6ef0c6e41f314'
};

var pool = mysql.createPool(db_config);

module.exports = pool;