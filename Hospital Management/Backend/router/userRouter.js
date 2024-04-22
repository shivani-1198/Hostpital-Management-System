import express from "express";
import {
  addNewAdmin,
  addNewDoctor,
  getAllDoctors,
  getUserDetails,
  login,
  logoutAdmin,
  logoutPatient,
  patientRegister,
} from "../controller/userController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/patient/register", patientRegister);
router.post("/login", login);

// The value in the middle is MIDDLEVARE once only it gets approved than the other one works

// ------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------

// only an Admin can admin a new admin therefore for a admin a new admin we need the authentication of previous admin
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);

// only an admin can add a new doctor therefore we have that authentication here before adding a new doctor
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);

// get the list of all the doctors in the system
router.get("/doctors", getAllDoctors);

// this will return the details of a patient when a patient is logged in which is checked by the isPatientAuthenticated function
router.get("/patient/me", isPatientAuthenticated, getUserDetails);

// this will return the details of an admin when an admin is logged in which is checked by the isAdminAuthenticated function
router.get("/admin/me", isAdminAuthenticated, getUserDetails);

// route to logout a patient. Also making sure the everything is authenticated
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);

// route to logout an Admin. Also making sure the everything is authenticated
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);

export default router;
