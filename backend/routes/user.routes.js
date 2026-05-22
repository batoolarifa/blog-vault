import { Router } from "express";
import {  registerUser,
          loginUser,
          logoutUser, 
          getCurrentUser, 
          getBlogHistory,
}

from "../controllers/user.controller.js";
const router = Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/blog-history").get(verifyJWT,getBlogHistory)



export default router