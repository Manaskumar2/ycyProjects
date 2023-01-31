const express = require('express')
const router=express.Router()
const {signUp,signIn,verify_email} = require("../controllers/userController")


router.post("/signUp",signUp)
router.post("/signIn",signIn)
router.get("/user/verify-email",verify_email)

module.exports =router