// A CONTROLLER FOR THE MESSAGE WHERE WE CAN SEND THE MESSAGE

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Message } from "../models/messageSchema.js";

//attached the catchasyncherror function to catch any erros
export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  //GETTING ALL THE VARIABLES FROM REQ.BODY
  const { firstName, lastName, email, phone, message } = req.body;
  //check if anything is missing
  if (!firstName || !lastName || !email || !phone || !message) {
    /**
     * //giving out the error message
    // return res.status(400).json({
      // success: false,
    //   message: "Please Fill Full Form",
    // });
     */

    //calling the error middleware
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  // gettign the message from the messageschema and waiting for it to get created
  await Message.create({ firstName, lastName, email, phone, message });
  res.status(200).json({
    success: true,
    message: "Message Sent!",
  });
});

//  can only be acceses by the ADMIN to see all the messages
export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find();
  res.status(200).json({
    success: true,
    messages,
  });
});
