import fs from "fs";
import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Student from "../../models/student-record.js";

dotenv.config({ path: "../../.env" });
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB = process.env.DB.replace("<db_password>", DB_PASSWORD);
const app = express();
const filePath = fileURLToPath(import.meta.url);
const __dirname = dirname(filePath);

mongoose
  .connect(DB)
  .then(() => console.log("Successfully connected to DB"))
  .catch(() => console.log("Failed to connect DB"));

app.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);

const students = JSON.parse(
  fs.readFileSync(`${__dirname}/studentRecord.json`, "utf-8")
);

const importData = async () => {
  try {
    await Student.create(students);
    console.log("Students successfully loaded");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Student.deleteMany();
    console.log("Students successfully deleted");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// deleteData();
importData();
