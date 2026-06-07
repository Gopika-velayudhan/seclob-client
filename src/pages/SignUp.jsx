import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import "../styles/Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        "https://api-node-seclob.onrender.com/api/user/userRegister",
        formData
      );

      setMessage(response.data.message);

      setFormData({
        Username: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>Welcome Back!</h1>
          <p>
            To keep connected with us please login with your personal info
          </p>

          <button
            className="sign-in-btn"
            onClick={handleSignIn}
          >
            SIGN IN
          </button>
        </div>
      </div>

      <div className="signup-section">
        <div className="signup-content">
          <h2>Create Account</h2>

          {message && (
            <p
              style={{
                color:
                  message === "Registration successful"
                    ? "green"
                    : "red",
              }}
            >
              {message}
            </p>
          )}

          <div className="signup-form">
            <div className="input-group">
              <div className="input-icon">
                <FaUser />
              </div>

              <input
                type="text"
                name="Username"
                placeholder="Username"
                value={formData.Username}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <div className="input-icon">✉</div>

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <div className="input-icon">🔒</div>

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <button
              type="button"
              className="sign-up-btn"
              onClick={handleSignUp}
              disabled={loading}
            >
              {loading ? "Registering..." : "SIGN UP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;