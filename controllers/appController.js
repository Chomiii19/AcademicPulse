import Student from "../models/student-record.js";
import Validated from "../models/student-validated.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import StudentLog from "../models/student-log.js";

const today = new Date().toISOString().split("T")[0];

const validateId = catchAsync(async (req, res, next) => {
  if (!req.body.studentNumber)
    return next(new AppError("Invalid student number", 400));

  const student = await Student.findOne({
    studentNumber: req.body.studentNumber,
  });

  if (!student) return next(new AppError("Student not found", 404));

  if (!student.isEnrolled)
    return next(
      new AppError("Student is not yet enrolled for this school year.", 400)
    );

  if (await Validated.findOne({ studentNumber: student.studentNumber }))
    return next(
      new AppError("Student is already validated for this school year.", 409)
    );

  const validatedStudent = await Validated.create({
    studentNumber: student.studentNumber,
    validatedAt: new Date().toISOString(),
  });

  res.status(201).json({
    status: "Success",
    message: "Successfully validated",
    data: {
      validatedStudent,
      student,
    },
  });
});

const studentLogEntrance = catchAsync(async (req, res, next) => {
  if (!req.body.studentNumber)
    return next(new AppError("Invalid student number", 400));

  const student = await Validated.findOne({
    studentNumber: req.body.studentNumber,
  });

  if (!student) return next(new AppError("Student is not validated", 404));

  const studentLogged = await StudentLog.findOne({
    studentNumber: student.studentNumber,
  });

  if (studentLogged) {
    const todayLog = studentLogged.logs.find(
      (log) => new Date(log.date).toISOString().split("T")[0] === today
    );

    if (todayLog) {
      todayLog.entryTime.push(new Date());
    } else {
      studentLogged.logs.push({
        date: today,
        entryTime: [new Date()],
        exitTime: [],
      });
    }

    await studentLogged.save();
  } else {
    await StudentLog.create({
      studentNumber: student.studentNumber,
      logs: [{ date: today, entryTime: new Date(), exitTime: [] }],
    });
  }

  res.status(201).json({
    status: "Success",
    message: "Success",
  });
});

const studentLogExit = catchAsync(async (req, res, next) => {
  if (!req.body.studentNumber)
    return next(new AppError("Invalid student number.", 400));

  const student = await StudentLog.findOne({
    studentNumber: req.body.studentNumber,
  });

  if (!student)
    return next(new AppError("Student hasn't entered the school yet.", 404));

  const todayLog = student.logs.find(
    (log) => new Date(log.date).toISOString().split("T")[0] === today
  );

  if (todayLog) todayLog.exitTime.push(new Date());

  await student.save();
  res.status(201).json({
    status: "Success",
    message: "Success",
  });
});

const validatedIdStats = catchAsync(async (req, res, next) => {
  const { year } = req.query;

  const data = await Validated.aggregate([
    {
      $match: {
        validatedAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$validatedAt" },
        count: { $sum: 1 },
      },
    },
    { $addFields: { month: "$_id" } },
    { $sort: { _id: 1 } },
    { $project: { _id: 0 } },
  ]);

  res.status(200).json({
    status: "Success",
    data,
  });
});

const studentLogStats = catchAsync(async (req, res, next) => {
  const { groupby } = req.query;

  let groupStats;
  if (groupby === "hour")
    groupStats = {
      $dateToString: { format: "%Y-%m-%d %H", date: "$logs.entryTime" },
    };
  if (groupby === "day")
    groupStats = {
      $dateToString: { format: "%Y-%m-%d", date: "$logs.entryTime" },
    };
  if (groupby === "month")
    groupStats = {
      $dateToString: { format: "%Y-%m", date: "$logs.entryTime" },
    };
  if (groupby === "year")
    groupStats = { $dateToString: { format: "%Y", date: "$logs.entryTime" } };

  const dataLogs = await StudentLog.aggregate([
    { $unwind: "$logs" },
    { $unwind: "$logs.entryTime" },
    {
      $group: {
        _id: groupStats,
        logNumbers: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const data = dataLogs.map((log) => ({
    date: log._id,
    count: log.logNumbers,
  }));

  res.status(200).json({
    status: "Success",
    data,
  });
});

export {
  validateId,
  studentLogEntrance,
  studentLogExit,
  validatedIdStats,
  studentLogStats,
};
