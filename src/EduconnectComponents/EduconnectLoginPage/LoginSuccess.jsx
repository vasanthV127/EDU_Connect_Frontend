// LoginSuccess.jsx
import React from 'react';
import './LoginSuccess.css';

const LoginSuccess = () => {
  return (
    <div className="login-success-container">
      <div className="success-alert">
        <div className="alert-content">
          <div className="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <div className="message">
            <p className="title">Done successfully :)</p>
            <p className="description">This is the description section</p>
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

export default LoginSuccess;