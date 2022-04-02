const mysql = require('mysql');

var db_config = {
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'b8068a5f67c0f2',
    password: 'c823b7c6',
    database: 'heroku_ee6ef0c6e41f314'
};

var pool = mysql.createPool(db_config);

// var connection;

// function handleDisconnect() {
//     connection = mysql.createConnection(db_config);

//     connection.connect(function (err) {
//         if (err) {
//             console.log('error when connecting to db:', err);
//             setTimeout(handleDisconnect, 2000);
//         }
//         else {
//             console.log('Connect successfully')
//         }
//     });
//     // If you're also serving http, display a 503 error.
//     connection.on('error', function (err) {
//         console.log('db error', err);
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') { 
//             handleDisconnect();                         
//         } else {                                      
//             throw err;                                 
//         }
//     });
// }

// handleDisconnect();

module.exports = pool;