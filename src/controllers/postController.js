const postModel = require("../models/postModel")
const aws = require("../aws/aws")

const validation = require("../validations/validaton")

const createPost = async (req, res) => {

    try {
        let data = req.body

        let { topic } = data

        if (validation.isValidBody(data)) return res.status(400).send({ status: false, message: "provide all required fields" })

        if (!validation.isValid(topic)) return res.status(400).send({ status: false, message: "Put you topic" })

        let file = req.files
        if (file.length > 0) {
            if (validation.isValidImage(file)) return res.status(400).send({ status: false, message: "Enter a valid image file" })
            let uploadedtopicImage = await aws.uploadFile(file[0])
            data.photo = uploadedtopicImage
        }

        data.userId = req.params.userId
        const createPost = await postModel.create(data)

        res.status(201).send({ status: true, message: "question is created successfully", data: createPost })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


const getPost = async(req,res)=> {
    try {
        const getPost = await postModel.find().populate("userId")
        return res.status(200).send({status:true,data:getPost})
    } catch(error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createPost,getPost }