//CREATING A ROUTER WHERE WE CAN DEFINE A PATH

import express from "express";
import {
  sendMessage,
  getAllMessages,
} from "../controller/messageController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

//defining a router
const router = express.Router();

//sice we are sending the data, that means we are posting the data therefore we will be using post method

router.post("/send", sendMessage);
router.get("/getall", isAdminAuthenticated, getAllMessages);

export default router;
