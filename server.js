import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();

const DB = process.env.DB.replace("<db_password>", process.env.DB_PASSWORD);

mongoose
  .connect(DB)
  .then(() => console.log("Successfully connected to database..."))
  .catch(() => console.log("Failed to connect database..."));

app.listen(process.env.PORT, () =>
  console.log(`Server listening on port: ${process.env.PORT}`)
);
