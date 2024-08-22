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
## Connecting to DB

```js
// constant.js 
export const DB_NAME = "vidtube"

// db/index.js
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}` //mongodb+srv://<username>:<password>@abc.dxmnjif.mongodb.net/DB_NAME
    );

    console.log(
      ` \n MongoDB Connected ! DB host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB Connection error", error);
    process.exit(1);
  }
};


```

## Health Check route and testing with postman

- healthcheck.controller.js
```js
import { ApiResponse } from "../utils/ApiResponse";
import { AsyncHandler, asyncHandler } from "../utils/asyncHandler";

const healthcheck = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "OK", "Health check passed"));
});

export { healthcheck };


```

- healthcheck.routes.js

```js
import { Router } from "express";
import { healthcheck } from "../controllers/healthcheck.controller";

const router = Router();

router.route("/").get(healthcheck);

export default router;

```

- app.js
```js
import express from "express";
import cors from "cors";
const app = express();

// middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); // to get req.body if body is in json format
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //to get form data from the encoded url
app.use(express.static("public"));

// Set the view engine to ejs
// app.set('view engine', 'ejs');

// Set the directory where the template files are located
// app.set('views', './views');

//import routes
import healthcheckRouter from "./routes/healthcheck.routes";

//routes
app.use("/api/v1/healthcheck", healthcheckRouter);

export { app };


```


- index.js
```js
import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({ path: "./src/.env" }); // path needs to be provided as its looking for .env in the directory where npm command was run that is in the package.json directory.

const PORT = process.env.PORT || 5001;
connectDB().then(()=>{
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

}).catch((err) => console.log("Mongodb Connection error", err));


```

## Build Models

- [Moon Modeler](https://www.datensen.com/data-modeling/moon-modeler-for-databases.html)

- use eraser instead of moon modeler to create the models.
- write basic models
- monogdb aggregation pipeline(To write comlex query to find avg, max sum and all)

```js
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// There also other plugins.
videoSchema.plugin(mongooseAggregatePaginate);

```

## Hooks and methods in mongoose with JWT

- (Mongoose Docs - Schema methods)[https://mongoosejs.com/docs/api/schema.html]

- These methods are closely attached to models instead of controller.
- pre, post (save, update)
- methods (can create own methods) userSchema.prototype.methods

- user model
```js
/*
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
*/

import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// before saving we want to encrypt password, don't use arrow fns because you want this
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);

```
