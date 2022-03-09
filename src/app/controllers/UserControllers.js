const bcrypt = require('bcrypt');
const User = require('../../models/user');

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
        } else if (password.length < 6 || password.length > 32) {
            res.json({
                status: "FAILED",
                message: "Password length must be 6 - 32 characters "
            });
        } else {
            //Check if user already exists
            User.find(email, (result) => {
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
                    const saltRounds = 10;
                    bcrypt.hash(password, saltRounds)
                        .then(hashedPassword => {
                            User.save(email, hashedPassword, (result) => {
                                if (result.error) {
                                    res.json({
                                        status: "FAILED",
                                        message: "An erorr occurred while saving user account!"
                                    });
                                }
                                else {
                                    res.json({
                                        status: "SUCCESS",
                                        message: "Signup sucessful",
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
            User.find(email, (result) => {
                let length = Object.keys(result).length

                if (result.error) {
                    res.json({
                        status: "FAILED",
                        message: "An erorr occurred while checking for existing user!",
                    });
                }
                else if (length) {
                    const hashedPassword = result[0].password;
                    bcrypt.compare(password, hashedPassword)
                        .then(data => {
                            if (data) {
                                res.json({
                                    status: "SUCCESS",
                                    message: "Signin sucessful",
                                    data: {
                                        'User name': result[0].name,
                                        'Email: ': result[0].email
                                    }
                                })
                            }
                            else {
                                res.json({
                                    status: "FAILED",
                                    message: "Invalid password entered!"
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
                        message: "Email does not exist!"
                    })
                }
            })
        }
    }
}

module.exports = new UserControllers
