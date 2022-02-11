const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nckh'
});

connection.connect(function (err) {
    (err) ? console.log(err) : console.log('Connect successfully');
});


module.exports = connection;