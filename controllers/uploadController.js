import multer from "multer";
import { fileURLToPath } from "url";
import path from "path";
import AppError from "../utils/appError.js";
import { importData } from "../dev-data/data/importStudRecord.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../dev-data/data/"));
  },

  filename: function (req, file, cb) {
    cb(null, "studentRecord.json");
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "application/json")
      return cb(
        new AppError("Invalid file type. File must be in JSON format", 400)
      );

    cb(null, true);
  },
}).single("file");

const uploadFile = (req, res, next) => {
  if (!req.file) return next(new AppError("No file uploaded.", 400));

  importData(req, res, next);
};

export { upload, uploadFile };
