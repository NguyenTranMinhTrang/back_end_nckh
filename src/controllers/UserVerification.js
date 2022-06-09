const { sendVerificationEmail } = require("../utils/sendEmail")
//Models
const UserVrf = require('../models/userVerification');
const User = require('../models/user');

//bcrypt
const compareHashedData = require('../utils/compareHashedData')
//Verify page path
const path = require("path")

class UserVerificationControllers {
    async resendVerificationLink(req, res) {
        try {
            let { id, email } = req.body

            if (!id || !email) {
                throw Error("Thông tin người dùng rỗng !! Không thể gửi lại link xác thực")
            }
            else {
                // Delete old record and create a new one
                await UserVrf.delete(id)
                const emailData = await sendVerificationEmail({ id, email })
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

    async verifyEmail(req, res) {
        try {
            let { id, uniqueString } = req.params

            const userVrf = await UserVrf.find(id)

            if (userVrf.length) {
                let expiresTime = new Date(userVrf[0].expiresAt)
                const hashedUniqueString = userVrf[0].uniqueString

                if (expiresTime < Date.now()) {
                    //Verification record has expired
                    //So delete the record 
                    await UserVrf.delete(id)

                    //Also delete user
                    await User.delete(id)

                    throw Error('Link xác thực đã hết hạn. Hãy đăng kí lại')
                }
                else {
                    //Verification record is valid
                    const compareResult = await compareHashedData(uniqueString, hashedUniqueString)
                    if (compareResult) {
                        //String match
                        //Updated user verified status
                        let verified = 'true'
                        await User.updateVerified(id, verified)

                        //And delete verification record
                        await UserVrf.delete(id)
                        res.sendFile(path.join(__dirname, "../views/verified.html"))
                    }
                    else {
                        throw Error('Mã xác thực không hợp lệ. Hãy kiểm tra lại hộp thư')
                    }
                }
            }
            else {
                throw Error('Mã xác thực không tồn tại hoặc tài khoản đã được xác thực')
            }
        } catch (error) {
            let message = error.message
            res.redirect(`/user/verified/?error=true&message=${message}`)
        }
    }

    async verified(req, res) {
        res.sendFile(path.join(__dirname, "../views//verified.html"))
    }
}

module.exports = new UserVerificationControllers