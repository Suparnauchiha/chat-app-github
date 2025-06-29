 //validate token for users
 import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute= async (req,res,next)=>{
    try{
        const token= req.cookies.jwt; //acess cookies

        if(!token){
            return res.status(401).json({message: "unauthorized - no token provided"})
        }

        //decode the token
        const decoded= jwt.verify(token, process.env.JWT_SECRET)

        //if token is not verified
        if(!decoded){
            return res.status(401).json({message:"unauthorized - invalid token"})
        }

        

        //decoded will have user_id and other info but exclude password 
        //inside decoded ther is userId
        const user= await User.findById(decoded.userId).select("-password")

        if(!user){
            return res.status(404).json({message: "user not found"})
        }

        //add the user field in request-- it is used to send user info in next()
        req.user=user
        next(); //call the next func updateProfile()

    }
    catch(error){
        console.log("error in protectRoute middleware", error.message)
        res.status(500).json({ message: "Internal server error" });
    }
}
