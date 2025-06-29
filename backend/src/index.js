import express from "express";
import dotenv from "dotenv"

import cookieParser from "cookie-parser"
//to connect backend frontend--- cors
import cors from "cors"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"

import { connectDB } from "./lib/db.js";
dotenv.config()
const app= express();

//calling .env
const PORT= process.env.PORT

//extract json data
app.use(express.json())

//allow you to parse the cookie
app.use(cookieParser())

//connect with frontend at port 5173
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials:true
    })
)

//route for authentication,messages
app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)


app.listen(PORT,()=> {
    console.log("server is running on port: "+ PORT)
    connectDB()
})