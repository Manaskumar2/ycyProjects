const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId



const questionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true,
        },
        subject: {
            type: String,
            required: true,
            enum: [
                "Math",
                "Physics",
                "Biology",
                "Accountancy",
                "Business Study",
                "Economics",
                "Current Affair",
                "Reasoning",
                "Quantitative Aptitude",
                "Business Studies",
                "Sociology",
                "Political Science",
                "Current Affairs",
                "Environmental Science",
                "English",
                "Law",
                "Engineering",
                "Medical",
                "Geography",
                "Computer Science",
                "History",
                "Geology",
                "Hindi",
                "General Knowledge",
                "Odia",
                "Science",
                "Social studies",
                "Indian Language",
                "France",
                "German",
                "Spanis",
                "US History",
                "C",
                "C++",
                "JAVA",
                "JAVASCRIPT",
                "PYTHON",
                "Data Structure",
                "Tourism",
                "Mass Communication",
                "Introduction Law",
                "Urban Studies",
            ],

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

module.exports = mongoose.model("QUESTION", questionSchema)


