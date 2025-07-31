import { useState } from "react";
import { registerUser } from "../../firebase/registerUser";
import "./Auth.css";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaAt, FaL } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { MdVisibility } from "react-icons/md";
import { MdVisibilityOff } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      if (password.length < 8) {
        toast.error("Password should contain atleast 8 characters");
        setLoading(false);
        return;
      }

      if (fullName.length < 3) {
        toast.error("Name should contain atleast 3 characters");
        setLoading(false);
        return;
      }

      if (userName.length < 3) {
        toast.error("Invalid Username");
        setLoading(false);
        return;
      }

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          fullName,
          email,
          password,
          userName,
        }
      );
      await registerUser({ email: email, password: password });
      setSendEmail(true);
      toast.success("Verification link send successfully");
    } catch (error) {
      if (
        error.status === 500 ||
        error.status === 400 ||
        error.status === 404
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Firebase error");
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <h1>LinkUp</h1>
      <p>Create your account to get started.</p>
      {sendEmail ? (
        <p id="verification-link-auth-form">
          We have send the email verification link {"(maybe check in SPAM)"}{" "}
          please <strong>verify</strong> your account and{" "}
          <Link to={"/login"}>login</Link>
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Full Name</label>
            <span>
              <FaUser />
            </span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
              }}
              required
              autoComplete="off"
              placeholder="Enter Fullname"
            />
          </div>
          <div>
            <label>Username</label>
            <span>
              <FaAt />
            </span>
            <input
              type="text"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              required
              autoComplete="off"
              placeholder="Enter Username"
            />
          </div>
          <div>
            <label>Email Address</label>
            <span>
              <MdEmail />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
              autoComplete="off"
              placeholder="Enter Email"
            />
          </div>
          <div>
            <label>Password</label>
            <span>
              <FaLock />
            </span>
            <input
              type={`${visibility ? "text" : "password"}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              autoComplete="off"
              placeholder="Enter Password"
            />
            <span
              id="visibility-auth-form"
              onClick={() => {
                setVisibility((prev) => !prev);
              }}
            >
              {visibility ? <MdVisibilityOff /> : <MdVisibility />}
            </span>
          </div>
          <Link to={"/login"}>Already have account?</Link>
          <button
            type="submit"
            disabled={loading}
            style={{ opacity: `${loading ? 0.7 : 1}` }}
          >
            {!loading ? "Create Account" : "Loading..."}
          </button>
        </form>
      )}
    </div>
  );
}

export default Register;
