import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Link, useNavigate, Navigate } from "react-router-dom";

const Login = () => {
  // these are main thing for getting login
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  // these are values we need to let a person login.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigateTo = useNavigate();

  // A LOGIN function which run to login an user
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          // calling the backedn login fucntion
          "http://localhost:4000/api/v1/user/login",
          { email, password, confirmPassword, role: "Patient" },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        // once a logged these are value that will be get set
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        });
    } catch (error) {
      // if not the error will be there
      toast.error(error.response.data.message);
    }
  };

  // a condution to check if the user is already authenticated then they don't need to login. They won't see the login page.
  // Therefore were navigating them to the home page.
  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  // this will for non authenticated i.e., non logged in user
  return (
    <>
      <div className="container form-component login-form">
        <h2>Sign In</h2>
        <p>Please Login To Continue</p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat culpa
          voluptas expedita itaque ex, totam ad quod error?
        </p>
        {/* when the submit button is hit the handleloggin fucntion will work */}
        <form onSubmit={handleLogin}>
          {/* Now we will 3 inputs */}
          {/* 1. The email */}
          <input
            type="text"
            placeholder="Email"
            value={email}
            // on its onchange we are entertin the value in the email variable in the backend
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* 2. The password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            // on its onchange we are entert in the value in the password variable in the backend
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* 3. The Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            // on its onchange we are entert in the value in the confirm password variable in the backend
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div
            style={{
              gap: "10px",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
            <p style={{ marginBottom: 0 }}>Not Registered?</p>
            <Link
              to={"/register"}
              style={{ textDecoration: "none", color: "#271776ca" }}
            >
              Register Now
            </Link>
          </div>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
