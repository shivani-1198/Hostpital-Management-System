// USE TO CONNECT OUR DATABASE

import mongoose from "mongoose";

export const dbConnection = () => {
  //this will retuire the uri of our database
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "MERN_STACK_HOSPITAL_MANAGEMENT",
    })
    //THEN - this will run if everything runs SUCCESFULLY
    .then(() => {
      console.log("Connected to database!");
    })
    // CATCH - In case of any errors
    .catch((err) => {
      console.log(`Some error occured while connecting to database:, ${err}`);
    });
};
