// a file we create authenticate and autherize the admin before adding a new admin or letting someone login as an admin
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";

// Middleware to authenticate dashboard users

export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
  //getting the admin token
  const token = req.cookies.adminToken;
  //if the token is not found
  if (!token) {
    return next(new ErrorHandler("Admin is not authenticated!", 400));
  }
  //if the token is found
  // veriying if the token that is found  is generated by or any other website

  // BOTH - AUTHENTICATION + AUTHORIZATION
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // finding the user by i
  // the id is coming from the generateJsonWebToken method is userSchema

  req.user = await User.findById(decoded.id);
  // if the user is founded but the role is not admin so they won't be authorized
  //403: this stads for forbiden

  // THIS PART IS - AUTHENTICATION
  if (req.user.role !== "Admin") {
    return next(
      new ErrorHandler(
        `${req.user.role} not authorized for this resource!`,
        403
      )
    );
  }
  next();
});

// Middleware to authenticate frontend users
// AUTHENTICATION for Patient
export const isPatientAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.patientToken;
    if (!token) {
      return next(new ErrorHandler("Patient is not authenticated!", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    // if the role is not patient
    if (req.user.role !== "Patient") {
      return next(
        new ErrorHandler(
          `${req.user.role} not authorized for this resource!`,
          403
        )
      );
    }
    next();
  }
);

// export const isAuthorized = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new ErrorHandler(
//           `${req.user.role} not allowed to access this resource!`
//         )
//       );
//     }
//     next();
//   };
// };
