const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const guest = require("../middleware/guest");
const auth = require("../middleware/auth");
const AuthPolicy = require("../policies/AuthPolicy");
router.post("/register", [guest, AuthPolicy.register], UserController.register);
router.post("/login", [guest, AuthPolicy.login], UserController.login);
router.post("/forgot-password", guest, UserController.forgotPassword);
router.get("/", auth, auth, UserController.me);
router.post(
    "/reset-password",
    [guest, AuthPolicy.resetPassword],
    UserController.resetPassword
);
router.delete("/:id", [auth, AuthPolicy.destroy], UserController.destroy);
module.exports = router;
