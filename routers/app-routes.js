import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import * as appController from "../controllers/appController.js";
import * as rateLimiter from "../utils/rateLimit.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

router.get("/", (req, res) =>
  res.sendFile(join(__dirname, "../public/dist/app.html"))
);

router.get("/id-validation", (req, res) => {
  res.sendFile(join(__dirname, "../public/dist/idValidation.html"));
});

router
  .route("/id-validation/submit")
  .post(rateLimiter.validateIdLimiter, appController.validateId);

router.get("/student-log", (req, res) => {
  res.sendFile(join(__dirname, "../public/dist/studentLog.html"));
});

router.get("/student-log/entrance", (req, res) => {
  res.sendFile(join(__dirname, "../public/dist/studentLogEntrance.html"));
});

router
  .route("/student-log/entrance/submit")
  .post(appController.studentLogEntrance);
router.route("/student-log/exit/submit").post(appController.studentLogExit);
router.route("/validated-id-stats").get(appController.validatedIdStats);
router.route("/student-log-stats").get(appController.studentLogStats);

export default router;
