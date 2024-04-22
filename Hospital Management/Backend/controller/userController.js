import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
//making use of the cookies generator
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

/// THIS FUNCTION WILL ONLY WORK WHEN THE A PATIENT REGISTERS
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
    role,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !gender ||
    !dob ||
    !nic ||
    !role
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  // findone is use to search for only one of the properties
  // this will if the email is alreay registered or not.
  // this to use to keep all the emails in the system unique
  let user = await User.findOne({ email });
  if (user) {
    //if duplicated email entered it will throw an error
    return next(new ErrorHandler("User already Registered!", 400));
  }
  // otherwise it will create an error
  user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
    role,
  });
  // res.status(200).json({
  //   success: true,
  //   message: "user Registered!",
  // });

  // now instead of writing the sccess msg we will generate the token
  // the details needed the generateToken are as follows: generateToken = (user, message, statusCode, res)
  generateToken(user, "User Registered!", 200, res);
});

//  A FUNCTION TO LOGIN
export const login = catchAsyncErrors(async (req, res, next) => {
  // These are the details we need to login
  // here we are aksing the passsword in the same way twice as it normally asked in a website
  const { email, password, confirmPassword, role } = req.body;
  if (!email || !password || !confirmPassword || !role) {
    // if anything missing an error occurs
    return next(new ErrorHandler("Please provide all the details!", 400));
  }
  // if the both the password and the confirmpassword does not match
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password & Confirm Password Do Not Match!", 400)
    );
  }
  // check if the user is registered or not. Since email is unique for every user therefore we are using that
  // we are using the select password because original the select for password is false and to login we need to it so we need to make it true
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    // if there is no user with that email
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }
  //  invalid password
  // we have an comparePassword method in the schema
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    //if entered password does not match with the stored password
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }
  if (role !== user.role) {
    // if the role does not match
    return next(new ErrorHandler(`User Not Found With This Role!`, 400));
  }

  //if everything works perfectly fine
  // res.status(200).json({
  //   success: true,
  //   message: "User Logged in successfully!",
  // });

  // now instead of writing the sccess msg we will generate the token
  // the details needed the generateToken are as follows: generateToken = (user, message, statusCode, res)

  generateToken(user, "User Logged in Successfully!", 201, res);
});

// ADDING A NEW ADMIN
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, password, gender, dob, nic } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !gender ||
    !dob ||
    !nic
  ) {
    // if anything is missing
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  // checking if the admin is already register or not
  // by creating  fucntion call isRegistere which will check if the admin is already there or not
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler(`${isRegistered.role} With This Email Already Exists!`)
    );
  }
  // if no admin with the entered email exists we will create a new admin
  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
    // since we know that the user is already so w have it here as default
    role: "Admin",
  });
  //giving out a success msg
  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });
});

// A FUNTION TO GET ALL THE REGISTERED DOCTORS
export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  // FIDING THE DOCTORS BY ADDING THE FILTER OF DOCTOR ROLE
  //create a variable called doctors which will store the list of doctors which we can return
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    // returning the list of doctors
    doctors,
  });
});

// A FUNCTION TO ALL THE DETAILS OF A PARTICULAR USER
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  // The user variable will store all the values
  // first we will perform an authentication on the getUserDetails fucntion and when that passes. Then we can get the req.user from the auth.js file to get all the details of the user.
  const user = req.user;
  res.status(200).json({
    success: true,
    //returin the details
    user,
  });
});

// Logout function for dashboard admin
// A FUNCTION TO LOGOUT AN ADMIN
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    // removing the cookie named adminToken.  an "" string is defined after to that is value become nil after logging out
    .cookie("adminToken", "", {
      httpOnly: true,
      // make if forcefully expire
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
    });
});

// Logout function for frontend patient
// A FUNCTION TO LOGOUT A PATIENT
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    // removing the cookie named patientToken.  an "" string is defined after to that is value become nil after logging out
    .cookie("patientToken", "", {
      httpOnly: true,
      // make if forcefully expire
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully.",
    });
});

// A FUCNTION TO ADD A NEW DOCTOR
export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  // 400- BAD REQUEST
  // This is checking that the req.files shpuld be there and the it's length should also be greater than zero
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }

  // now saving the required files in this variable
  const { docAvatar } = req.files;

  // making only to have the allowed formats
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  // mimetype checks for the extention of the file
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
    doctorDepartment,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !gender ||
    !dob ||
    !nic ||
    !doctorDepartment ||
    !docAvatar
  ) {
    return next(new ErrorHandler("Please Fill Full Details!", 400));
  }

  // checking if already an similar exists or not
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler(
        `${isRegistered.role} With This Email Already Exists!`,
        400
      )
    );
  }

  // POSTING THE IMAGE ON CLOUDINARY
  const cloudinaryResponse = await cloudinary.uploader.upload(
    // uploading the docAvatar
    docAvatar.tempFilePath
  );

  // if the cloudinary does not responds or throws an error
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    // or any unkown error
    return next(
      new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
    );
  }

  //creating a doctor
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
    role: "Doctor",
    doctorDepartment,
    //setting up the docAvatar
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "New Doctor Registered",
    // returing which doctor is registered
    doctor,
  });
});
