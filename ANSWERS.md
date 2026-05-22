# 1. How to run

### Step 1: Clone the Repository

```bash
git clone https://github.com/batoolarifa/blog-vault.git
cd blog-vault
```

### Step 2: Required Installs 

Make sure the following are installed on the machine:

- Node.js
- npm
- MongoDB Atlas account


### Step 3: Install Backend Dependencies

Open terminal:

```bash
cd backend
npm install
```

This installs backend packages such as:

- express
- mongoose
- bcrypt
- jsonwebtoken
- dotenv
- nodemon


### Step 4: Install CLI Dependencies

Open another terminal:

```bash
cd cli
npm install
```

This installs CLI packages such as:

- axios
- inquirer


### Step 5: MongoDB Atlas Setup

This project uses MongoDB Atlas for database storage.

Setup steps:

1. Create a MongoDB Atlas account
2. Create a cluster
3. Create a database named:

```text
blogVault
```

4. Inside the database, create these collections:

- `users`
- `blogs`

5. Create a database user with username and password
6. Add your IP address in Network Access
7. Copy the MongoDB Atlas connection string

Example:

```text
mongodb+srv://username:password@cluster.mongodb.net/blogVault
```


### Step 6: Configure Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=8000

MONGODB_URI=your_mongodb_atlas_connection_string

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d
```

### Step 7: Run Backend Server

Inside `backend/`:

```bash
npm run dev
```



### Step 8: Run CLI Application

Inside `cli/`:

```bash
node app.js
```

The CLI menu will appear and the application will be ready to use.


### Persistence

The application uses MongoDB Atlas, so all users and blogs remain saved even after restarting the application.



## 2. Stack Choice

I chose the **Express.js** **JavaScript** as programming language, and **MongoDB (Atlas)** stack because it is really easy and fast for prototyping. My main focus was on implementing the backend logic and functionality, and this stack helped me move quickly without unnecessary complexity.

I used **Node.js and JavaScript** because it allows me to use the same language across both the backend and CLI and  **Express.js** was chosen because it is lightweight and makes it easy to build REST APIs without heavy setup  which makes development quick.

For the database, I used **MongoDB Atlas** because it is suitable for this kind of blogging system. The data structure is flexible where fields like blog content user profiles and optional fields do not need a strict schema like SQL. This makes it as the right choice for this task.

I also used a **CLI instead of a frontend framework** because the focus my was on the functionality instead of the adding unnecessary complexity using the frontend frameworks

### What would be a worse choice and why?

A worse choice would be using a heavy frontend framework like React for this project because it would add unnecessary complexity and slow down development when the main goal is backend functionality.

Another bad choice would be using SQL databases, because the strict schema would make it harder to handle flexible blog and user data.

Even worse would be using file-based storage like JSON files. That would make it difficult to handle relationships between users and blogs, and authentication and querying would become very inefficient.

So my main reason to  chose this stack because it is simple, fast and practical for building a working full-stack system quickly.


## 3. One Real Edge Case

One important edge case my code handles correctly is preventing unauthorized users from accessing protected routes such as creating blogs, updating blogs, deleting blogs, and viewing personal blog history.

This is handled using JWT authentication middleware in:

```text
backend/src/middlewares/auth.middleware.js
```

and applied in routes such as:

```text
backend/src/routes/blog.routes.js
backend/src/routes/user.routes.js
```

For example in the routes:

```js
router.use(verifyJWT)
```

allows and checks that only authenticated users can access protected blog actions.

Another important edge case is in the blog history feature, where users should only be able to access their own blog history and not another user's data. This is handled in the:

```text
backend/src/controllers/user.controller.js
```

where the logged-in user ID is taken from:

```js
req.user?._id
```

instead of accepting a random user ID from the client.

Without this handling, any user could potentially access another user's private blog history by manually passing different IDs.

The project also handles validation edge cases such as:

- Preventing duplicate users with the same email or username
- Rejecting invalid email formats
- Password strength validation
- Preventing empty required fields
- Restricting protected actions to logged-in users only

Without these checks, the application could store invalid data, allow duplicate accounts, or expose protected user information.

# 4. AI Usage

I used ChatGPT during development for:

* debugging Axios authentication issues
* understanding JWT token flow
* improving CLI structure
* improving Mongoose aggregation pipelines
* writing README documentations files
* improving error handling messages
* refining validation logic

One example where I modified AI output:

The AI initially suggested protecting all blog routes using:

```js
router.use(verifyJWT)
```

But this prevented public blog searching and viewing.

I changed the routing structure so public routes like:

```js
GET /blogs
```

remain accessible without authentication, while protected routes still require JWT verification.

I changed this because the application requirements needed public blog viewing but protected blog creation and modification.


# 5. Honest Gap

One thing that is not good enough yet is authentication persistence in the CLI.

Currently, JWT tokens are only stored in memory while the CLI session is running.

This means:

* restarting the CLI logs the user out
* users must login again every time

With another day, I would improve this by:

* securely storing tokens so that user don't have to login again.
* automatically loading the token on startup
* implementing auto-login and adding token expiration handling

Another improvement would be adding better UI frontend instead of this CLI version.

## 6. Beyond Basic CRUD

Beyond basic CRUD operations, the application includes:

### Blog Search

Users can search blogs using keywords.

This improves usability and gives flexiability because users can quickly find relevant blogs instead of manually browsing all entries.

This feature makes the application more practical than a plain CRUD demo.


### User Blog History

Logged-in users can view their own blog history.

This is handled using protected routes and JWT authentication so that users can only access their own data.


### Authentication and Validation

The application also includes several checks that improve security and reliability:

- Protected routes using JWT authentication
- Login and logout system in the CLI
- Duplicate user checks during registration
- Email validation
- Password validation
- Restricting blog creation, updates, and deletion to logged-in users only

These features make the project more like a real application instead of just a simple CRUD system.
