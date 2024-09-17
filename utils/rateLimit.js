import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again after an hour!",
});

const signupLimiter = rateLimit({
  max: 10,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again after an hour!",
});

const loginLimiter = rateLimit({
  max: 10,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again after an hour!",
});

export { limiter, signupLimiter, loginLimiter };
