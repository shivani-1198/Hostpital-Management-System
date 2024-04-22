// A MODEL FOR THE USER

import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  // NAME OF THE USER
  firstName: {
    type: String,
    //making sure this is always provided
    required: [true, "First Name Is Required!"],
    minLength: [3, "First Name Must Contain At Least 3 Characters!"],
  },
  //LAST NAME OF THE USER
  lastName: {
    type: String,
    //making sure this is always provided
    required: [true, "Last Name Is Required!"],
    minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
  },
  //EMAIL OF THE USER
  email: {
    type: String,
    //making sure this is always provided
    required: [true, "Email Is Required!"],
    validate: [validator.isEmail, "Provide A Valid Email!"],
  },
  //PHNE NUMBER OF THE USER
  phone: {
    type: String,
    //making sure this is always provided
    required: [true, "Phone Is Required!"],
    minLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
    maxLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
  },
  // NIC - NATIONAL IDENTIFICATION NUMBER
  nic: {
    type: String,
    //making sure this is always provided
    required: [true, "NIC Is Required!"],
    minLength: [13, "NIC Must Contain Only 13 Digits!"],
    maxLength: [13, "NIC Must Contain Only 13 Digits!"],
  },

  //DATE OF BIRTH OF THE USER
  dob: {
    type: Date,
    //making sure this is always provided
    required: [true, "DOB Is Required!"],
  },
  //MALE OR FEMALE
  gender: {
    type: String,
    required: [true, "Gender Is Required!"],
    // the values that can be accepted
    enum: ["Male", "Female", "Prefer Not to Say"],
  },
  password: {
    type: String,
    required: [true, "Password Is Required!"],
    minLength: [8, "Password Must Contain At Least 8 Characters!"],
    // this makes sure we can get the details of an user it will provide everything except for this
    select: false,
  },
  role: {
    type: String,
    required: [true, "User Role Required!"],
    enum: ["Patient", "Doctor", "Admin"],
  },
  // this is only filled by the doctors. therefore not required.
  doctorDepartment: {
    type: String,
  },
  docAvatar: {
    public_id: String,
    url: String,
  },
});

//Now we are creating some methods for the followinf reasons:
//1. as soon as a user registers there password should get hashed
//2. or they want to update there password there should be a function for it

// theis means that whenever the userschema is saved(userSchema is saved when a user registers or updates there details)
userSchema.pre("save", async function (next) {
  // works when updated
  if (!this.isModified("password")) {
    next();
  }
  //hashing the password.
  //the await is added to give the time to the function to hash the full password

  //as soon at the new password comes it will hash it
  this.password = await bcrypt.hash(this.password, 10);
});

// to compare the hased password of the user with the password entered.
// enteredPassword = password entered by the user
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// when a user registers a token should generate.
// a fucntion to generate those tokens
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const User = mongoose.model("User", userSchema);
