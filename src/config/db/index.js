const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'b8068a5f67c0f2',
    password: 'c823b7c6',
    database: 'heroku_ee6ef0c6e41f314'
});

connection.connect(function (err) {
    (err) ? console.log(err) : console.log('Connect successfully');
});


module.exports = connection;