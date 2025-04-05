import React, { useState, useEffect, useRef } from "react";
import "./Profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { makeAuthenticatedPostRequest } from "../../services/auth.service";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Notification from "./Notification";
import PIC from "./PIC.png";

import { Card, ListGroup } from "react-bootstrap";
import { PersonOutline, EmailOutlined } from "@mui/icons-material";

const gradients = [
  { name: "Sunset", colors: "linear-gradient(135deg, #ff7eb3, #ff758c)" },
  { name: "Ocean Blue", colors: "linear-gradient(135deg, #2193b0, #6dd5ed)" },
  { name: "Purple Haze", colors: "linear-gradient(135deg, #8e2de2, #4a00e0)" },
  { name: "Green Bliss", colors: "linear-gradient(135deg, #11998e, #38ef7d)" },
  { name: "Fiery Red", colors: "linear-gradient(135deg, #ff416c, #ff4b2b)" },
];

const Profile = () => {
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [notification, setNotification] = useState(null);

  //New - Added Lines - Start
  const [selectedGradient, setSelectedGradient] = useState(gradients[0].colors);
  const [image, setImage] = useState(PIC); // Default image
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Set uploaded image
      };
      reader.readAsDataURL(file);
    }
  };

  //End

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setUserData({
        username: user.username.split("@")[0],
        email: user.username,
      });
      setPasswordData((prev) => ({ ...prev, email: user.username }));
    }
  }, []);

  const showNotification = (title, description, type) => {
    setNotification({ title, description, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const handleForgotPassword = async () => {
    try {
      const response = await makeAuthenticatedPostRequest(
        `/api/auth/forgot-password?email=${encodeURIComponent(
          passwordData.email
        )}`,
        null
      );
      showNotification("OTP Sent", response.message, "success");
      setOtpSent(true);
    } catch (error) {
      showNotification(
        "Error",
        error.response?.data?.message || "Failed to send OTP",
        "error"
      );
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await makeAuthenticatedPostRequest(
        `/api/auth/verify-otp?email=${encodeURIComponent(
          passwordData.email
        )}&otp=${encodeURIComponent(passwordData.otp)}`,
        null
      );
      showNotification("OTP Verified", response.message, "success");
      setOtpVerified(true);
    } catch (error) {
      showNotification(
        "Error",
        error.response?.data?.message || "Failed to verify OTP",
        "error"
      );
    }
  };

  const handleResetPassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification("Error", "Passwords do not match", "error");
      return;
    }
    try {
      const response = await makeAuthenticatedPostRequest(
        "/api/auth/reset-password",
        {
          email: passwordData.email,
          otp: passwordData.otp,
          newPassword: passwordData.newPassword,
        }
      );
      showNotification("Success", response.message, "success");
      setPasswordData({
        email: passwordData.email,
        otp: "",
        newPassword: "",
        confirmPassword: "",
      });
      setChangePasswordMode(false);
      setOtpSent(false);
      setOtpVerified(false);
    } catch (error) {
      showNotification(
        "Error",
        error.response?.data?.message || "Failed to reset password",
        "error"
      );
    }
  };

  return (
    // LogoTitle - Profile
    <div>
      <div className="container-fluid text-white">
        <div id="EduProfile-Logo-row" className="row">
          <div
            id="EduProfile-Logo-col"
            className="col-6 d-flex justify-content-start align-items-center ps-4"
          >
            EDUCONNECT
          </div>
        </div>
      </div>
      {/* Page- Title */}
      <div className="container-fluid">
        <div id="EduProfile-Profiletitle-row" className="row">
          <div
            id="EduProfile-Profiletitle-col"
            className="col-12 d-flex justify-content-start align-items-center ps-4"
          >
            <h1>My Profile</h1>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          {/* Profile-Pic & Basic details */}
          <div
            id="EduProfile-Details-col-1"
            className="col d-flex flex-column justify-content-start align-items-center ps-sm-5 pe-sm-5"
          >
            {/* Profile-Pic */}
            <div
              id="User-Profile-Pic"
              className="d-flex flex-column justify-content-center align-items-center w-100 pt-4  mb-4"  style={{ background: selectedGradient }}
            >
              {/* <img id="User-Profile-Picture" src={PIC} alt="User Image" /> */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="d-none"
              />

              {/* Clickable Image */}
              <img
                src={image}
                alt="Profile"
                id="User-Profile-Picture"
                onClick={() => fileInputRef.current.click()}
              />
              <button
                id="User-Profile-Picture-Upload"
                className="mt-1 mb-3"
                onClick={() => fileInputRef.current.click()}
              >
                Change Image
              </button>
              <button id="User-Profile-Picture-Upload"
                className="mt-1 mb-3">
                Background Gradients
              </button>
              <div className="mt-4">
          <select
            className="p-2 rounded text-gray-700"
            onChange={(e) => setSelectedGradient(e.target.value)}
          >
            {gradients.map((gradient, index) => (
              <option key={index} value={gradient.colors}>
                {gradient.name}
              </option>
            ))}
          </select>
        </div>
            </div>
            {/* Basic details */}
            <div className="User-Basic details-Main w-100">
              <Card id="User-Basic-Details-Sub" className="shadow-sm">
                <Card.Header className="text-center fs-5">
                  Profile Information
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex align-items-center pt-3 pb-3">
                    {/* <PersonOutline className="text-primary me-2 fs-4" /> */}
                    <strong>Name :</strong>
                    <p className="ms-2 mb-0">{userData.username}</p>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex align-items-center pt-3 pb-3">
                    {/* <EmailOutlined className="text-primary me-2 fs-4" /> */}
                    <strong>E-Mail :</strong>
                    <p className="ms-2 mb-0">{userData.email}</p>
                  </ListGroup.Item>
                  <Card.Body className="text-center">
                    {/* Change Password Section (Unmodified) */}
                    {!changePasswordMode ? (
                      <button
                        className="change-password-btn"
                        onClick={() => setChangePasswordMode(true)}
                      >
                        <LockOutlinedIcon className="btn-icon" /> Change
                        Password
                      </button>
                    ) : (
                      <div className="password-change-form d-flex flex-column justify-content-center align-items-center">
                        <h3>Change Password</h3>
                        {!otpSent ? (
                          <button
                            className="otp-btn"
                            onClick={handleForgotPassword}
                          >
                            Send OTP
                          </button>
                        ) : !otpVerified ? (
                          <>
                            <input
                              type="text"
                              placeholder="Enter OTP"
                              value={passwordData.otp}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  otp: e.target.value,
                                })
                              }
                              className="profile-input"
                            />
                            <button
                              className="otp-btn"
                              onClick={handleVerifyOtp}
                            >
                              Verify OTP
                            </button>
                          </>
                        ) : (
                          <>
                            <input
                              type="password"
                              placeholder="New Password"
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  newPassword: e.target.value,
                                })
                              }
                              className="profile-input"
                            />
                            <input
                              type="password"
                              placeholder="Confirm Password"
                              value={passwordData.confirmPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  confirmPassword: e.target.value,
                                })
                              }
                              className="profile-input"
                            />
                            <button
                              className="reset-btn"
                              onClick={handleResetPassword}
                            >
                              Reset Password
                            </button>
                          </>
                        )}
                        <button
                          className="cancel-btn"
                          onClick={() => {
                            setChangePasswordMode(false);
                            setOtpSent(false);
                            setOtpVerified(false);
                            setNotification(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    {notification && (
                      <Notification
                        title={notification.title}
                        description={notification.description}
                        type={notification.type}
                        onClose={closeNotification}
                      />
                    )}
                  </Card.Body>
                </ListGroup>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <footer>
      <div className="container-fluid">
        <div id="EduProfile-footer-row" className="row">
        <div
              id="EduProfile-footer-col"
              className="col-12 d-flex flex-column justify-content-center align-items-center mt-4 mb-4"
            >
              © {new Date().getFullYear()} EDUConnect. All rights reserved.
            </div>
        </div>
      </div>
    </footer>
      {/* <div className="profile-container">
        <h2 className="profile-title">Profile</h2>
        <div className="profile-info">
          <div className="profile-item">
            <PersonOutlineOutlinedIcon className="profile-icon" />
            <span className="profile-label">Name:</span>
            <span className="profile-value">{userData.username}</span>
          </div>
          <div className="profile-item">
            <EmailOutlinedIcon className="profile-icon" />
            <span className="profile-label">Email:</span>
            <span className="profile-value">{userData.email}</span>
          </div>
        </div>

        {!changePasswordMode ? (
          <button
            className="change-password-btn"
            onClick={() => setChangePasswordMode(true)}
          >
            <LockOutlinedIcon className="btn-icon" /> Change Password
          </button>
        ) : (
          <div className="password-change-form">
            <h3>Change Password</h3>
            {!otpSent ? (
              <button className="otp-btn" onClick={handleForgotPassword}>
                Send OTP
              </button>
            ) : !otpVerified ? (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={passwordData.otp}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, otp: e.target.value })
                  }
                  className="profile-input"
                />
                <button className="otp-btn" onClick={handleVerifyOtp}>
                  Verify OTP
                </button>
              </>
            ) : (
              <>
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="profile-input"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="profile-input"
                />
                <button className="reset-btn" onClick={handleResetPassword}>
                  Reset Password
                </button>
              </>
            )}
            <button
              className="cancel-btn"
              onClick={() => {
                setChangePasswordMode(false);
                setOtpSent(false);
                setOtpVerified(false);
                setNotification(null);
              }}
            >
              Cancel
            </button>
          </div>
        )}
        {notification && (
          <Notification
            title={notification.title}
            description={notification.description}
            type={notification.type}
            onClose={closeNotification}
          />
        )}
      </div> */}
    </div>
  );
};

export default Profile;
