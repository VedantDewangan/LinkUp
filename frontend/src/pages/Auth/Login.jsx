import { useEffect, useState } from "react";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { MdVisibility } from "react-icons/md";
import { MdVisibilityOff } from "react-icons/md";
import { login } from "../../firebase/loginUser";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (data.user.verified) {
        toast.success("Login successfully");
        setUser(data.user);
        navigate("/");
      } else {
        await login({
          email: email,
          password: password,
          currentUser: data.user,
        });
        toast.success("Login successfully");
        setUser(data.user);
        navigate("/");
      }
    } catch (error) {
      if (
        error.status === 500 ||
        error.status === 400 ||
        error.status === 404
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <h1>LinkUp</h1>
      <p>Welcome back! Please sign in to your account.</p>
      <form onSubmit={handleSubmit}>
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
        <Link to={"/register"}>Don't have account?</Link>
        <button
          type="submit"
          disabled={loading}
          style={{ opacity: `${loading ? 0.7 : 1}` }}
        >
          {!loading ? "Login" : "Loading..."}
        </button>
      </form>
    </div>
  );
}

export default Login;
