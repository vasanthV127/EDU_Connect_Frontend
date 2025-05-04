import React, { useState, useContext } from "react";
import "./EduconnectLogin.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../services/AuthContext";
import Loader from "./Loader";
import LoginError from "./LoginError";

function EduconnectLogin() {
  const { login } = useContext(AuthContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false); // For server-side errors
  const [showValidationError, setShowValidationError] = useState(false); // For empty fields
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if email or password is empty
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setShowValidationError(true);
      // Auto-hide validation error after 5 seconds
      setTimeout(() => setShowValidationError(false), 5000);
      return; // Exit the function early
    }

    setIsLoading(true);
    setShowError(false);
    setShowValidationError(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_Backend_API_URL}/api/auth/signin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      login(data.token, {
        id: data.id,
        username: data.username,
        roles: data.roles,
        semester: data.semester,
        profileImageUrl:data.profileImageUrl
      });

      // Set a timeout to delete the token after 20 minutes (1200000 milliseconds)
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Your session has expired. Please log in again.");
        navigate("/"); // Redirect to login page
      }, 1200000); // 20 minutes
      setIsLoading(false);
      
      if (data.roles == "ROLE_ADMIN") navigate("/admin");
      else navigate("/home");
      // Show loader for 5 seconds before navigation
    } catch (error) {
      console.error("Error:", error.message);
      // Show error message after 5 seconds of loading
      setTimeout(() => {
        setIsLoading(false);
        setShowError(true);
        // Auto-hide error after 5 seconds
        setTimeout(() => setShowError(false), 5000);
      }, 5000);
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      {showError && (
        <LoginError
          message="Please try again"
          description="Wrong password or contact admin"
        />
      )}
      {showValidationError && (
        <LoginError
          message="Fill the required fields"
          description="Email and password are required"
        />
      )}
      <div
        id="a"
        className="container-fluid"
        style={{ display: isLoading ? "none" : "block" }}
      >
        <div id="EdcLogin-Main-Row-1" className="row">
          <div id="EdcLogin-Main-col-1" className="col">
            <div
              id="Edc-Logo"
              className="d-flex justify-content-start align-items-center"
            >
              EDUConnect
            </div>
          </div>
          <div
            id="EdcLogin-Main-col-2"
            className="col d-flex flex-column justify-content-center align-items-center"
          >
            <div
              id="Edc-Login-form"
              className="d-flex flex-column align-items-start"
            >
              <p>Sign In</p>
              <p id="Edc-tagline">Access. Learn. Stay Updated.</p>
              <input
                id="Edc-email-input"
                type="email"
                name="E-Mail-ID"
                placeholder="E-Mail"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <div
                id="Edc-Login-form-sub-pass"
                style={{
                  position: "relative",
                  display: "inline-block",
                }}
              >
                <input
                  id="Edc-pass-input"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "33%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  aria-label={
                    passwordVisible ? "Hide password" : "Show password"
                  }
                >
                  {passwordVisible ? (
                    <FaEyeSlash style={{ color: "white" }} />
                  ) : (
                    <FaEye style={{ color: "white" }} />
                  )}
                </button>
              </div>
              <button id="Edc-button" type="button" onClick={handleLogin}>
                Log In
              </button>
            </div>
            <footer
              id="Edc-footer"
              className="mt-5 text-center text-white"
              style={{
                fontSize: "12px",
                opacity: "0.7",
                fontFamily: "Poppins, serif",
                fontWeight: "300",
              }}
            >
              © {new Date().getFullYear()} EDUConnect. All rights reserved.
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EduconnectLogin;
