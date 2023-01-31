const userModel = require("../models/userModel")
const validation = require('../validations/validaton')
const jwt = require('jsonwebtoken')
const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer")

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

        data.emailToken = await jwt.sign({_id:(Math.random()).toString()},process.env.SECRET_KEY,{ expiresIn: '1d' })

        const createUser = await userModel.create(data)
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: "gmail",
            port: 465,
            auth: {
                user: 'soubhagyasamal2345@gmail.com',
                pass: process.env.PASS
            }
        });

          let info = {
            from: '"soubhagyasamal2345@gmial.com',
            to: email,
            subject: "Hello ✔",
            text: "verify-email",
            html: `<h2>${name}! Thanks for registering on our site</h2>
                  <h4><Please verify your mail to continue...</h4>
                  <a href="http://${req.headers.host}/user/verify-email?token=${data.emailToken}">verify your email</a>`
          } 

          transporter.sendMail(info,(err,info)=> {
            if(err) {
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

const verify_email = async(req,res)=> {
    token = req.query.token
    const findUser = await userModel.findOne({emailToken:token})
    if(!findUser) return res.status(400).send({ status: false, message: "Invalid link"})
    let error
    jwt.verify(token, process.env.SECRET_KEY, function (err, data) {
        if (err) {
          error = err.message
        } 
      })
      if(error){
        return res.status(400).send({ status: false, message: "token expired"})
      }
    updateUser = await userModel.findOneAndUpdate({emailToken:token},{$set:{isVerified:true}})
    res.status(500).send({ status: false, message: "account is succesfully verified"})
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
        if(findUser.isVerified==false) {
            return res.status(400).send({ status: false, message: "Please confirm your email to login" })
        }

        let token = jwt.sign({ userId: findUser._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
        res.cookie(jwt,token)
        res.status(200).send({ status: true, message: "User login successfully"})


    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}

module.exports = { signUp, signIn,verify_email }
