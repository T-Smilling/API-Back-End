const express = require("express");
const router = express.Router();

const controller=require("../controllers/user.controller");
const authMiddleware=require("../middlewares/auth.middleware");

router.post("/register",controller.register);
router.post("/login",controller.login);
router.post("/password/forgot",controller.forgotPassword);
router.post("/password/otp",controller.otp);
router.post("/password/reset",controller.resetPassword);
router.post("/detail",controller.detail);
router.post("/list",controller.list);

module.exports=router;