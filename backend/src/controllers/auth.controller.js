import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"


export const signup= async(req,res)=>{
  const {fullName,email,password }= req.body; 
  try{
    //password must be more than 6 char
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
  

    //if user exist then bad request
    const user = await User.findOne({email})
    if(user)  return res.status(400).json({message: "email already exist.."})

    //for new user

    //hash the password
    const salt= await bcrypt.genSalt(10)
    const hasedPassword =await bcrypt.hash(password,salt)

    const newUser= new User({
        fullName,
        email,
        password: hasedPassword
    })

    if(newUser) {//generate jwt token here
        generateToken(newUser._id, res);
        await newUser.save();

        //show sucess msg in json
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic:newUser.profilePic

        })
    }
    else{
        res.status(400).json({message:"invalid user data"})
    }

  }
  catch(error){
    console.log("error in signup controller", error.message)
    res.status(500).json({message: "internal server error"})
  }
}

export const login= async (req,res)=>{
    //login based on email and password
    const {email, password}= req.body

    try{
        const user= await User.findOne({email});//from db findout info 

        //user not in db
        if(!user){
            return res.status(400).json({message: "invalid credentials"})
        }

        //comapre password
        const isPasswordCorrect= await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: "invalid credentials"})
        }

        //generate token to login
        generateToken(user._id,res);

        res.status(200).json({
            _id: user._id,
            fullName: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })


    }
    catch(error){
        console.log("error inlogin controller", error.meassage);
        res.status(500).json({ message: "internal server error"})
    }
}

export const logout=(req,res)=>{
    try{
   //clear the cookies
   res.cookie("jwt","",{maxAge:0})
   res.status(200).json({message: "logged out successfully"})
    }
    catch(error){
        console.log("eeor in logout controller",error.meassage)
        res.status(500).json({message:"internal server error"})
    }

}


//to update profile image we need a service so that we can upload our images into it-- cloudnary

export const updateProfile = async(req,res)=>{
    try{
        const {profilePic}= req.body;
        //acees user in this func as this func is protected
        const userId= req.user._id;

        if(!profilePic){
            return res.status(400).json({ message:"profile pic is required"})
        }

        //upload pic 
        const uploadResponse= await cloudinary.uploader.upload(profilePic);
        //update the profile pic in db
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {profilePic: uploadResponse.secure_url},
            {new :true}
        )
        res.status(200).json(updatedUser);
    }
    catch(error){
        console.log("error in update profile",error)
        res.status(500).json({message: "internal server error"});
    }
}

export const checkAuth= (req,res)=> {
    try{
        res.status(200).json(req.user)
    }
    catch(error){
        console.log("error in checkAuth controller",error.message)
        res.status(500).json({meassage:"internal server error"})
    }
}