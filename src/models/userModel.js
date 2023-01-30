const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    teachingExperience: {
      type: String,
      default: '',
    },
    desiredClass: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'teacher'],
      default: 'user',
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true
    },
  },{timestamps:true})

  module.exports = mongoose.model("USER",userSchema)