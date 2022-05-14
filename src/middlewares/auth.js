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
                        data: {
                            emailVerifired: false,
                            message: "Unauthorized access!"
                        }
                    })
                }
            })

        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.json({
                    status: "FAILED",
                    message: 'Unauthorized access!'
                });
            }
            if (error.name === 'TokenExpiredError') {
                return res.json({
                    status: "FAILED",
                    message: 'Session expired! Try to sign in again!',
                });
            }

            res.json({
                status: "FAILED",
                message: 'Internal server error!'
            });
        }
    } else {
        res.json({
            status: "FAILED",
            message: "Unauthorized access!"
        });
    }
};