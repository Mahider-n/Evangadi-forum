
require("dotenv").config()
const express=require('express');
const app =express();
const port=5500

// db connection
const dbConnection=require("./db/dbConfige")

// user routes middleware

const userRoutes=require("./routes/userRoute")
const questionRoute=require("./routes/questionRoute");
const authMiddleware = require('./middleware/authMiddleware');

app.use(express.json())
app.use("/api/users",userRoutes)
app.use("/api/questions",authMiddleware,questionRoute)

// console.log(process.env.JWT_SECRET)


async function start() {
    try{
        const result=await dbConnection.execute("select 'test'")
        await app.listen(port)
        console.log(`listening on ${port}`)
    }catch(err){
        console.log(err.message)
    }
    
}
start()




