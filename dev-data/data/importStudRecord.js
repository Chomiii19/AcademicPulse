import fs from "fs";
import Student from "../../models/student-record.js";
import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/appError.js";

const importData = catchAsync(async (req, res, next) => {
  const filepath = req.file.path;
  const studentsData = JSON.parse(fs.readFileSync(filepath, "utf-8"));

  await Student.insertMany(studentsData);

  fs.unlink(filepath, (err) => {
    if (err)
      return next(new AppError("File uploaded but failed to delete file", 500));
  });

  res.status(201).json({
    status: "Success",
    message: "Student record successfully created.",
  });
});

const deleteData = catchAsync(async (req, res, next) => {
  await Student.deleteMany();

  res.status(200).json({
    status: "Success",
    message: "Student record successfully deleted.",
  });
});

export { importData, deleteData };
