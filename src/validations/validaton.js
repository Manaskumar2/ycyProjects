const mongoose = require("mongoose")

const isValid = (value) => {
    if (typeof value === "undefined" || typeof value === "null") return false;
    if (typeof value === "string" && value.trim().length == 0) return false;
    return true;
}
const isValidBody = (reqBody) => {
    if(Object.keys(reqBody).length == 0) {
        return true
    }
}
const isValidObjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId);
}
const isValidName = (name) => {
    return /^[a-zA-Z\. ]*$/.test(name)
}
const isValidPhone = (Mobile) => {
    return /^[6-9]\d{9}$/.test(Mobile)
}
const isValidEmail = (Email) => {
    return /^([A-Za-z0-9._]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{2,6})+$/.test(Email)
}
const isValidPwd = (Password) => {
    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(Password)
};

const isValidSubject = (subject)=> {
    return ([
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
    ].includes(subject))
}

const isValidImage = (fileName)=> {
    return (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(fileName)
}

module.exports = {isValid, isValidBody, isValidPhone, isValidEmail,isValidPwd, isValidObjectId, isValidName,isValidSubject,isValidImage}
