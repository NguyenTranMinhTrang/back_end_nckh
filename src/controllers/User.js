const uuid = require('uuid');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//bcrypt api
const hashData = require('../utils/hashData');
const compareHashedData = require('../utils/compareHashedData');

//Models
const User = require('../models/user');
const PasswordReset = require('../models/passwordReset');

//Cloudinary
const cloudinary = require('../cloudinary/imageUpload');

//Email handler
const { sendVerificationEmail } = require("../utils/sendEmail")

class UserControllers {

    async handleSignup(req, res) {
        try {
            let { email, password } = req.body;
            email = email.trim();
            password = password.trim();

            if (email == "" || password == "") {
                throw Error("Dữ liệu input rỗng!")
            } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
                throw Error("Email không hợp lệ")
            } else if (password.length < 8 || password.length > 32) {
                throw Error("Mật khẩu phải dài từ 8 - 32 kí tự ")
            } else {
                //Check if user already exists
                const existingUser = await User.findByEmail(email)
                if (existingUser.length) {
                    throw Error("Email đã được sử dụng!!")
                }
                else {
                    const hashedPassword = await hashData(password)
                    const id = uuid.v1() // create time-based ID 
                    let verified = 'false'
                    const newUser = await User.save(id, email, hashedPassword, verified)
                    const emailData = await sendVerificationEmail(newUser[0])

                    res.json({
                        status: "PENDING",
                        message: "Đã gửi mã xác thực qua email của bạn!! Hãy kiểm tra hộp thư",
                        data: emailData
                    })
                }
            }
        } catch (error) {
            res.json({
                status: "FAILED",
                message: error.message
            })
        }

    }

    async handleLogin(req, res) {
        try {
            let { email, password } = req.body;
            email = email.trim();
            password = password.trim();

            if (email == "" || password == "") {
                throw Error("Dữ liệu input rỗng!")
            }
            else {
                const user = await User.findByEmail(email)
                if (user.length) {
                    //Check if user is verified
                    if (user[0].verified != 'true') {
                        throw Error("Email vẫn chưa được xác thực! Hãy kiểm tra hộp thư và xác thực email")
                    }
                    else {
                        //Verify password
                        const hashedPassword = user[0].password;
                        const compareResult = await compareHashedData(password, hashedPassword)
                        if (compareResult) {
                            //Authorization
                            const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, {
                                expiresIn: '1d',
                            });
                            res.json({
                                status: "SUCCESS",
                                data: {
                                    id: user[0].id,
                                    email: user[0].email,
                                    avatar: user[0].avatar,
                                    token: token
                                }
                            })
                        }
                        else {
                            throw Error("Sai mật khẩu!")
                        }
                    }
                }
                else {
                    throw Error("Tài khoản không tồn tại")
                }
            }
        } catch (error) {
            res.json({
                status: "FAILED",
                message: error.message
            })
        }

    }

    async handleChangePassword(req, res) {
        try {
            let { id, password, newPassword } = req.body
            const user = await User.findByID(id)
            if (user.length) {
                const hashedPassword = user[0].password;
                const compareResult = await compareHashedData(password, hashedPassword)
                if (compareResult) {
                    //Hash new password and update database
                    const hashedNewPassword = await hashData(newPassword)
                    await User.updatePassword(id, hashedNewPassword)

                    res.json({
                        status: "SUCCESS",
                        message: "Cập nhật mật khẩu thành công",
                    });
                }
                else {
                    throw Error("Sai mật khẩu!")
                }
            }
            else {
                throw Error("Tài khoản không tồn tại!")
            }
        } catch (error) {
            res.json({
                status: "FAILED",
                message: error.message
            });
        }

    }

    async uploadProfile(req, res) {
        try {
            let user = req.user
            if (!user) {
                throw Error("Truy cập trái phép! Hãy thử đăng nhập lại")
            }
            cloudinary.uploader.upload(req.file.path, {
                public_id: `${user.id}_profile`,
                folder: 'avatar',
                width: 500,
                height: 500,
                crop: 'fill',
            }, async (error, result) => {
                if (error) {
                    throw Error("Có lỗi xảy ra khi đăng ảnh đại diện!")
                }

                await User.updateProfile(user.id, result.url)
                res.json({
                    status: "SUCCESS",
                    message: "Ảnh đại diện của bạn đã được cập nhật thành công!",
                });
            });
        } catch (error) {
            res.json({
                status: "FAILED",
                message: error.message
            });
        }
    }

    async resetPassword(req, res) {
        try {
            let user = req.user
            if (!user) {
                throw Error("Truy cập trái phép! Hãy thử đăng nhập lại")
            }
            let { newPassword } = req.body

            //Hashed new password
            const hashedNewPassword = await hashData(newPassword)
            await User.updatePassword(user.id, hashedNewPassword)

            //Delete password reset record after successfully update password
            await PasswordReset.delete(user.id)
            res.json({
                status: "SUCCESS",
                message: "Cập nhật mật khẩu thành công",
                data: user.email
            });
        } catch (error) {
            res.json({
                status: "FAILED",
                message: error.message
            });
        }

    }
}

module.exports = new UserControllers
