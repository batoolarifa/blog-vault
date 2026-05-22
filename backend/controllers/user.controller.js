import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {validateEmail} from "../utils/Validation.js"
import jwt from "jsonwebtoken";
import mongoose from "mongoose";



const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken =user.generateAccessToken()
        const refreshToken= user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, " Something went wrong while generating access and refresh tokens", error.message)
    }

}


const registerUser = asyncHandler(async (req, res) => {
    const {fullName, email, username, password, tagline, about, facebookUrl, githubUrl, linkdenUrl} = req.body
    


    if (
        [fullName, email, username , password, tagline, about].some((field) => field?.trim() === "")
    ) {
 
       throw new ApiError(400, "All fields are required")
     }

     if (!validateEmail(email)) {
        throw new ApiError(400, "Invalid email")
     }
    
    const existedUser = await User.findOne({
        $or: [
            {email},
            {username}
        ]
    })

    if (existedUser) {
       throw new ApiError(409, "User with email or username already exists")
    }

    

    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase(),
        tagline,
        about,
        facebookUrl: facebookUrl?.trim() || "",
        githubUrl: githubUrl?.trim() || "",
        linkdenUrl: linkdenUrl?.trim() || ""

    })


    const createdUser = await User.findById(user._id).select("-password -refreshToken -email -createdAt -updatedAt")

    if (!createdUser) {
        throw ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
}) 

const loginUser = asyncHandler(async (req, res, next) => {
    try {
        const {email, password} = req.body
        
        if(!email) {
            throw new ApiError(400, "Email is required")
        }
    
        const user = await User.findOne({email})
        
    
        if (!user) {
            throw new ApiError(401, "User not found")
        }
    
        const isPasswordValid = await user.isPasswordCorrect(password)
    
        if (!isPasswordValid) {     
            throw new ApiError(401, "Invalid password")
        }
    
        const {accessToken, refreshToken} =  await generateAccessAndRefreshTokens(user._id)
    
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken -email -createdAt -updatedAt")
    
        
    
        return res.status(200)
                  .json(
                      new ApiResponse(200,{ user: loggedInUser, accessToken, refreshToken }, "User logged In Successfully")
        )
    } catch (error) {
        next(error)
    }
})

const logoutUser = asyncHandler(async (req, res) => {
    
    await User.findByIdAndUpdate(
        req.user._id, 
        {
            $set: {
                refreshToken: null
            }
        }, 
        {
            new: true
        }
    )



    return res.status(200)
              .json(new ApiResponse(200, {}, "User logged out successfully"))
    
})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken  || req.body.refreshToken 
    
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

                
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used") 
        }
    
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res.status(200)
                  .cookie("accessToken", accessToken, options)
                  .cookie("refreshToken", newRefreshToken, options)
                  .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed successfully"))
        
    
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh token")
    }
})





const getCurrentUser = asyncHandler(async (req, res) => {
    
    return res.status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"))
})


const getBlogHistory = asyncHandler(async (req, res) => {  
    
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user?._id)
            }
        }, {
            $lookup: {
                from: "blogs",
                localField: "_id",
                foreignField: "blogAuthor",
                as: "blogHistory",
                pipeline: [
                    {
                    $lookup: {
                        from: "users",
                        localField: "blogAuthor",
                        foreignField: "_id",
                        as: "blogAuthor",
                        pipeline: [
                            {
                                $project: {
                                    fullName: 1,
                                    username: 1,
                                    profilePicture: 1

                                }
                            }
                        ]
                    }
                }, 
                {
                    $addFields: {
                        blogAuthor: {
                            $first: "$blogAuthor"
                        }
                    }
                }
                ]
            }
        }
    ])

    if (!user) {
        throw new ApiError(404, "Something went wrong while fetching user blog history")
        
    }

    return res.status(200)
    .json(new ApiResponse(200, user[0].blogHistory, " User blog history fetched successfully"))

})





export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    getBlogHistory

    
}