export const Logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    res.status(200).json({
      message: "Logged out successfully",
    });
    return;
  } catch (error) {
    console.log("Error in logout");
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};
