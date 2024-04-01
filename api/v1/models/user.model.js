const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: String,
    password: String,
    email: String,
    phone:String,
    token: String,
    deleted: {
      type: Boolean,
      default: false
    },
    deleteAt: Date
  },
  {
    timestamps:true
  }
);
const User = mongoose.model("User", UserSchema, "Users");
module.exports=User;