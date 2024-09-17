import { promisify } from "util";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/admin-model.js";
import AppError from "../utils/appError.js";

const getUser = catchAsync(async (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) return next(new AppError("Your are not logged in!", 401));

  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
  const user = await User.findById(decoded.id);

  if (!user) return next(new AppError("User does not exist.", 404));

  res.status(200).json({
    status: "Success",
    data: {
      user,
    },
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) return next(new AppError("Your are not logged in!", 401));

  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
  const tokenOwner = await User.findById(decoded.id);

  if (!tokenOwner) return next(new AppError("User not found!", 404));

  const user = await User.findByIdAndUpdate(decoded.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "Success",
    data: {
      user,
    },
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) return next(new AppError("Your are not logged in!", 401));

  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
  const tokenOwner = await User.findById(decoded.id);

  if (!tokenOwner) return next(new AppError("User not found!", 404));

  await User.findByIdAndDelete(decoded.id);
  res.clearCookie("authToken");

  res.status(200).json({
    status: "Success",
    message: "User successfully deleted",
  });
});

export { getUser, updateUser, deleteUser };
