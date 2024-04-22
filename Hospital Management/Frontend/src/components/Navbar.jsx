
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";

const Navbar = () => {
  const [show, setShow] = useState(false);
  // geting the authecation variable to have the security
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  // logout function
  const handleLogout = async () => {
    await axios
    // getting logout url from the backedn where we already created it
      .get("http://localhost:4000/api/v1/user/patient/logout", {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  // create navigateTo valriable that will be use to navigate from one page to
  const navigateTo = useNavigate();

  // login funtion
  const goToLogin = () => {
    // we will navigation them to the login page
    navigateTo("/login");
  };

  return (
    <>
      <nav className={"container"}>
        <div className="logo">
            {/* CHAMGE THIS LOGO FOR A MORE PERSONALIZED ONE */}
          <img src="/logo.png" alt="logo" className="logo-img" />
        </div>
        {/* This will work for the smaller screen where we  get an icon inplace of navbar and when the icon is clicked only then the navbar will be visible otherwise not */}
        <div className={show ? "navLinks showmenu" : "navLinks"}>

          <div className="links">
            {/*  links we are getting from the react-router-dom that will help us in navagtion from one screen to another */}
            <Link to={"/"} onClick={() => setShow(!show)}>
              Home
            </Link>
            <Link to={"/appointment"} onClick={() => setShow(!show)}>
              Appointment
            </Link>
            <Link to={"/about"} onClick={() => setShow(!show)}>
              About Us
            </Link>
          </div> 
          {/* now we setting the condition on the basis of the authentication on what to show and what not  */}
          {/* but only an authenticated person can logout there only they see the logout button otherwise there will to login button */}
          {isAuthenticated ? (
            // calling logout fucntion
            <button className="logoutBtn btn" onClick={handleLogout}>
              LOGOUT
            </button>
          ) : (
            // calling login fucntion
            <button className="loginBtn btn" onClick={goToLogin}>
              LOGIN
            </button>
          )}
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
