import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { roleAuthorization } from "../controllers/user-authentication.js";
import checkoutSession from "../controllers/checkoutController.js";
import * as appController from "../controllers/appController.js";
import * as rateLimiter from "../utils/rateLimit.js";
import { upload, uploadFile } from "../controllers/uploadController.js";
import { deleteData } from "../dev-data/data/importStudRecord.js";
import * as studentController from "../controllers/studentController.js";

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

router.get("/student-log/exit", (req, res) => {
  res.sendFile(join(__dirname, "../public/dist/studentLogExit.html"));
});

router.get("/campus-dashboard", roleAuthorization, (req, res) => {
  res.sendFile(join(__dirname, "../public/dist/dashboard.html"));
});

router.get("/unauthorized", (req, res) => {
  res.sendFile(join(__dirname, "../public/dist/unauthorized.html"));
});

router.get("/checkout-full-access/success", (req, res) => {
  res.sendFile(join(__dirname, "../public/dist/success.html"));
});

router.get("/student-record", roleAuthorization, (req, res) => {
  res.sendFile(join(__dirname, "../public/dist/studentRecord.html"));
});

router.route("/checkout-full-access").post(checkoutSession);
router.route("/api/upload").post(upload, uploadFile);
router.route("/api/delete-record").get(deleteData);

router
  .route("/student-log/entrance/submit")
  .post(appController.studentLogEntrance);
router.route("/student-log/exit/submit").post(appController.studentLogExit);
router.route("/api/validated-id-stats").get(appController.validatedIdStats);
router.route("/api/student-log-stats").post(appController.studentLogStats);
router.route("/api/school-log-stats").get(appController.schoolLogStats);
router.route("/api/enrolled-students").get(appController.enrolledStats);
router.route("/api/validated-students").get(appController.validatedStats);
router.route("/api/students-inschool").get(appController.countStudentsInSchool);
router.route("/api/total-users").get(appController.totalUsers);
router.route("/api/getAllStudents").get(studentController.getAllStudents);

export default router;
