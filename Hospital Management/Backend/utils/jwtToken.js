// need to generate COOKIES
// COOKIES are to AUTHENTICATE user
// withour cookies we can't do the authentication or the authorization

export const generateToken = (user, message, statusCode, res) => {
  // since we all the userschema methods are alreadly store in he user thrpught the generateJsonWebToken function from userSchema therefore we are calling that function here.
  const token = user.generateJsonWebToken();
  console.log("Generated Token:", token);
  // Determine the cookie name based on the user's role
  //we are giving cookie a Name because there are gonna be 2 frontends
  // 1 for admin dashboard  and 1 regular frontend
  // if the role is Admin than the cookie name is adminToken otherwise patientToken
  const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(
        //cookie_expie = 7 => 7 * hour * minute * second * millisecond
        // this means the cookie will expire 7 days from today
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
