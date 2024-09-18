import express from "express";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import userRoute from "./routers/user-routes.js";
import appRoute from "./routers/app-routes.js";
import globalErrorHandler from "./controllers/globalErrorHandler.js";
import AppError from "./utils/appError.js";
import * as rateLimit from "./utils/rateLimit.js";
import * as userAuthentication from "./controllers/user-authentication.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set("trust proxy", 1);
app.use(express.static(join(__dirname, "public/dist")));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) =>
  res.sendFile(join(__dirname, "public/dist/index.html"))
);

app.use("/users", userRoute);
app.use("/app", rateLimit.limiter, userAuthentication.protect, appRoute);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} from the server`, 404));
});
app.use(globalErrorHandler);

export default app;
