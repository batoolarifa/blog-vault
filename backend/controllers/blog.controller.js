
import {ApiError} from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {Blog} from "../models/blog.model.js"
import {isValidObjectId} from "mongoose";
import { isValidTrimmed } from "../utils/Validation.js";


const publishBlog = asyncHandler(async (req, res) => {
    let  {title, content, hashtags} = req.body
    if (typeof hashtags === "string") {
        hashtags = hashtags.split("#").filter(tag => tag.trim() !== "").map(tag => `#${tag.trim()}`);
    }else{
        throw new ApiError(400, "Hashtags must be an array of strings");
    }
    if (
        [title, content].some((field => field?.trim() === "")  || hashtags.length === 0)
    ) {
        throw new ApiError(400, "All fields are required to publish a blog");
    }
    
    
    const blog = await Blog.create({
        title,
        content,
        hashtags,
        blogAuthor: req.user._id
    })

    if (!blog) {
    
     throw new ApiError(400, "Something went wrong while publishing the blog");
        
    }

    return res.status(201).json(
        new ApiResponse(201, "Blog published successfully", blog

        ))

})



const deleteBlog = asyncHandler( async (req, res) => {
    const {blogId} = req.params

    if (!isValidObjectId(blogId)) {
        throw new ApiError(400, "Invalid blog id cannot delete");

    }
    const blogToBeDeleted = await Blog.findByIdAndDelete(blogId)
    
    

    if (!blogToBeDeleted) {
        throw new ApiError(404, "No Blog found to be deleted");
        
    }

    return res.status(200).json(
        new ApiResponse(200,{}, "Blog  is deleted successfully"
        ))

})



const updateBlog = asyncHandler(async (req, res) => {
    

    const {blogId} = req.params
    const {title, content} = req.body
    let {hashtags} = req.body
    

    if(!isValidObjectId(blogId)){
        throw new ApiError(400, "Invalid blog id cannot update the blog");
    }

    if (!title && !content && !hashtags) {
        throw new ApiError(400, "At least one field must be provided for updating the blog");
        
    }
    
    if (typeof hashtags === "string") {
        hashtags = hashtags
            .split("#") // Split by `#`
            .filter(tag => tag.trim() !== "") // Remove empty tags
            .map(tag => `#${tag.trim()}`); // Add `#` back
    }

    

    if (
       title && !isValidTrimmed(title) ||
       content && !isValidTrimmed(content) ||
       hashtags &&  (!Array.isArray(hashtags)  || !hashtags.every(isValidTrimmed))
    ) {
        throw new ApiError("400", "field must be provided for updating the blog  and they must not contain only whitespace");
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
            $set:{
                title,
                content,
                hashtags
            }
        },{
            new: true
        }
    )

    if (!updatedBlog) {
        throw new ApiError("404", "No Blog found to be updated");
        
    }

    return res.status(200).json(
        new ApiResponse(200, updatedBlog, "Blog updated successfully")
    )


})



const getBlogById = asyncHandler(async (req, res) => {  
    const {blogId} = req.params

    if (!isValidObjectId(blogId)) {
        throw new ApiError("400", "Invalid blog id cannot get the blog");
    }

    const blog = await Blog.findById(blogId).populate({
        path:'blogAuthor',
        select:'profilePicture tagline fullName'
    })

    if (!blog) {
        throw new ApiError(404, "No Blog found");
    }

    return res.status(200).json(
        new ApiResponse(200, blog, "Blog fetched successfully")
    )
})




const togglePublishStatus = asyncHandler(async (req, res) => {
    const {blogId} = req.params

    if (!isValidObjectId(blogId)) {
        throw new ApiError("400", "Invalid blog id cannot toggle the publish status");
    }

    
    const blog = await Blog.findById(blogId)

    if (!blog) {
        throw new ApiError("404", " Blog does not exist  cannot toggle the publish status");
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {  
            $set: { 
                isPublished: !blog.isPublished
            }
        },
        {
            new: true
        }
    )

    if (!updatedBlog) {
        throw new ApiError("404", "No Blog found cannot toggle the publish status");
        
    }

    return res.status(200).json(
        new ApiResponse(200, updatedBlog, "Blog publish status toggled successfully")
    )
})



const getAllBlogs = asyncHandler(async (req, res) => {
         const { page=1, limit= 4, search, sortBy = "title", sortType= "asc", hashtags, authorId, username } = req.query 
         const skip = parseInt((page - 1)) * parseInt(limit)

         const filter = {}

         if(search){
            filter.$or =[ 
                { title : { $regex: search, $options: "i" } },
                { content : { $regex: search, $options: "i" } },
                { hashtags : { $regex: search, $options: "i" } }
            ];


         }


         if (hashtags) {
            const hashtagsArr = hashtags.split(",").map(tag => decodeURIComponent(tag));
            filter.$or = hashtagsArr.map(tag => ({
                hashtags: {$regex: `${tag}`, $options: "i"}
            }))
            }


         
         if (authorId) {
            filter.blogAuthor = authorId
         }

         
         
         const sortOrder = sortType === "asc" ? 1 : -1;

         const blogs = await Blog.find(filter)
                           .sort({[sortBy]: sortOrder})
                           .skip(skip)
                           .limit(parseInt(limit))
                           .populate("blogAuthor", "fullName profilePicture username")
         const totalBlogs = await Blog.countDocuments(filter)

         const pagination = {
            totalBlogs,
            page,
            limit,
            totalPages: Math.ceil(totalBlogs / limit)
         }

         if (!blogs) {
            throw new ApiError("404", "No Blogs found");
            
         }

        

         return res.status(200).json(
             new ApiResponse(200, {blogs, pagination}, "Blogs fetched successfully")
         )


})


export {
    publishBlog,
    deleteBlog,
    updateBlog,
    getBlogById,
    togglePublishStatus,
    getAllBlogs
}