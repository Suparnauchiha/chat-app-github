// v2 as cloudinary
import {v2 as cloudinary} from "cloudinary"
import { config } from "dotenv"

//config to scess environment variable
config()

//once we upload image we will see them in cloudinary bucket
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export default cloudinary