import inquirer from "inquirer";
import { api, setToken } from "./api.js";
import { handleError } from "./utils.js"; 

export async function register() {
try {
  const data = await inquirer.prompt([
    { name: "fullName" },
    { name: "username" },
    { name: "email" },
    { name: "password" },
    { name: "tagline" },
    { name: "about" }
  ]);

  const res = await api.post("/users/register", data);
  console.log("Registered:", res.data.message);

} catch (err) {
    handleError(err);
  }
}


export async function login() {
try {
  const data = await inquirer.prompt([
    { name: "email" },
    { name: "password" }
  ]);

  const res = await api.post("/users/login", data);

  const token = res.data.data.accessToken;

  setToken(token);

  console.log("Login successful");
 }

 catch (err) {
    handleError(err);
  }

}



export async function logout() {
  try {
  await api.post("/users/logout");
  console.log("Logged out");
}
 catch (err) {
    handleError(err);
  }
}