import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  idNumber: {
    type: String,
    required: [true, "A user must have an id number"],
    unique: true,
  },
  surname: {
    type: String,
    required: [true, "A user must have a surname"],
  },
  firstname: {
    type: String,
    required: [true, "A user must have a firstname"],
  },
  middlename: {
    type: String,
  },
  extension: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    validate: [validator.isEmail, "Invalid email"],
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "A user must have a phone number"],
    validate: {
      validator: (value) => {
        const val = value.replace(/\D/g, "");
        return val.length === 11 && val.startsWith("09") && true;
      },
      message: "Invalid phone number",
    },
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return this.password === value;
      },
      message: "Password mismatch",
    },
  },
  passwordChangedAt: {
    type: Date,
    default: null,
  },
  isValid: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.changedPasswordAfter = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

const User = mongoose.model("User", userSchema);
export default User;
