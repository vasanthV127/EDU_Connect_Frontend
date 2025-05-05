import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import React from "react";
const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (!auth) {
  
    return <Navigate to="/login" />;
  }

  
  return children;
};

export default PrivateRoute;
