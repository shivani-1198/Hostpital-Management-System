import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

// Function to sent an appointment
export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ) {
    return next(new ErrorHandler("Please Complete All The Details!", 400));
  }

  // MAKING SURE THERE IS NO CONFLIST BETWEEN 2 SIMILAR DOCOR DETAILS

  //findina doctor with the firstname, lastname and department
  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });

  // if there is no doctor with that name in that department
  if (isConflict.length === 0) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  // if there is more than 1 doctort with the same firstname, lastname and department
  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        "Doctors Conflict! Please Contact Through Email Or Phone!",
        400
      )
    );
  }

  // AFTER MAKING SURE WE GOT THE RIGHT DOCTOR
  // getting the doctor and user id
  const doctorId = isConflict[0]._id;
  //  since the appointment can only send by an authorized patient.  therefor we are getting req.user._id from there
  const patientId = req.user._id;

  // CREATING THE APPOINTMENT
  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited,
    address,
    doctorId,
    patientId,
  });
  res.status(200).json({
    success: true,
    appointment,
    message: "Appointment Is Send Successfully!",
  });
});

// GETTING ALL THE APPOINTMENTS
export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    appointments,
  });
});

// UPDATING STATUS OF AN EXISTING APPOINTMENT - whether we want to accept it or reject it
// here we are updating one specific appointment
export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    //.params -  it is value that can be get by writing :id ate the end of the url to get the id of an user
    const { id } = req.params;
    // npow finding the appointment by that id
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      // 404 - NOT FOUND
      return next(new ErrorHandler("Appointment not found!", 404));
    }
    // ID - THE ID OF THE APPOINTMENT WE want ot update
    // req.body - the data we want to shre from our body

    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Appointment Status Updated!",
      appointment,
    });
  }
);

//DELETING AN APPOINTMENT
export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }
  //  since the appointment has the appointment stored there we will delete it using deleteOne
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment Deleted!",
  });
});
