const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.isAuth = async (req, res, next) => {
    try {
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];


            const decode = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByID(decode.userId)
            if (user.length) {
                req.user = user[0];
                next();
            }
            else {
                throw Error("Truy cập trái phép! Hãy thử đăng nhập lại")
            }
        } else {
            throw Error("Truy cập trái phép! Hãy thử đăng nhập lại")
        }
    } catch (error) {
        let message = error.message
        if (error.name === 'JsonWebTokenError') {
            message = 'Truy cập trái phép!! Hãy thử đăng nhập lại'
        }
        else if (error.name === 'TokenExpiredError') {
            message = 'Phiên đã hết hạn! Hãy đăng nhập lại'
        }
        res.json({
            status: "FAILED",
            message: message
        });
    }
}

