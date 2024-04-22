import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./router/messageRouter.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
//this will import all the express properties in the app variable
const app = express();

//connect the config file
config({ path: "./config/config.env" });

//Now we will create a middleware to connect our frontend to the backend
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    //now the methods we will be using in our project
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Now another middleware for our backedn to get the cookies
app.use(cookieParser());

//this will be use to parse our json data in string format.
app.use(express.json());

// to recoginize all the different type of datatype values in the input fields
app.use(express.urlencoded({ extended: true }));

//to upload our files
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

//calling the message router on where to send the message
app.use("/api/v1/message", messageRouter);

app.use("/api/v1/user", userRouter);

app.use("/api/v1/appointment", appointmentRouter);
//calling to connect to the datbase here
dbConnection();

app.use(errorMiddleware);
export default app;
