import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../styles/LoginSignup.css";

const LoginSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "https://api-node-seclob.onrender.com/api/user/login",
        {
          email,
          password,
        }
      );

      console.log(response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );
      localStorage.setItem(
  "userId",
  response.data.user._id
);

      alert("Login Successful");

      navigate("/");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="auth-container-main-wrapper">
      <div className="signin-panel-left-section">
        <div className="signin-content-wrapper-container centered-signin">
          <h1 className="signin-title-header-text">
            Sign In to <br />
            Your Account
          </h1>

          <form
            onSubmit={handleSignIn}
            className="signin-form-container-element"
          >
            <div className="input-wrapper-email-field">
              <span>✉</span>

              <input
                type="email"
                placeholder="Email"
                className="input-field-email-control"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <div className="input-wrapper-password-field">
              <span>🔒</span>

              <input
                type="password"
                placeholder="Password"
                className="input-field-password-control"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            <button
              type="submit"
              className="signin-button-primary-action"
            >
              {loading ? "Loading..." : "SIGN IN"}
            </button>
          </form>
        </div>
      </div>

      <div className="signup-panel-right-section">
        <div className="signup-content-wrapper-container">
          <h2>Hello Friend!</h2>

          <p>
            Enter your personal details and start
            your journey with us
          </p>

          <button
            onClick={handleSignUp}
            className="signup-button-outline-style"
          >
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;