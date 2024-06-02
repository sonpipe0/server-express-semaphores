import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    required: true,
    unique: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    unique: true,
    type: String,
  },
  age: {
    required: true,
    type: Number,
  },
  isAdmin: {
    required: true,
    type: Boolean,
  },
});

export default mongoose.model("User", userSchema);
