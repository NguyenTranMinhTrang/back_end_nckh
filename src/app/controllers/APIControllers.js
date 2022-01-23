const db = require('../../config/db/index');

class APIControllers {
    // GET api/image

    image(req, res) {
        var sql = "SELECT * FROM image";
        db.query(sql, function (err, results) {
            if (err) throw err;
            res.json({ image: results });
        });
    }
}

module.exports = new APIControllers;