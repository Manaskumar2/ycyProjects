const express = require('express')
const mongoose = require('mongoose')

const app =express();
const route=require('./Router/Route')
const multer=require('multer')

app.use(express.json())
app.use(multer().any())


mongoose.connect("mongodb+srv://manaskumar:iFVJhjYrsH7iars8@cluster0.s4pqkzd.mongodb.net/ycyProjects?retryWrites=true&w=majority",
{
    useNewUrlparser:true
}


)

.then(()=>console.log("MongoDb connected"))
.catch((err)=>console.log(err))

app.use("/",route);

app.listen(process.env.PORT|| 3000,function(){
    console.log("Port running on "+(process.env.PORT||3000));
});
