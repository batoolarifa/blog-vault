import inquirer from "inquirer";
import { api } from "./api.js";
import { requireAuth } from "./authGuard.js";
import { handleError } from "./utils.js"; 



export async function createBlog() {
  if (!requireAuth("creating a blog")) return;
 try {
  const data = await inquirer.prompt([
    { name: "title" },
    { name: "content" },
    { name: "hashtags" }
  ]);

  const res = await api.post("/blogs/publish", data);

  console.log("Blog has been created:", res.data.message);
 } 
 catch (err) {
     handleError(err);
   }
}


export async function getBlogs() {


  const res = await api.get("/blogs");

  console.log(res.data.data.blogs);
 }



export async function searchBlogs() {

  const { keyword } = await inquirer.prompt([
    { name: "keyword" }
  ]);

  const res = await api.get(`/blogs?search=${keyword}`);

  console.log(res.data.data.blogs);
}



export async function updateBlog() {

  if (!requireAuth("updating a blog")) return;

  try {
  const { blogId, title, content } = await inquirer.prompt([
    { name: "blogId" },
    { name: "title" },
    { name: "content" }
  ]);

  const res = await api.patch(`/blogs/${blogId}`, {
    title,
    content
  });

  console.log(res.data.message);
}
 catch (err) {
     handleError(err);
   }
}


export async function deleteBlog() {
  if (!requireAuth("deleting a blog")) return;

  try {
  const { blogId } = await inquirer.prompt([
    { name: "blogId" }
  ]);

  const res = await api.delete(`/blogs/${blogId}`);

  console.log(res.data.message);

} catch (err) {
    handleError(err);
  }
}



export async function blogHistory() {
  if (!requireAuth("viewing blog history")) return;
  try {
  const res = await api.get("/users/blog-history");

  console.log(res.data.data);
}
 catch (err) {
     handleError(err);
   }
}