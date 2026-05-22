
import inquirer from "inquirer";

import { register, login, logout } from "./auth.js";
import {
  createBlog,
  getBlogs,
  searchBlogs,
  updateBlog,
  deleteBlog,
  blogHistory
} from "./blog.js";


import {
  getCurrentUser,
  getBlogHistory
  
} from "./user.js";

async function menu() {
  const { choice } = await inquirer.prompt([
  {
    type: "list",
    name: "choice",
    message: "Choose action:",
    pageSize: 10,
    loop: false,
    choices: [
      "Register",
      "Login",
      "Logout",
      "Create Blog",
      "View Blogs",
      "Search Blogs",
      "Update Blog",
      "Delete Blog",
      "Blog History",
      "My Profile",
      "Exit"
    ]
  }
]);

  switch (choice) {
    case "Register":
      await register();
      break;

    case "Login":
      await login();
      break;

    case "Logout":
      await logout();
      break;

    case "Create Blog":
      await createBlog();
      break;

    case "View Blogs":
      await getBlogs();
      break;

    case "Search Blogs":
      await searchBlogs();
      break;

    case "Update Blog":
      await updateBlog();
      break;

    case "Delete Blog":
      await deleteBlog();
      break;

    case "Blog History":
      await getBlogHistory();
      break;

    case "My Profile":
      await getCurrentUser();
      break;

    

   

    case "Exit":
      return;
  }

  menu();
}

menu();