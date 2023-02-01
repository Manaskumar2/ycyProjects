const express = require('express')
const router=express.Router()
const {signUp,signIn,verify_email,forget_password,reset_password} = require("../controllers/userController")


router.post("/signUp",signUp)
router.post("/signIn",signIn)
router.get("/user/verify-email",verify_email)

router.post('/forget_password',forget_password)
router.get('/reset_password',reset_password)

module.exports =router