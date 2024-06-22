# Project Yetub Node API

[YT - Complete Backend Series- Hitesh](https://youtu.be/nhmMx-ys_zQ)

## Create Yetub ER diagram using eraser

```
videos [icon: video, color: blue] {
  id string pk
  videoFile string
  thumbnail string
  owner ObjectId
  title string
  description string
  duration number
  views number
  isPublished boolean
  createdAt Date  
  updatedAt Date
}

users [icon: user, color: blue] {
  id string pk
  watchHistory objectId[]
  username string
  email string
  fullName string
  avatar string
  coverImage string
  password string
  refreshToken string
  createdAt Date
  updatedAt Date
}

comments [icon: comment] {
  id string pk
  content string
  createdAt Date
  updatedAt Date
  video ObjectId
  owner ObjectId
}

playlists [icon: play] {
  id string pk
  name string
  description string
  createdAt Date
  updatedAt Date
  videos objectId[]
  owner objectId
}

tweets [icon: twitter, color: blue] {
  id string pk
  owner ObjectId
  content string
  createdAt Date
  updatedAt Date
}

subscriptions [icon: money, color: green] {
  id string pk
  subscriber ObjectId
  channel ObjectId
  createdAt Date
  updatedAt Date
}

likes [icon: thumbs-up, color: blue]{
  id string pk
  comment ObjectId
  video ObjectId
  createdAt Date
  updatedAt Date
  likedBy ObjectId
  tweet ObjectId
}

users.watchHistory <> videos.id

videos.owner - users.id

subscriptions.subscriber - users.id
subscriptions.channel  - users.id

likes.likedBy - users.id
likes.video  - videos.id
likes.comment - comments.id
likes.tweet  - tweets.id

comments.owner - users.id
comments.video - videos.id

playlists.owner - users.id
playlists.videos < videos.id 

tweets.owner - users.id
```

## Project Structure

[YT - Backend Project Structure - Hitesh](https://youtu.be/eDHl26DWrk4)

src/index.js
"type": "module",
npm i -D nodemon prettier
npm i express mongoose dotenv cors
"start": "node src/index.js",
"dev":"nodemon src/index.js"
npm run dev
cd src
mkdir controllers db middlewares models routes utils
touch app.js index.js constants.js .env .env.sample readme.md
touch db/index.js
cd models
touch comment.models.js like.models.js playlist.models.js subscription.models.js tweet.models.js  user.models.js  video.models.js


#### prettier dev dependency

.prettierignore
```
/.vscode
/node_modules
./dist

*.env
.env
.env.*
```

.prettierrc
```
{
  "singleQuote":false,
  "bracketSpacing":true,
  "tabWidth":2,
  "trailingComma":"es5",
  "semi":true
}

```

### dotenv issue
------------------------------------------------

- when you run your Node.js script with a specific path like node src/index.js, you need to ensure that the dotenv configuration correctly points to the .env file inside the src directory. By default, dotenv looks for the .env file in the current working directory (where the node command is executed).

```js
// Import the dotenv package
import dotenv from 'dotenv';

// Specify the path to your .env file
dotenv.config({ path: './src/.env' });
```
package.json
```json
nodemon -r dotenv/config --experimental-json-modules src/index.js
```


------------------------------------------------

## connect to db

- adding CORS to allow selected frontend to connect to our backend, for local give global access *.

In db network access give the machines ip address where the backend is deployed to make it more secure. For local use give 0.0.0.0/0 to give global access.

## Standardized Error Handler and Response (optional)

- async handler to handle try catches which we will be creating inside all the controller functions.

```js
const asyncHandler = (requestHandler) => {
  return (req, res, next) => { // middleware fn
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err)); // this cn be replaced by try catch block as well.
  };
};

export {asyncHandler}

// try catch implementation

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    try {
      const result = requestHandler(req, res, next);
      if (result instanceof Promise) {
        result.catch((err) => next(err));
      }
    } catch (err) {
      next(err);
    }
  };
};

export { asyncHandler };

```


- Standardized api response (optional)

```js

//Class Function
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

// Constructor Function
function ApiResponse(statusCode, data, message = "Success") {
  this.statusCode = statusCode;
  this.data = data;
  this.message = message;
  this.success = statusCode < 400;
}

const response1 = new ApiResponse(200, { key: "value" });

// Normal Function
function ApiResponse(statusCode, data, message = "Success") {
  return {
    statusCode,
    data,
    message,
    success: statusCode < 400,
  };
}

// Example usage:
const response = ApiResponse(200, { key: "value" });
```

- Standardized error response (optional)

```js
class ApiError extends Error { // extending nodejs Error class
  constructor(
    statusCode,
    message = "Something went wrong",
    error = [],
    stack = ""
  ) {
    super(message)
    this.statusCode =statusCode
    this.data = null
    this.message= message
    this.success =false
    this.errors = errors

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// constructor fn
function ApiError(statusCode, message = "Something went wrong", errors = [], stack = "") {
  Error.call(this, message); // Call the parent constructor
  this.name = "ApiError"; // Set the name property to ApiError
  this.statusCode = statusCode;
  this.data = null;
  this.message = message;
  this.success = false;
  this.errors = errors;

  if (stack) {
    this.stack = stack;
  } else {
    Error.captureStackTrace(this, this.constructor);
  }
}

// Inherit from Error
ApiError.prototype = Object.create(Error.prototype);
ApiError.prototype.constructor = ApiError;

// Example usage:
const errorInstance = new ApiError(404, "Not Found", ["Resource not found"]);
console.log(errorInstance);


// Using normal fn
function createApiError(statusCode, message = "Something went wrong", errors = [], stack = "") {
  const error = new Error(message); // Create a new Error object
  error.name = "ApiError"; // Set the name property to ApiError
  error.statusCode = statusCode;
  error.data = null;
  error.message = message;
  error.success = false;
  error.errors = errors;

  if (stack) {
    error.stack = stack;
  } else {
    Error.captureStackTrace(error, createApiError);
  }

  return error;
}

// Example usage:
const errorObject = createApiError(500, "Internal Server Error", ["Database error"]);
console.log(errorObject);
/*

```