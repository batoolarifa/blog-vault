import {Router} from "express";
import { 
    publishBlog, 
    deleteBlog , 
    updateBlog,
    getBlogById, 
    togglePublishStatus,
     getAllBlogs} 
    
from "../controllers/blog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/").get(getAllBlogs)

router.use(verifyJWT)

router.route("/publish").post(publishBlog)
router.route("/:blogId")
                      .delete(deleteBlog)
                      .get(getBlogById)
router.route("/:blogId").patch(updateBlog)


router.route("/toggle/:blogId").patch(togglePublishStatus)

export default router