const userModel = require("../models/userModel")

const signUp = async(req,res)=> {
    try {
        
    } catch (error) {
        
    }
}

module.exports = {signUp}


const signIn = async(req,res) {
    try {
        let data = req.body
        let { email, password } = data
  
        if (validation.isValidBody(data)) return res.status(400).send({ status: false, msg: "provide all  details to login" })
    
        if (!validation.isValid(email)) return res.status(400).send({ status: false, message: "email is required" })
        email=email.toLowerCase()
  
        if (!validation.isValid(password)) return res.status(400).send({ status: false, message: "Pasworrd is required" })
    
        let findUser = await userModel.findOne({ email: email })
        if (!findUser) return res.status(400).send({ status: false, message: "The email-id is wrong" })
    
        let bcryptPass = await bcrypt.compare(password, findUser.password)
        if (!bcryptPass) return res.status(400).send({ status: false, message: "Password incorrect" })
    
        let token = jwt.sign({ userId: findUser._id }, "Job_Portal_Xhipment", { expiresIn: '1d' });
    
        res.status(200).send({ status: true, message: "User login successfully", data: { userId: findUser._id, token: token } })
    
    
      } catch (error) {
        res.status(500).send({ status:false, error: error.message })
      }
}