import React, { useState, useEffect, useRef } from "react";
import "./Profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  makeAuthenticatedFileUpload,
  makeAuthenticatedPostRequest,
} from "../../services/auth.service";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Notification from "./Notification";
import PIC from "./PIC.png";

import { Card, ListGroup } from "react-bootstrap";
import { PersonOutline, EmailOutlined } from "@mui/icons-material";

const gradients = [
  "linear-gradient(135deg, #ff758c 20%, #ff7eb3 80%)",
  "linear-gradient(135deg, #667eea 20%, #764ba2 80%)",
  "linear-gradient(135deg, #fcd3ff 20%, #d0e3ff 80%)",
  "linear-gradient(135deg, #ff9a9e 30%, #fad0c4 70%)",
  "linear-gradient(135deg, #a8edea 20%, #fed6e3 80%)",
  "linear-gradient(135deg, #283048 30%, #859398 80%)",
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

  const [selectedGradient, setSelectedGradient] = useState(gradients[0]);
  const changeGradient = () => {
    const randomGradient =
      gradients[Math.floor(Math.random() * gradients.length)];
    setSelectedGradient(randomGradient);
  };

  const [image, setImage] = useState(PIC);
  const fileInputRef = useRef(null);

  const BACKEND_URL = import.meta.env.VITE_Backend_API_URL;

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);

      setUserData({
        username: user.username.split("@")[0],
        email: user.username,
      });
      setPasswordData((prev) => ({ ...prev, email: user.username }));

      const imageUrl = user.profileImageUrl
        ? `${BACKEND_URL}/${user.profileImageUrl}`
        : PIC;

      setImage(imageUrl);
    }
  }, []);

  const showNotification = (title, description, type) => {
    setNotification({ title, description, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("image", file);
      try {
        const response = await makeAuthenticatedFileUpload(
          "/api/auth/update-profile-image",
          formData
        );

        showNotification("Success", "Updated the Profile Image ", "success");

        const user = JSON.parse(localStorage.getItem("user"));
        const profileImageUrl = response.message.split(": ")[1];
        user.profileImageUrl = profileImageUrl;
        localStorage.setItem("user", JSON.stringify(user));

        const newImageUrl = `${BACKEND_URL}/${profileImageUrl}`;

        setImage(newImageUrl);
      } catch (error) {
        console.error("Upload error:", error.response?.data, error.message);
        showNotification(
          "Error",
          error.response?.data?.message ||
            error.message ||
            "Failed to update profile image",
          "error"
        );
        const user = JSON.parse(localStorage.getItem("user"));
        const revertImageUrl = user.profileImageUrl
          ? `${BACKEND_URL}/${user.profileImageUrl}`
          : PIC;

        setImage(revertImageUrl);
      }
    }
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
      console.error("OTP error:", error.response?.data, error.message);
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
      console.error("OTP verify error:", error.response?.data, error.message);
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
      console.error(
        "Reset password error:",
        error.response?.data,
        error.message
      );
      showNotification(
        "Error",
        error.response?.data?.message || "Failed to reset password",
        "error"
      );
    }
  };

  return (
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
          <div
            id="EduProfile-Details-col-1"
            className="col d-flex flex-column justify-content-start align-items-center ps-sm-5 pe-sm-5"
          >
            <div
              id="User-Profile-Pic"
              className="d-flex flex-column justify-content-center align-items-center w-100 pt-4 mb-4"
              style={{ background: selectedGradient }}
              onClick={changeGradient}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="d-none"
              />
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
            </div>
            <div className="User-Basic details-Main w-100">
              <Card id="User-Basic-Details-Sub" className="shadow-sm">
                <Card.Header className="text-center fs-5">
                  Profile Information
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex align-items-center pt-3 pb-3">
                    <strong>Name :</strong>
                    <p className="ms-2 mb-0">{userData.username}</p>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex align-items-center pt-3 pb-3">
                    <strong>E-Mail :</strong>
                    <p className="ms-2 mb-0">{userData.email}</p>
                  </ListGroup.Item>
                  <Card.Body className="text-center">
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
    </div>
  );
};

export default Profile;
