const bcrypt = require('bcrypt');
const User = require('../../models/user');
const uuid = require('uuid');
const jwt = require('jsonwebtoken')
const cloudinary = require('../../cloudinary/imageUpload');
const { profile } = require('@tensorflow/tfjs-node');

class UserControllers {
    handleSignup(req, res) {
        let { email, password } = req.body;
        email = email.trim();
        password = password.trim();

        if (email == "" || password == "") {
            res.json({
                status: "FAILED",
                message: "Dữ liệu input rỗng!"
            });
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            res.json({
                status: "FAILED",
                message: "Email không hợp lệ"
            });
        } else if (password.length < 8 || password.length > 32) {
            res.json({
                status: "FAILED",
                message: "Mật khẩu phải dài từ 8 - 32 kí tự "
            });
        } else {
            //Check if user already exists
            User.findUser(email, (result) => {
                let length = Object.keys(result).length
                if (result.error) {
                    res.json({
                        status: "FAILED",
                        message: "Có lỗi xảy ra khi tìm kiếm người dùng!",
                        err: result.error
                    });
                }
                else if (length) {
                    res.json({
                        status: "FAILED",
                        message: "Email đã được sử dụng!!"
                    });
                } else {
                    // try to create new user
                    //password handling
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            const id = uuid.v1() // create time-based ID 
                            User.saveUser(id, email, hashedPassword, (result) => {
                                if (result.error) {
                                    res.json({
                                        status: "FAILED",
                                        message: "Có lỗi xảy ra khi lưu tài khoản người dùng!"
                                    });
                                }
                                else {
                                    User.findUser(email, (result) => {
                                        let length = Object.keys(result).length;

                                        if (result.error) {
                                            res.json({
                                                status: "FAILED",
                                                error: result.error
                                            });
                                        }
                                        else if (length != 0) {
                                            const token = jwt.sign({ userId: result[0].id }, process.env.JWT_SECRET, {
                                                expiresIn: '1d',
                                            });

                                            res.json({
                                                status: "SUCCESS",
                                                data: {
                                                    id: result[0].id,
                                                    email: result[0].email,
                                                    avatar: result[0].avatar,
                                                    token: token
                                                }
                                            })
                                        }
                                        else {
                                            res.json({
                                                status: "FAILED",
                                                message: "Có lỗi xảy ra khi tìm kiếm người dùng!"
                                            })
                                        }
                                    })
                                }
                            })
                        })
                        .catch(err => {
                            res.json({
                                status: "FAILED",
                                message: "Có lỗi xảy ra khi lưu mật khẩu!"
                            });
                        })
                }
            })
        }
    }

    handleLogin(req, res) {
        let { email, password } = req.body;
        email = email.trim();
        password = password.trim();

        if (email == "" || password == "") {
            res.json({
                status: "FAILED",
                message: "Dữ liệu input rỗng!"
            });
        }
        else {
            User.findUser(email, (result) => {
                let length = Object.keys(result).length;

                if (result.error) {
                    res.json({
                        status: "FAILED",
                        message: result.error
                    });
                }
                else if (length != 0) {
                    const hashedPassword = result[0].password;
                    bcrypt.compare(password, hashedPassword)
                        .then(data => {
                            if (data) {

                                //Authorization
                                const token = jwt.sign({ userId: result[0].id }, process.env.JWT_SECRET, {
                                    expiresIn: '1d',
                                });

                                res.json({
                                    status: "SUCCESS",
                                    data: {
                                        id: result[0].id,
                                        email: result[0].email,
                                        avatar: result[0].avatar,
                                        token: token
                                    }
                                })
                            }
                            else {
                                res.json({
                                    status: "FAILED",
                                    message: "Sai mật khẩu!"

                                })
                            }
                        })
                        .catch(err => {
                            res.json({
                                status: "FAILED",
                                message: err
                            })
                        })
                }
                else {
                    res.json({
                        status: "FAILED",
                        message: "Email không tồn tại"
                    })
                }
            })
        }
    }

    postHistory(req, res) {
        let { id, animalID, time } = req.body;
        User.saveHistory(id, animalID, time, (result) => {
            if (result.error) {
                console.log(result.error)
                res.json({
                    status: "FAILED",
                    message: "Có lỗi xảy ra khi lưu lịch sử!"
                });
            }
            else {
                res.json({
                    status: "SUCCESS",
                    message: "Lịch sử đã được lưu thành công",
                });
            }
        })
    }

    getHistory(req, res) {
        let { id } = req.body;
        User.findHistory(id, (result) => {
            if (result.error) {
                console.log(result.error)
                res.json({
                    status: "FAILED",
                    message: "Có lỗi xảy ra khi tìm kiếm lịch sử!"
                });
            }
            else {
                res.json({
                    status: "SUCCESS",
                    data: result.reverse()
                });
            }
        })
    }

    deleteHistory(req, res) {
        let { id, animalID, time } = req.body;
        User.deleteHistory(id, animalID, time, (result) => {
            if (result.error) {
                console.log(result.error)
                res.json({
                    status: "FAILED",
                    message: "Có lỗi xảy ra khi xóa lịch sử!",
                });
            }
            else {
                res.json({
                    status: "SUCCESS",
                    message: "Xóa lịch sử thành công!",
                });
            }
        })
    }

    handleChangePassword(req, res) {
        let { email, password, newPassword } = req.body
        User.findUser(email, (result) => {
            let length = Object.keys(result).length
            if (result.error) {
                res.json({
                    status: "FAILED",
                    message: "Có lỗi xảy ra khi tìm kiếm người dùng!",
                });
            }
            else if (length != 0) {
                const hashedPassword = result[0].password;
                bcrypt.compare(password, hashedPassword)
                    .then(data => {
                        if (data) {
                            //Hash new password and update database
                            bcrypt.hash(newPassword, 10)
                                .then(newHashedPassword => {
                                    User.updatePassword(email, newHashedPassword, (result) => {
                                        if (result.error) {
                                            res.json({
                                                status: "FAILED",
                                                message: "Có lỗi xảy ra khi cập nhật mật khẩu!"
                                            });
                                        }
                                        else {
                                            res.json({
                                                status: "SUCCESS",
                                                message: "Cập nhật mật khẩu thành công",
                                            });
                                        }
                                    })

                                })
                                .catch(err => {
                                    res.json({
                                        status: "FAILED",
                                        message: "Có lỗi xảy ra khi lưu mật khẩu!"
                                    });
                                })
                        }
                        else {
                            res.json({
                                status: "FAILED",
                                message: "Sai mật khẩu!"
                            })
                        }
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "Có lỗi xảy ra khi so sánh mật khẩu!"
                        })
                    })
            }
            else {
                res.json({
                    status: "FAILED",
                    message: "Email không tồn tại!"
                })
            }
        })

    }

    uploadProfile(req, res) {
        let user = req.user
        if (!user) {
            res.json({
                status: "FAILED",
                message: "Truy cập trái phép!"
            });
        }

        try {
            cloudinary.uploader.upload(req.file.path, {
                public_id: `${user.id}_profile`,
                folder: 'avatar',
                width: 500,
                height: 500,
                crop: 'fill',
            }, (error, result) => {
                if (error) {
                    res.json({
                        status: "FAILED",
                        message: "Có lỗi xảy ra khi đăng ảnh đại diện!"
                    })
                }
                // console.log(result)
                User.updateProfile(user.id, result.url, (result) => {
                    if (result.error) {
                        console.log(result.error)
                        res.json({
                            status: "FAILED",
                            message: "Có lỗi xảy ra khi cập nhật hồ sơ người dùng!"
                        });
                    }
                    else {
                        res.json({
                            status: "SUCCESS",
                            message: "Hồ sơ của bạn đã được cập nhật thành công!",
                        });
                    }
                })
            });

        } catch (error) {
            res
                .status(500)
                .json({
                    status: "FAILED",
                    message: "Lỗi server, hãy thử lại sau!"
                });
            console.log('Lỗi khi đăng ảnh đại diện', error.message);
        }
    }
}

module.exports = new UserControllers
