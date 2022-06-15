const nodemailer = require('nodemailer')
const hashData = require("./hashData")
const generatePIN = require("./generatePIN")
const uuid = require('uuid');
//Url
const currentUrl = require('../config/url')

//Models
const UserVrf = require('../models/userVerification')
const PasswordReset = require('../models/passwordReset');
const { download } = require('express/lib/response');
const { Dilation2D } = require('@tensorflow/tfjs-node');

// Nodemailer config
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
    }
})

transporter.verify((error, success) => {
    if (error) {
        console.log(error)
    }
    else {
        console.log("Ready for messages")
    }
})

const sendEmail = async (mailOptions) => {
    try {
        const emailSent = await transporter.sendMail(mailOptions)
        return emailSent
    } catch (error) {
        throw error
    }
}

//Send Verification email
const sendVerificationEmail = async ({ id, email }) => {
    try {
        const uniqueString = uuid.v4() + id

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Xác thực email",
            html: `<p>Xác thực email để hoàn thành việc đăng ký tài khoản.</p><p>Link này sẽ 
        <b>hết hạn sau 6 giờ</b>.</p><p>Ấn <a href = 
        ${currentUrl + "/user/verify/" + id + "/" + uniqueString}
        >vào đây</a> để truy cập.</p>`
        }
        const hashedUniqueString = await hashData(uniqueString)

        // set values in userVerification
        let numOfHours = 6
        let createdAt = new Date()
        let expiresAt = new Date()

        //Set expires time: 6 hour from current time 
        expiresAt.setTime(expiresAt.getTime() + numOfHours * 60 * 60 * 1000)

        const newUserVrf = await UserVrf.save(id, hashedUniqueString, createdAt.toUTCString(), expiresAt.toUTCString())
        await sendEmail(mailOptions)
        return {
            "id": id,
            "email": email
        }
    } catch (error) {
        throw error
    }

}

//Send Reset Email
const sendResetPasswordEmail = async (email) => {
    try {
        const pin = await generatePIN()
        let numOfMinute = 60
        //Deleting all reset records
        await PasswordReset.delete(email)

        //Send the email
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Đặt lại mật khẩu",
            html: `<p>Bạn đã quên mật khẩu rồi đúng khum. Đừng lo! Hãy sử dụng mã pin này để đặt lại mật khẩu</p>
                    <p>Lưu ý!! Mã pin sẽ <b>hết hạn sau ${numOfMinute} phút</b>.</p>
                    <p>Mã pin: <b><big>${pin}</big><b></p>`
        }

        //Hash pin code 
        const hashedPin = await hashData(pin)
        //Save reset password record
        let createdAt = new Date()
        let expiresAt = new Date()
        //Set expires time: 60 minute from current time 
        expiresAt.setTime(expiresAt.getTime() + numOfMinute * 60 * 1000)

        const NewPINVertification = await PasswordReset.save(email, hashedPin, createdAt.toUTCString(), expiresAt.toUTCString())
        await sendEmail(mailOptions)
        return {
            "email": email
        }
    } catch (error) {
        throw error
    }

}

module.exports = {
    sendEmail,
    sendVerificationEmail,
    sendResetPasswordEmail
}