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
                message: "Empty input fields!"
            });
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            res.json({
                status: "FAILED",
                message: "Invalid email entered"
            });
        } else if (password.length < 8 || password.length > 32) {
            res.json({
                status: "FAILED",
                message: "Password length must be 8 - 32 characters "
            });
        } else {
            //Check if user already exists
            User.findUser(email, (result) => {
                let length = Object.keys(result).length
                if (result.error) {
                    res.json({
                        status: "FAILED",
                        message: "An erorr occurred while checking for existing user!",
                        err: result.error
                    });
                }
                else if (length) {
                    res.json({
                        status: "FAILED",
                        message: "User with the provided email already exits"
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
                                        message: "An erorr occurred while saving user account!"
                                    });
                                }
                                else {
                                    //Authorization
                                    const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
                                        expiresIn: '1d',
                                    });
                                    res.json({
                                        status: "SUCCESS",
                                        data: {
                                            id: id,
                                            email: email,
                                            avatar: result[0].avatar,
                                            token: token
                                        },
                                    });
                                }
                            })
                        })
                        .catch(err => {
                            res.json({
                                status: "FAILED",
                                message: "An erorr occurred while hashing password!"
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
                message: "Empty credential supplied!"
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
                                        emailVerifired: true,
                                        token: token
                                    }
                                })
                            }
                            else {
                                res.json({
                                    status: "SUCCESS",
                                    data: {
                                        emailVerifired: false,
                                        message: "Incorrect password!"
                                    }
                                })
                            }
                        })
                        .catch(err => {
                            res.json({
                                status: "FAILED",
                                error: err
                            })
                        })
                }
                else {
                    res.json({
                        status: "SUCCESS",
                        data: {
                            emailVerifired: false,
                            message: "Email does not exist"
                        }
                    })
                }
            })
        }
    }

    postHistory(req, res) {
        // let user = req.user
        // if (!user) {
        //     res.json({
        //         status: "FAILED",
        //         message: "Unauthorized access!"
        //     });
        // }
        let { id, animalID, time } = req.body;
        User.saveHistory(id, animalID, time, (result) => {
            if (result.error) {
                console.log(result.error)
                res.json({
                    status: "FAILED",
                    message: "An erorr occurred while saving history!"
                });
            }
            else {
                res.json({
                    status: "SUCCESS",
                    message: "Save history sucessful",
                });
            }
        })
    }

    getHistory(req, res) {
        // let user = req.user
        // if (!user) {
        //     res.json({
        //         status: "FAILED",
        //         message: "Unauthorized access!"
        //     });
        // }
        let { id } = req.body
        User.findHistory(id, (result) => {
            if (result.error) {
                console.log(result.error)
                res.json({
                    status: "FAILED",
                    message: "An erorr occurred while searching for history!"
                });
            }
            else {
                res.json({
                    status: "SUCCESS",
                    data: result
                });
            }
        })
    }

    handleChangePassword(req, res) {
        // let user = req.user
        // if (!user) {
        //     res.json({
        //         status: "FAILED",
        //         message: "Unauthorized access!"
        //     });
        // }
        let { email, password, newPassword } = req.body
        User.findUser(email, (result) => {
            let length = Object.keys(result).length
            if (result.error) {
                console.log(result.error)
                res.json({
                    status: "FAILED",
                    message: "An erorr occurred while checking for existing user!",
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
                                                message: "An erorr occurred while update user password!"
                                            });
                                        }
                                        else {
                                            res.json({
                                                status: "SUCCESS",
                                                message: "Update password sucessful",
                                            });
                                        }
                                    })

                                })
                                .catch(err => {
                                    res.json({
                                        status: "FAILED",
                                        message: "An erorr occurred while hashing password!"
                                    });
                                })
                        }
                        else {
                            res.json({
                                status: "FAILED",
                                message: "Incorrect password!"
                            })
                        }
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occurred while comparing password!"
                        })
                    })
            }
            else {
                res.json({
                    status: "FAILED",
                    message: "Email does not exist"
                })
            }
        })

    }

    uploadProfile(req, res) {
        let user = req.user
        if (!user) {
            res.json({
                status: "FAILED",
                message: "Unauthorized access!"
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
                        message: "An error occurred while uploading image!"
                    })
                }
                // console.log(result)
                User.updateProfile(user.id, result.url, (result) => {
                    if (result.error) {
                        console.log(result.error)
                        res.json({
                            status: "FAILED",
                            message: "An erorr occurred while update user profile!"
                        });
                    }
                    else {
                        res.json({
                            status: "SUCCESS",
                            message: "Your profile has updated!",
                        });
                    }
                })
            });

        } catch (error) {
            res
                .status(500)
                .json({
                    status: "FAILED",
                    message: "Server error, try after some time!"
                });
            console.log('Error while uploading profile image', error.message);
        }
    }
}

module.exports = new UserControllers
