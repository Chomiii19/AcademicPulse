import jwt from "jsonwebtoken";
import { promisify } from "util";
import User from "../models/admin-model.js";
import sendMail from "../utils/send-email.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

const signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    idNumber: req.body.idNumber,
    surname: req.body.surname,
    firstname: req.body.firstname,
    middlename: req.body.middlename,
    extension: req.body.extension,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    isValid: req.body.isValid,
  });

  sendMail("User Verification Email - ID Validation App", user);
  const token = signToken(user._id);

  res.status(201).json({
    status: "Success",
    data: {
      user,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  if (!req.body.idNumber || !req.body.password)
    return next(new AppError("Please input user ID and password", 400));

  const user = await User.findOne({ idNumber: req.body.idNumber }).select(
    "+password"
  );

  if (!(await user?.comparePassword(req.body.password)))
    return next(new AppError("Invalid password", 401));

  if (!user.isValid) return next(new AppError("Account not verified", 401));

  const token = signToken(user._id);
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });

  res.redirect("/app");

  // res.status(201).json({
  //   status: "Success",
  //   data: {
  //     user,
  //   },
  // });
});

const verifyUser = catchAsync(async (req, res, next) => {
  await User.updateOne(
    { _id: req.params.id },
    { isValid: true },
    { runValidators: false }
  );

  res.redirect("/");
});

const protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) return next(new AppError("You are not logged in!", 401));

  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError("The user belonging to this token doesn't exist", 401)
    );

  // console.log("JWT iat:", decoded.iat);
  // console.log("Password changed at:", currentUser.passwordChangedAt);
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  if (currentUser.passwordChangedAt) {
    return next(
      new AppError("User recently changed password. Please login again", 401)
    );
  }

  req.user = currentUser;
  next();
});

export { signup, login, verifyUser, protect };
