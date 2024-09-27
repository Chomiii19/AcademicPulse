import Student from "../models/student-record.js";
import catchAsync from "../utils/catchAsync.js";

const getAllStudents = catchAsync(async (req, res) => {
  const queryObj = { ...req.query };

  if (queryObj.page) delete queryObj.page;

  let studentsQuery = Student.find(queryObj);

  if (req.query.page) {
    const page = req.query.page * 1;
    const skip = (page - 1) * 10;

    studentsQuery = studentsQuery.skip(skip).limit(10);
  }

  const students = await studentsQuery;

  const totalCount = await Student.countDocuments(queryObj);
  const totalPages = Math.ceil(totalCount / 10);

  res.status(200).json({
    status: "Success",
    totalStudents: totalCount,
    pages: totalPages,
    data: students,
  });
});

export { getAllStudents };
