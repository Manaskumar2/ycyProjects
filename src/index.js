const dotenv = require("dotenv")
const express = require('express');
const route = require('./routes/route');
const mongoose = require('mongoose');
const app = express();
const multer = require("multer")
const cors = require("cors")

app.use(cors())
app.use(express.json());
const upload = multer();
app.use(upload.any());

dotenv.config({path:"./config.env"})
let DATABASE = process.env.DATABASE
let PORT = process.env.PORT

mongoose.set('strictQuery', true)
mongoose.connect(DATABASE, {
    useNewUrlParser: true
})
.then(() => console.log("MongoDb is connected"))
.catch(err => console.log(err))


app.use('/', route)


app.listen(process.env.PORT, function () {
    console.log(`Express app running on ${PORT}`)
});