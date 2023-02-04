const questionModel = require("../models/questionModel")
const aws = require("../aws/aws")

const validation = require("../validations/validaton")

const createQuestion = async (req, res) => {

    try {
        let data = req.body

        let { question, subject } = data

        if (validation.isValidBody(data)) return res.status(400).send({ status: false, message: "provide all required fields" })

        if (!validation.isValid(question)) return res.status(400).send({ status: false, message: "Put you question" })

        if (!validation.isValid(subject)) return res.status(400).send({ status: false, message: "subject is required" })
        if (!validation.isValidSubject(subject)) return res.status(400).send({ status: false, message: "Enter a valid subject from the input" })

        let file = req.files
        if (file.length > 0) {
            if (validation.isValidImage(file)) return res.status(400).send({ status: false, message: "Enter a valid image file" })
            let uploadedQuestionImage = await aws.uploadFile(file[0])
            data.photo = uploadedQuestionImage
        }

        data.userId = req.params.userId
        const createQuestion = await questionModel.create(data)

        res.status(201).send({ status: true, message: "question is created successfully", data: createQuestion })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createQuestion }