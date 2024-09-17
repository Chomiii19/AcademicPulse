import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import * as appController from "../controllers/appController.js";
import * as userAuthentication from "../controllers/user-authentication.js";
import * as rateLimiter from "../utils/rateLimit.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

router.get("/", (req, res) =>
  res.sendFile(join(__dirname, "../public/dist/app.html"))
);

router.get("/id-validation", userAuthentication.protect, (req, res) => {
  res.sendFile(join(__dirname, "../public/dist/idValidation.html"));
});

router
  .route("/id-validation/submit")
  .post(rateLimiter.validateIdLimiter, appController.validateId);
router.route("/student-log/entrance").post(appController.studentLogEntrance);
router.route("/student-log/exit").post(appController.studentLogExit);
router.route("/validated-id-stats").get(appController.validatedIdStats);
router.route("/student-log-stats").get(appController.studentLogStats);

export default router;
