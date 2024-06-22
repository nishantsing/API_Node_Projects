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

