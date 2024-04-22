import React, { useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Appointment from "./pages/Appointment";
import AboutUs from "./pages/AboutUs";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

import axios from "axios";
import { Context } from "./main";

// NEED TO IMPORT THESE 2 TO RUN RACT-TOASTIFY
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  // GETTING THE USER
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  //Creating fucntion to fetch the user
  // a fucntiont to get the user details it will only work when a patient is logged in
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          // using the url from backedn whhich returnthe list of all the patients
          "http://localhost:4000/api/v1/user/patient/me",
          {
            withCredentials: true,
          }
        );
        // once we get the values we can set the authentication to be true
        setIsAuthenticated(true);
        // and then we are the user details in the user variable we created
        setUser(response.data.user);
      } catch (error) {
        // but if we didn't get the value this means the user is not authenticated. Therefore we will set it to be false
        setIsAuthenticated(false);
        // and the user variable remains empty
        setUser({});
      }
    };
    // calling the funtuon
    fetchUser();
    // this function will only to get the user value when the authentication value changes.
  }, [isAuthenticated]);

  return (
    <>
      {/* A NAVIGATION ROUTE PATH TO ALL THE PAGES */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
        {/* Automatically it appears on the left top most most corner but we can change its position using the position variable */}
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
};

export default App;
