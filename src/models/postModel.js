const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId



const postSchema = new mongoose.Schema(
    {
        topic: {
            type: String,
            required: true,
            trim: true,
        },
        userId: {
            type: ObjectId,
            ref: 'USER',
            required: true,
        },
        photo: {
            type: String
        }
    }, { timestamps: true })

module.exports = mongoose.model("POST", postSchema)


