//Models
const PasswordReset = require('../models/passwordReset');
const User = require('../models/user');

const compareHashedData = require('../utils/compareHashedData')
const jwt = require('jsonwebtoken');
const { sendResetPasswordEmail } = require('../utils/sendEmail')

class PasswordResetControllers {
    async requestPasswordReset(req, res) {
        try {
            let { email } = req.body

            const user = await User.findByEmail(email)
            if (user.length) {
                //Check if user is verified
                if (user[0].verified == 'false') {
                    throw Error("Email vẫn chưa được xác thực! Hãy kiểm tra hộp thư")
                }
                else {
                    const emailData = await sendResetPasswordEmail(user[0].email)
                    res.json({
                        status: "PENDING",
                        message: "Đã gửi mã PIN qua email của bạn!! Hãy kiểm tra hộp thư",
                        data: emailData
                    })
                }
            }
            else {
                throw Error("Tài khoản không tồn tại!!")
            }
        } catch (error) {
            res.json({
                status: "FAILED",
                message: error.message
            })
        }

    }

    async resendPIN(req, res) {
        try {
            let { email } = req.body

            if (!email) {
                throw Error("Thông tin người dùng rỗng !! Không thể gửi lại mã pin")
            }
            else {
                // Delete old pin record and create a new one
                const emailData = await sendResetPasswordEmail(email)
                res.json({
                    status: "PENDING",
                    message: "Đã gửi mã xác thực qua email của bạn!! Hãy kiểm tra hộp thư",
                    data: emailData
                })

            }
        } catch (error) {
            res.json({
                status: "FAILED",
                message: error.message
            })
        }
    }

    async verifyPinCode(req, res) {
        try {
            let { email, pin } = req.body

            const passwordRecord = await PasswordReset.find(email)
            if (passwordRecord.length) {
                // Check expires time
                let hashedPin = passwordRecord[0].pin
                let expiresTime = new Date(passwordRecord[0].expiresAt)

                if (expiresTime < Date.now()) {
                    //Delete record if pin is expires
                    await PasswordReset.delete(email)
                    throw Error("Mã pin đã hết hạn")
                }
                else {
                    //Verify PIN
                    const compareResult = await compareHashedData(pin, hashedPin)
                    if (compareResult) {
                        //Valid PIN
                        //Authorization
                        const user = await User.findByEmail(email)
                        if (user.length) {
                            const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, {
                                expiresIn: '1h',
                            });

                            res.json({
                                status: "SUCCESS",
                                message: "Mã pin hợp lệ",
                                data: {
                                    id: user[0].id,
                                    token: token
                                }
                            })
                        }
                        else {
                            throw Error("Tài khoản không tồn tại")
                        }

                    }
                    else {
                        throw Error("Mã pin không hợp lệ")
                    }
                }
            }
            else {
                throw Error("Không tìm thấy mã pin!!")
            }
        } catch (error) {
            res.json({
                status: "FAILED",
                message: error.message
            })
        }

    }
}

module.exports = new PasswordResetControllers