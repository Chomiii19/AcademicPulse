import express from "express";
import * as userAuthentication from "../controllers/user-authentication.js";
import * as rateLimit from "../utils/rateLimit.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router
  .route("/signup")
  .post(rateLimit.signupLimiter, userAuthentication.signup);

router.route("/login").post(rateLimit.loginLimiter, userAuthentication.login);
router.route("/verify/:id").get(userAuthentication.verifyUser);
router.route("/signout").get(userAuthentication.signout);

// router.route("/api/users").get();
router
  .route("/api/user")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
