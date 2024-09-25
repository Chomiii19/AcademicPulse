import Student from "../models/student-record.js";
import User from "../models/admin-model.js";
import Validated from "../models/student-validated.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import StudentLog from "../models/student-log.js";

const date = new Date().toISOString().split("T")[0];
const timezoneOffset = new Date().getTimezoneOffset() / 60 || -8;
const utc = Math.abs(timezoneOffset);

const utcDate = (dateStart = date, dateEnd = date) => {
  const startDate = new Date(dateStart);

  const start =
    timezoneOffset < 0
      ? new Date(startDate.getTime() - utc * 60 * 60 * 1000)
      : new Date(startDate.getTime() + utc * 60 * 60 * 1000);

  const adjustEndDate = new Date(`${dateEnd}T23:59:59.999Z`);
  const end =
    timezoneOffset < 0
      ? new Date(adjustEndDate.getTime() - utc * 60 * 60 * 1000)
      : new Date(adjustEndDate.getTime() + utc * 60 * 60 * 1000);

  return { start, end };
};

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
  const { start, end } = utcDate();
  if (!req.body.studentNumber)
    return next(new AppError("Invalid student number!", 400));

  const student = await Validated.findOne({
    studentNumber: req.body.studentNumber,
  });

  if (!student) return next(new AppError("Student is not validated!", 404));

  const studentLogged = await StudentLog.findOne({
    studentNumber: student.studentNumber,
    date: { $gte: start, $lte: end },
  });

  if (studentLogged) {
    if (studentLogged.inSchool)
      return next(new AppError("Student has not yet left school!", 400));
    studentLogged.entryTime.push(new Date());
    studentLogged.inSchool = true;

    await studentLogged.save();
  } else {
    await StudentLog.create({
      studentNumber: student.studentNumber,
      date: new Date(),
      inSchool: true,
      entryTime: [new Date()],
      exitTime: [],
    });
  }

  res.status(201).json({
    status: "Success",
    message: "Success",
  });
});

const studentLogExit = catchAsync(async (req, res, next) => {
  const { start, end } = utcDate();
  if (!req.body.studentNumber)
    return next(new AppError("Invalid student number.", 400));

  const student = await StudentLog.findOne({
    studentNumber: req.body.studentNumber,
    date: { $gte: start, $lte: end },
  });

  if (!student?.inSchool)
    return next(new AppError("Student hasn't entered the school yet.", 404));

  if (student.entryTime.length < student.exitTime.length)
    return next(new AppError("Student hasn't entered the school yet.", 404));

  student.exitTime.push(new Date());
  student.inSchool = false;

  await student.save();
  res.status(201).json({
    status: "Success",
    message: "Success",
  });
});

