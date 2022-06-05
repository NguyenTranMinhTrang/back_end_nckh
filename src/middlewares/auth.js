const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.isAuth = async (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            User.findUserByID(decode.userId, (user) => {
                let length = Object.keys(user).length;

                if (user.error) {
                    res.json({
                        status: "FAILED",
                        error: user.error
                    });
                }
                else if (length != 0) {
                    req.user = user[0];
                    next();
                }
                else {
                    res.json({
                        status: "FAILED",
                        message: "Truy cập trái phép!"

                    })
                }
            })

        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.json({
                    status: "FAILED",
                    message: 'Truy cập trái phép!'
                });
            }
            if (error.name === 'TokenExpiredError') {
                return res.json({
                    status: "FAILED",
                    message: 'Phiên đã hết hạn! Hãy đăng nhập lại',
                });
            }

            res.json({
                status: "FAILED",
                message: 'Lỗi máy chủ nội bộ!'
            });
        }
    } else {
        res.json({
            status: "FAILED",
            message: "Truy cập trái phép!"
        });
    }
};