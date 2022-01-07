const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: [3,'Username must be at least 3 characters'],
      max: 20,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

UserSchema.index({username:1})

exports.UserModel=mongoose.model("User", UserSchema);