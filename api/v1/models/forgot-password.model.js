const mongoose = require("mongoose");

const ForgotPasswordSchema = new mongoose.Schema(
  {
    email:String,
    otp:String,
    expireAt: {
      type: Date,
      expires: 180
    }
  },
  {
    timestamps:true
  }
);
const ForgotPassword = mongoose.model("ForgotPassword", ForgotPasswordSchema, "Forgot-Passwords");
module.exports=ForgotPassword;