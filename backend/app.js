import dotenv from "dotenv";

dotenv.config(

)



import express from "express";
import cookieParser from "cookie-parser";
import  errorHandler from "./middlewares/error.middleware.js";

const app = express();





app.use(express.json({
    limit:"16kb"
}))


app.use(cookieParser())



// routes import

import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";

// routes  declaration

app.use("/api/v1/users", userRouter)
app.use("/api/v1/blogs", blogRouter)



app.use(errorHandler);



export {app}