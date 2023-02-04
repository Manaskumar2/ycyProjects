const userModel = require("../models/userModel")
const validation = require('../validations/validaton')
const jwt = require('jsonwebtoken')
const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer")
const randmostring = require('randomstring')



const signUp = async (req, res) => {

    try {
        let data = req.body;

        let { name, email, phone, password, confirmPassword } = data

        if (validation.isValidBody(data)) return res.status(400).send({ status: false, message: "provide all required fields" })

        if (!validation.isValid(name)) return res.status(400).send({ status: false, message: `Username is Required` });
        if (!validation.isValidName(name)) return res.status(400).send({ status: false, message: "please enter a valid name" })
        data.name = name.toLowerCase()

        if (!validation.isValid(email)) return res.status(400).send({ status: false, message: `E-mail is Required` })
        let uniqueEmail = await userModel.findOne({ email: email })
        if (!validation.isValidEmail(email)) return res.status(400).send({ status: false, message: `This E-mail is Invalid` })
        if (uniqueEmail) return res.status(400).send({ status: false, message: `This E-mail has already registered Please Sign In`, })
        data.email = email.toLowerCase()

        if (!validation.isValidPwd(password)) return res.status(400).send({ status: false, message: "Password should be 8-15 characters long and must contain one of 0-9,A-Z,a-z and special characters", })
        if (password !== confirmPassword) return res.status(400).send({ status: false, message: "both the password does not match" })

        if (!validation.isValidPhone(phone)) return res.status(400).send({ status: false, message: "This phone number is invalid" })
        let uniquePhone = await userModel.findOne({ phone: phone })
        if (uniquePhone) return res.status(400).send({ status: false, message: `This phoneNumber has already registered provide new phoneNo `, })

        const hashedPassword = await bcrypt.hash(password, 10)
        data.password = hashedPassword
        data.confirmPassword = hashedPassword
        data.isVerified = false

        data.emailToken = await jwt.sign({ _id: (Math.random()).toString() }, process.env.SECRET_KEY, { expiresIn: '1d' })

        const createUser = await userModel.create(data)
        const transporter = nodemailer.createTransport({
            host: 'smtpout.secureserver.net',
            secureConnection: true,
            port: 465,
            auth: {
                user: 'admin@ycyclass.in',
                pass: "YcyCLASS@Admin504"
            },
        });

        let info = {
            from: 'admin@ycyclass.in',
            to: email,
            subject: "Hello ✔",
            text: "verify-email",
            html: `<h2>${name}! Thanks for registering on our site</h2>
                  <h4><Please verify your mail to continue...</h4>
                  <a href="http://${req.headers.host}/user/verify-email?emailToken=${data.emailToken}">verify your email</a>`
        }

        transporter.sendMail(info, (err, info) => {
            if (err) {
                console.log(err)
            } else {
                console.log("verification mail is sent successfully to your email")
            }
        })

        res.status(201).json({ status: true, message: "Verify your email", data: createUser, })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const verify_email = async (req, res) => {
    token = req.query.emailToken
    const findUser = await userModel.findOne({ emailToken: token })
    if (!findUser) return res.status(400).send({ status: false, message: "Invalid link" })
    let error
    jwt.verify(token, process.env.SECRET_KEY, function (err, data) {
        if (err) {
            error = err.message
        }
    })
    if (error) {
        return res.status(400).send({ status: false, message: "token expired" })
    }
    updateUser = await userModel.findOneAndUpdate({ emailToken: token }, { $set: { isVerified: true } })
    res.status(500).send({ status: false, message: "account is succesfully verified" })
}



const signIn = async (req, res) => {
    try {
        let data = req.body
        let { email, password } = data

        if (validation.isValidBody(data)) return res.status(400).send({ status: false, msg: "provide all  details to login" })

        if (!validation.isValid(email)) return res.status(400).send({ status: false, message: "email is required" })
        email = email.toLowerCase()

        if (!validation.isValid(password)) return res.status(400).send({ status: false, message: "Pasworrd is required" })

        let findUser = await userModel.findOne({ email: email })
        if (!findUser) return res.status(400).send({ status: false, message: "The email-id is wrong" })

        let bcryptPass = await bcrypt.compare(password, findUser.password)
        if (!bcryptPass) return res.status(400).send({ status: false, message: "Password incorrect" })
        if (findUser.isVerified == false) {
            return res.status(400).send({ status: false, message: "Please confirm your email to login" })
        }

        let token = jwt.sign({ userId: findUser._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
        res.status(200).send({ status: true,token:token, message: "User login successfully" })

    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}


const forget_password = async (req, res) => {
    try {
        const email = req.body.email
        if (!validation.isValid(email)) return res.status(400).send({ status: true, message: "email is required" })
        const userData = await userModel.findOne({ email: email })
        if (!userData) return res.status(404).send({ status: true, message: "no account exsist with this mailid" })

        if (userData) {
            let emailToken = await jwt.sign({ _id: (Math.random()).toString() }, process.env.SECRET_KEY, { expiresIn: '1d' })
            const data = await userModel.updateOne({ email: email }, { $set: { emailToken: emailToken } })

            const transporter = nodemailer.createTransport({
                host: 'smtpout.secureserver.net',
                secureConnection: true,
                port: 465,
                auth: {
                    user: 'admin@ycyclass.in',
                    pass: "YcyCLASS@Admin504"
                },
            });

            let info = {
                from: 'admin@ycyclass.in',
                to: email,
                subject: "Hello ✔",
                text: "verify-email",
                html: `Hii ${userData.name} copy the link and<a href="http://${req.headers.host}/user/reset-password?token=${emailToken}">reset your password</a>`
            }
            transporter.sendMail(info, function (error, information) {
                if (error) {
                    console.log(error)
                }
                else {
                    console.log("mail has been sent:-")
                }
            })

            res.status(200).send({ status: true, message: "please check your inbox of email" })
        }

    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}

const reset_password = async (req, res) => {
    try {
        const emailToken = req.query.token
        const tokenData = await userModel.findOne({ emailToken: emailToken })
        if (!tokenData) return res.status(201).send({ status: true, message: "invalidLink" })

        let error
        jwt.verify(emailToken, process.env.SECRET_KEY, function (err, data) {
            if (err) {
              error = err.message
            } 
          })
          if(error){
            return res.status(400).send({ status: false, message: "token expired"})
          }
        const password = req.body.password
        const confirmPassword = req.body.confirmPassword
        if (password != confirmPassword) return res.status(400).send({ status: true, message: "both password doesnot match" })
        const hashedPassword = await bcrypt.hash(password, 10)
        const updatedPassword = await userModel.findByIdAndUpdate({ _id: tokenData._id }, { $set: { password: hashedPassword, confirmPassword: hashedPassword,emailToken:"" } }, { new: true })
        res.status(201).send({ status: true, message: "suceesfull update your password" })

    } catch (error) {
        res.status(500).send({ status: false, error: error.message })

    }
}

module.exports = { signUp, signIn, verify_email, forget_password, reset_password }
