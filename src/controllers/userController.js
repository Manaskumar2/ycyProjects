const userModel = require("../models/userModel")
const validation = require('../validations/validaton')
const jwt = require('jsonwebtoken')

const signUp = async(req,res)=> {
 
    try {
      const data = req.body;
 
      let {name, email, password } = data;
  
      if (!name)
        return res.status(400).send({ status: false, message: `Username is Required` });
  
      if (!email)
        return res.status(400).send({ status: false, message: `E-mail is Required` });
  
 
      let uniqueEmail = await User.findOne({ email: email });
  
      if (!validation.isValidEmail(email))
        return res.status(400).send({ status: false, message: `This E-mail is Invalid` });
  
      if (uniqueEmail)
        return res.status(400).send({ status: false, message: `This E-mail has alredy registered Pls Sign In`,
        });

  
      if (!validation.isValidPwd(password))
        return res.status(400).send({status: false,message: "Password should be 8-15 characters long and must contain one of 0-9,A-Z,a-z and special characters",
        });
  
      const hashedPassword = await bcrypt.hash(password, 10);

       data.password = hashedPassword
     
      const finaldata = await User.create(data);
  
      res.status(201).json({ status: true, message: "User created successfully", data: finaldata,
      
    });
    } catch (error) {
      res.status(500).send({ status: false, message: error.message });
    }
  };


module.exports = {signUp}