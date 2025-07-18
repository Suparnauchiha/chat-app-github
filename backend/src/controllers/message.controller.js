import User from "../models/user.model.js"
import Message from  "../models/message.model.js"

//fetch every single user but not ourselves
export const getUsersForSidebar= async(req,res)=>{
    try{
        //req.user from protectRoute
        const loggedInUserId= req.user._id;
        //not include userId of mine
        const filteredUser= await User.find({_id: { $ne:loggedInUserId}}).select("-password");

        res.status(200).json(filteredUser)
    }
    catch(error){
        console.error("error in getUsersForSidebar: ",error.message)
        res.status(500).json({error: "internal server error"})
    }
}

//get messages between me and user
export const getMessages= async(req,res)=>{

    try{
        const {id:userToChatId} = req.params
        const myId= req.user._id

        const messages= await Message.find({
            $or:[
                {senderId:myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId:myId}
            ]
        })
        res.status(200).json(messages)
    }
    catch(error){
        console.log("error in getMessages controller:",error.message)
        res.status(500).json({error:"internal server eeor"})
    }
}


//the message could a image or a text
export const sendMessage= async (req,res)=> {
    try{
        const {text, image}= req.body
        const {id: receiverId}= req.params
        const senderId= req.user._id

        let imageUrl;
        if(image){
            //upload image to cloudinary
            const uploadResponse= await cloudinary.uploader.upload(image);
            imageUrl= uploadResponse.secure_url;
        }

        const newMessage= new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })

        await newMessage.save();
        //


        res.status(201).json(newMessage)
    }
    catch(error){
        console.log("error in sendMessage conroller: ",error.message)
        res.status(500).json({error: "internal server error"})
    }
}