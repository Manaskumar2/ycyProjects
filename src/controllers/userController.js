const userModel = require("../models/userModel")
const validation = require('../validations/validaton')
const jwt = require('jsonwebtoken')

const signUp = async (req, res) => {

    try {
        const data = req.body;

        

        let { name, email, phone, password, confirmPassword } = data;

        if(!validation.isValidBody(data)) return res.status(400).send({status:false,message:"provide all required fields"})

        if (!validation.isValid(name))
            return res.status(400).send({ status: false, message: `Username is Required` });
            
        if (!validation.isValidName(name)) return res.status(400).send({ status: false, message: "please enter a valid name" })
            data.name=name.toLowerCase()



        if (!validation.isValid(email))
            return res.status(400).send({ status: false, message: `E-mail is Required` });


        let uniqueEmail = await User.findOne({ email: email });

        if (!validation.isValidEmail(email))
            return res.status(400).send({ status: false, message: `This E-mail is Invalid` });

        if (uniqueEmail) return res.status(400).send({status: false, message: `This E-mail has alredy registered Pls Sign In`, });

            data.email= email.toLowerCase()


        if (!validation.isValidPwd(password))return res.status(400).send({status: false, message: "Password should be 8-15 characters long and must contain one of 0-9,A-Z,a-z and special characters",});
        if (!validation.isValidPwd(confirmPassword))return res.status(400).send({ status: false, message: "Password should be 8-15 characters long and must contain one of 0-9,A-Z,a-z and special characters", })

        if (password !== confirmPassword) return res.status(400).send({ status: false, message: "Password does not match" })
 

        if (!validation.isValidPhone(phone)) return res.status(400).send({ status: false, message: "This phone number is invalid" })

        
        let uniquePhone = await User.findOne({ phone: phone });

        if (uniquePhone) return res.status(400).send({status: false, message: `This phoneNumber has alredy registered Pls Sign In`,});



        const hashedPassword = await bcrypt.hash(password, 10);

        data.password = hashedPassword
        data.confirmPassword=hashedPassword

        const finaldata = await User.create(data);

        res.status(201).json({status: true, message: "User created successfully", data: finaldata,});
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};



const signIn = async (req, res)=> {
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

        let token = jwt.sign({ userId: findUser._id }, "Job_Portal_Xhipment", { expiresIn: '1d' });

        res.status(200).send({ status: true, message: "User login successfully", data: { userId: findUser._id, token: token } })


    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}

module.exports ={signUp,signIn}