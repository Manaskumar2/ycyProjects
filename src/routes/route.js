const express = require('express')
const router=express.Router()
const {signUp,signIn,verify_email,forget_password,reset_password} = require("../controllers/userController")

const {authentication} = require("../authentication/authentication")
const {createQuestion} = require("../controllers/questionController")
const {createPost,getPost} = require("../controllers/postController")


router.post("/signUp",signUp)
router.post("/signIn",signIn)
router.get("/user/verify-email",verify_email)

router.post('/forget_password',forget_password)
router.get('/user/reset-password',reset_password)

router.post('/createQuestion/:userId',authentication,createQuestion)

router.post('/createPost/:userId',authentication,createPost)
router.get('/getPost/',authentication,getPost)

module.exports =router