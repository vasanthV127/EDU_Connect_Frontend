import React, { useState } from "react";
import { makeAuthenticatedPostRequest } from "../../services/auth.service";
import "./ModuleCreation.css";
import Notification from "../EduconnectStudentPage/Notification";

const ModuleCreation = ({ teacherId }) => {
  const [moduleData, setModuleData] = useState({
    name: "",
    description: "",
    semester: "",
  });
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const showNotification = (title, description, type) => {
    setNotification({ title, description, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loading animation
    try {
      const response = await makeAuthenticatedPostRequest("/modules", moduleData);
      showNotification("Module Created", "Module has been successfully created!", "success");
      setModuleData({ name: "", description: "", semester: "" });
    } catch (error) {
      showNotification("Error", error.response?.data?.message || "Failed to create module", "error");
    } finally {
      setIsLoading(false); // Hide loading animation
    }
  };

  return (
    <div>
      {/* Module-Creation-Logo */}
      <div className="container-fluid text-white">
        <div id="EduModuleCreation-Logo-row" className="row">
          <div
            id="EduModuleCreation-Logo-col"
            className="col-6 d-flex justify-content-start align-items-center ps-4"
          >
            EDUCONNECT
          </div>
        </div>
      </div>

      {/* Module-Creation-Body-Main */}
      <div id="module-main">
        <div className="module-creation">
          <h2 id="Module-Creation-title" style={{ color: "#333" }}>
            Create New Module
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <input
              type="text"
              placeholder="Module Name"
              value={moduleData.name}
              onChange={(e) => setModuleData({ ...moduleData, name: e.target.value })}
              required
              style={{
                padding: "10px",
                border: "none",
                borderRadius: "5px",
                background: "#ffffffaa",
                color: "#333",
                fontSize: "16px",
              }}
            />
            <textarea
              placeholder="Description"
              value={moduleData.description}
              onChange={(e) => setModuleData({ ...moduleData, description: e.target.value })}
              required
              style={{
                padding: "10px",
                border: "none",
                borderRadius: "5px",
                background: "#ffffffaa",
                color: "#333",
                fontSize: "16px",
                resize: "none",
              }}
            />
            <input
              type="number"
              placeholder="Semester"
              value={moduleData.semester}
              onChange={(e) => setModuleData({ ...moduleData, semester: e.target.value })}
              required
              style={{
                padding: "10px",
                border: "none",
                borderRadius: "5px",
                background: "#ffffffaa",
                color: "#333",
                fontSize: "16px",
              }}
            />
            <div className="button-container">
              {isLoading ? (
                <div className="loading-animation">
                  <div className="spinner"></div>
                </div>
              ) : (
                <button
                  type="submit"
                  style={{
                    padding: "12px",
                    border: "none",
                    borderRadius: "5px",
                    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                    color: "white",
                    fontSize: "16px",
                    cursor: "pointer",
                    transition: "0.3s",
                  }}
                >
                  Create Module
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Footer-Module Creation */}
      <footer>
        <div className="container-fluid">
          <div id="EduModuleCreation-footer-row" className="row">
            <div
              id="EduModuleCreation-footer-col"
              className="col-12 d-flex flex-column justify-content-center align-items-center mt-4 mb-4"
            >
              © {new Date().getFullYear()} EDUConnect. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Notification */}
      {notification && (
        <Notification
          title={notification.title}
          description={notification.description}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </div>
  );
};

export default ModuleCreation;