import express from "express"
import {login,logout,signup, checkAuth,updateProfile} from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js";

const router= express.Router();

router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",logout)

//we dont want to call this func for every single user
//so we will protect this route-- if they are logged in then call next func to authenticate
router.put("/update-profile",protectRoute,updateProfile)

//check user is autheticated or not 
router.get("/check",protectRoute,checkAuth)

export default router;