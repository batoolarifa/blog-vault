import { api } from "./api.js";
import inquirer from "inquirer";
import { handleError } from "./utils.js";
import { requireAuth } from "./authGuard.js";
import { capitalize } from "./utils.js";


export async function getCurrentUser() {
  if (!requireAuth("to get your profile")) return;
  const res = await api.get("/users/current-user");

  console.log("Current User:");
  console.log(res.data.data);
}


export async function getBlogHistory() {

  if (!requireAuth("to get your blog history")) return;
  try {
    const res = await api.get("/users/blog-history");

    console.log("\n📚 Your Blog History:\n");

    const blogs = res.data.data;

    if (!blogs || blogs.length === 0) {
      console.log("No blogs found in your history.");
      return;
    }

    blogs.forEach((blog, index) => {
      console.log(`\n--- Blog ${index + 1} ---`);
      console.log("Title:", blog.title);
      console.log("Content:", blog.content);
      console.log("HashTags:", blog.hashtags);
      console.log("Author:", capitalize(blog.blogAuthor?.fullName));
    });

  }
    catch (err) {
    handleError(err);
  }

}


