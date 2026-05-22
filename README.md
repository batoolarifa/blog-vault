# Blog Vault 

Blog Vault is a full-stack blogging platform with a Command Line Interface (CLI) where users can:

- Register and login
- Create, update, and delete blogs
- Search and view blogs
- View their own blog history
- Manage their profile securely using JWT authentication



# 🚀 Features

## Authentication
- User Registration
- User Login
- JWT-based Authentication
- Secure Password Hashing using bcrypt
- Logout Functionality

## Blog Features
- Create Blogs
- Update Blogs
- Delete Blogs
- Search Blogs
- View All Blogs
- User Blog History


# Protected Routes

The following actions require login:

* Create Blog
* Update Blog
* Delete Blog
* View Blog History
* View Current User Profile

Public routes:

* View Blogs
* Search Blogs


#  Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=8000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d
```


# 📦 Installation

## 1. Clone the repository

```bash
git clone https://github.com/batoolarifa/blog-vault.git
cd blog-vault
```

---

## 2. Install dependencies

### Backend

```bash
cd backend
npm install
```

### CLI

```bash
cd cli
npm install
```


# ▶️ Run the Application

## Start Backend Server

```bash
cd backend
npm run dev
```

---

## Start CLI

Open another terminal:

```bash
cd cli
node app.js
```



# CLI Menu

```bash
? Choose action:
❯ Register
  Login
  Create Blog
  View Blogs
  Search Blogs
  Update Blog
  Delete Blog
  User Blog History
  My Profile
  Exit
```




## 👤 **Author**

**Syeda Arifa Batool**  
SE @ Karachi University | AI/ML Engineer | Applying technology to create real-world value 📈



## 🔗 **Connect with Me**

- **LinkedIn:** [Syeda Arifa Batool](https://www.linkedin.com/in/arifa-batool/)  
- **Kaggle:** [Syeda Arifa Batool](https://www.kaggle.com/thearifabatool)  
- **Email:** [thearifabatool@gmail.com](mailto:thearifabatool@gmail.com)

⭐ If you find this project useful, feel free to star the repository!