const validatedIdStats = catchAsync(async (req, res, next) => {
  const { year, month, hours, startDate, endDate } = req.query;

  let filter;
  let groupby;
  let fieldType;

  if (hours) {
    filter = {
      validatedAtUTC8: {
        $gte: new Date(`${hours}T00:00:00`),
        $lte: new Date(`${hours}T23:59:59`),
      },
    };
    groupby = { $hour: "$validatedAtUTC8" };
    fieldType = { hour: "$_id" };
  } else if (year && month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    filter = {
      validatedAtUTC8: {
        $gte: new Date(`${year}-${month}-01`),
        $lte: new Date(`${year}-${month}-${daysInMonth}`),
      },
    };
    groupby = { $dayOfMonth: "$validatedAtUTC8" };
    fieldType = { day: "$_id" };
  } else if (year) {
    filter = {
      validatedAtUTC8: {
        $gte: new Date(`${year}-1-01`),
        $lte: new Date(`${year}-12-31`),
      },
    };
    groupby = { $month: "$validatedAtUTC8" };
    fieldType = { month: "$_id" };
  } else if (startDate && endDate) {
    filter = {
      validatedAtUTC8: {
        $gte: new Date(`${startDate}`),
        $lte: new Date(`${endDate}`),
      },
    };
    groupby = { $year: "$validatedAtUTC8" };
    fieldType = { year: "$_id" };
  }

  const data = await Validated.aggregate([
    {
      $project: {
        validatedAtUTC8: {
          $add: ["$validatedAt", 8 * 60 * 60 * 1000],
        },
      },
    },
    {
      $match: filter,
    },
    {
      $group: {
        _id: groupby,
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $addFields: fieldType },
    { $project: { _id: 0 } },
  ]);

  res.status(200).json({
    status: "Success",
    data,
  });
});

const studentLogStats = catchAsync(async (req, res, next) => {
  const { date, studentNumber } = req.body;
  let fillDateStart = date,
    fillDateEnd = date;
  if (!date) {
    (fillDateStart = "2024-01-01"), (fillDateEnd = "2024-12-31");
  }

  const student = await StudentLog.findOne({ studentNumber });
  if (!student) return next(new AppError("Student not found.", 404));

  const { start, end } = utcDate(fillDateStart, fillDateEnd);
  const data = await StudentLog.aggregate([
    {
      $match: {
        studentNumber: student.studentNumber,
        date: {
          $gte: start,
          $lte: end,
        },
      },
    },
    { $sort: { date: 1 } },
    {
      $project: {
        _id: 0,
        studentNumber: 1,
        entryTime: {
          $map: {
            input: "$entryTime",
            as: "entry",
            in: {
              $dateToString: {
                format: "%H:%M",
                date: { $add: ["$$entry", utc * 60 * 60 * 1000] },
              },
            },
          },
        },
        exitTime: {
          $map: {
            input: "$exitTime",
            as: "exit",
            in: {
              $dateToString: {
                format: "%H:%M",
                date: { $add: ["$$exit", utc * 60 * 60 * 1000] },
              },
            },
          },
        },
        date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
      },
    },
  ]);

  res.status(200).json({
    status: "Success",
    data,
  });
});

const formatData = (data, type) => {
  let entryTimes, exitTimes;

  if (type === "hour") {
    entryTimes = data.entryTimes.map((entry) => entry.hour % 24);
    exitTimes = data.exitTimes.map((exit) => exit.hour % 24);
  } else if (type === "day") {
    entryTimes = data.entryTimes.map((entry) => entry.day);
    exitTimes = data.exitTimes.map((exit) => exit.day);
  } else {
    entryTimes = data.entryTimes.map((entry) => entry.month);
    exitTimes = data.exitTimes.map((exit) => exit.month);
  }

  const entryCounts = data.entryTimes.map((entry) => entry.count);
  const exitCounts = data.exitTimes.map((exit) => exit.count);
  const entryAvg = data.entryTimes.map((entry) => entry.avgHour);
  const exitAvg = data.exitTimes.map((exit) => exit.avgHour);

  return {
    entryLogs: [entryTimes, entryAvg, entryCounts],
    exitLogs: [exitTimes, exitAvg, exitCounts],
  };
};

const schoolLogStats = catchAsync(async (req, res, next) => {
  const { year, month, day } = req.query;
  const daysInMonth = new Date(year, month, 0).getDate();

  let groupbyEntry,
    groupbyExit,
    filterEntry,
    filterEnd,
    fieldNameEntry,
    fieldNameExit,
    project,
    dataLog;

  let addField,
    avgExit = { $toLong: "$exitTime" },
    avgEntry = { $toLong: "$entryTime" };

  if (timezoneOffset < 0) {
    addField = {
      avgHour: {
        $add: [
          {
            $hour: {
              $add: ["$avgDate", utc * 60 * 60 * 1000],
            },
          },
          {
            $divide: [
              {
                $minute: {
                  $add: ["$avgDate", utc * 60 * 60 * 1000],
                },
              },
              60,
            ],
          },
        ],
      },
    };
  } else {
    addField = {
      avgHour: {
        $add: [
          {
            $hour: {
              $subtract: ["$avgDate", utc * 60 * 60 * 1000],
            },
          },
          {
            $divide: [
              {
                $minute: {
                  $subtract: ["$avgDate", utc * 60 * 60 * 1000],
                },
              },
              60,
            ],
          },
        ],
      },
    };
  }

  if (year && month && day) {
    const { start, end } = utcDate(
      `${year}-${month}-${day}`,
      `${year}-${month}-${day}`
    );
    filterEntry = {
      entryTime: {
        $gte: start,
        $lte: end,
      },
    };
    filterEnd = {
      exitTime: {
        $gte: start,
        $lte: end,
      },
    };
    groupbyEntry = { $hour: { $add: "$entryTime" } };
    groupbyExit = { $hour: "$exitTime" };
    fieldNameEntry = { hour: "$_id" };
    fieldNameExit = { hour: "$_id" };
    project =
      timezoneOffset < 0
        ? {
            _id: 0,
            count: 1,
            avgDate: { $toDate: "$avgDate" },
            hour: { $add: ["$hour", utc] },
          }
        : {
            _id: 0,
            count: 1,
            avgDate: { $toDate: "$avgDate" },
            hour: { $subtract: ["$hour", utc] },
          };
  } else if (year && month) {
    const { start, end } = utcDate(
      `${year}-${month}-01`,
      `${year}-${month}-${daysInMonth}`
    );
    filterEntry = {
      entryTime: {
        $gte: start,
        $lte: end,
      },
    };
    filterEnd = {
      exitTime: {
        $gte: start,
        $lte: end,
      },
    };
    groupbyEntry = { $dayOfMonth: "$entryTime" };
    groupbyExit = { $dayOfMonth: "$exitTime" };
    fieldNameEntry = { day: "$_id" };
    fieldNameExit = { day: "$_id" };
    project = { _id: 0, day: 1, count: 1, avgDate: { $toDate: "$avgDate" } };
  } else if (year) {
    const { start, end } = utcDate(`${year}-01-01`, `${year}-12-31`);
    filterEntry = {
      entryTime: {
        $gte: start,
        $lte: end,
      },
    };
    filterEnd = {
      exitTime: {
        $gte: start,
        $lte: end,
      },
    };
    groupbyEntry = { $month: "$entryTime" };
    groupbyExit = { $month: "$exitTime" };
    fieldNameEntry = { month: "$_id" };
    fieldNameExit = { month: "$_id" };
    project = { _id: 0, month: 1, count: 1, avgDate: { $toDate: "$avgDate" } };
    avgEntry = {
      $toLong: {
        $toDate: {
          $concat: [
            {
              $dateToString: {
                format: "%Y-%m-",
                date: "$entryTime",
              },
            },
            "01T",
            {
              $dateToString: {
                format: "%H:%M:%S.%LZ",
                date: "$entryTime",
              },
            },
          ],
        },
      },
    };
    avgExit = {
      $toLong: {
        $toDate: {
          $concat: [
            {
              $dateToString: {
                format: "%Y-%m-",
                date: "$exitTime",
              },
            },
            "01T",
            {
              $dateToString: {
                format: "%H:%M:%S.%LZ",
                date: "$exitTime",
              },
            },
          ],
        },
      },
    };
  }

  const data = await StudentLog.aggregate([
    {
      $facet: {
        entryTimes: [
          { $unwind: "$entryTime" },
          { $project: { _id: 0, entryTime: 1 } },
          { $match: filterEntry },
          {
            $group: {
              _id: groupbyEntry,
              count: { $sum: 1 },
              avgDate: {
                $avg: avgEntry,
              },
            },
          },
          { $sort: { _id: 1 } },
          { $addFields: fieldNameEntry },
          { $project: project },
          { $addFields: addField },
          { $project: { avgDate: 0 } },
        ],
        exitTimes: [
          { $unwind: "$exitTime" },
          { $project: { _id: 0, exitTime: 1 } },
          { $match: filterEnd },
          {
            $group: {
              _id: groupbyExit,
              count: { $sum: 1 },
              avgDate: {
                $avg: avgExit,
              },
            },
          },
          { $sort: { _id: 1 } },
          { $addFields: fieldNameExit },
          { $project: project },
          { $addFields: addField },
          { $project: { avgDate: 0 } },
        ],
      },
    },
  ]);

  if (year && month && day) dataLog = formatData(data[0], "hour");
  else if (year && month) dataLog = formatData(data[0], "day");
  else if (year) dataLog = formatData(data[0], "month");

  res.status(200).json({
    status: "Success",
    data: dataLog,
  });
});

const enrolledStats = catchAsync(async (req, res, next) => {
  const data = await Student.aggregate([
    { $match: { isEnrolled: true } },
    { $group: { _id: null, count: { $sum: 1 } } },
    { $project: { _id: 0, count: 1 } },
  ]);

  res.status(200).json({
    status: "Success",
    data,
  });
});

const validatedStats = catchAsync(async (req, res, next) => {
  const data = await Validated.aggregate([
    { $group: { _id: null, count: { $sum: 1 } } },
    { $project: { _id: 0, count: 1 } },
  ]);

  res.status(200).json({
    status: "Success",
    data,
  });
});

const countStudentsInSchool = catchAsync(async (req, res, next) => {
  const data = await StudentLog.aggregate([
    { $match: { inSchool: true } },
    { $group: { _id: null, count: { $sum: 1 } } },
    { $project: { _id: 0 } },
  ]);

  res.status(200).json({
    status: "Success",
    data,
  });
});

const totalUsers = catchAsync(async (req, res, next) => {
  const data = await User.aggregate([
    { $group: { _id: null, count: { $sum: 1 } } },
    { $project: { _id: 0 } },
  ]);

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
  enrolledStats,
  validatedStats,
  schoolLogStats,
  countStudentsInSchool,
  totalUsers,
};
