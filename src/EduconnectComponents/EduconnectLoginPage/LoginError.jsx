// LoginError.jsx
import React from 'react';
import './LoginError.css';

const LoginError = ({ message = "Please try again", description = "Wrong password or contact admin" }) => {
  return (
    <div className="login-error-container">
      <div className="error-alert">
        <div className="alert-content">
          <div className="error-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <div className="message">
            <p className="title">{message}</p>
            <p className="description">{description}</p>
          </div>
        </div>
        <button className="close-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default LoginError;