import React, { useEffect } from "react";
import "./Notification.css";

const Notification = ({ title, description, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Automatically close after 5 seconds
    }, 5000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [onClose]);

  return (
    <div className="notification-container">
      <div className={`notification-alert ${type}`}>
        <div className="alert-content">
          <div className="notification-icon">
            {type === "success" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="icon"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="icon"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 3h.01M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z" />
              </svg>
            )}
          </div>
          <div className="message">
            <p className="title">{title}</p>
            <p className="description">{description}</p>
          </div>
        </div>
        <button className="close-button" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="icon"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification;