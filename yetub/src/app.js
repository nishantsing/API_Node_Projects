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
import healthcheckRouter from "./routes/healthcheck.routes.js";

//routes
app.use("/api/v1/healthcheck", healthcheckRouter);

export { app };
