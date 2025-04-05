import React, { useState, useEffect } from "react";
import { makeAuthenticatedFileUpload, makeAuthenticatedRequest } from "../../services/auth.service";
import "./ResourceUpload.css";
import Notification from "../EduconnectStudentPage/Notification";
import LoginError from "../EduconnectLoginPage/LoginError";
import Loader from "../EduconnectLoginPage/Loader";

const ResourceUpload = ({ teacherId }) => {
  const [resourceData, setResourceData] = useState({
    moduleId: "",
    title: "",
    description: "",
    file: null,
  });
  const [modules, setModules] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user ID from localStorage safely
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const Id = user?.id || null;

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await makeAuthenticatedRequest("/modules");
        setModules(response);
        setLoading(false);
      } catch (error) {
        showNotification("Error", "Failed to fetch modules: " + (error.response?.data?.message || error.message), "error");
        setError(error);
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  const showNotification = (title, description, type) => {
    setNotification({ title, description, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Id) {
      showNotification("Error", "User not authenticated. Please log in.", "error");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("moduleId", resourceData.moduleId);
    formData.append("title", resourceData.title);
    formData.append("description", resourceData.description);
    formData.append("file", resourceData.file);
    formData.append("teacherId", Id);

    try {
      const response = await makeAuthenticatedFileUpload(`/teacher/upload/${resourceData.moduleId}`, formData);
      showNotification("Resource Uploaded", "Resource has been successfully uploaded!", "success");
      setResourceData({ moduleId: "", title: "", description: "", file: null });
    } catch (error) {
      showNotification("Error", "Failed to upload resource: " + (error.response?.data?.message || error.message), "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader />
      </div>
    );
  }

  if (error || !Id) {
    return (
      <div className="error-message">
        <LoginError
          message="Access Denied"
          description={Id ? "Failed to load resources. Please try again." : "Please log in to upload resources."}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="container-fluid text-white">
        <div id="EduResourceUpload-Logo-row" className="row">
          <div
            id="EduResourceUpload-Logo-col"
            className="col-6 d-flex justify-content-start align-items-center ps-4"
          >
            EDUCONNECT
          </div>
        </div>
      </div>
      <div id="resourceupload-main">
        <div className="resource-upload">
          <h2 id="EduResourceUpload-title" style={{ color: "#333" }}>
            Upload Resource
          </h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <select
              value={resourceData.moduleId}
              onChange={(e) => setResourceData({ ...resourceData, moduleId: e.target.value })}
              required
              style={{ padding: "10px", borderRadius: "5px", background: "#ffffffaa", color: "#333", fontSize: "16px" }}
            >
              <option value="" disabled>
                Select Module
              </option>
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  Semester - {module.semester} : {module.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Title"
              value={resourceData.title}
              onChange={(e) => setResourceData({ ...resourceData, title: e.target.value })}
              required
              style={{ padding: "10px", borderRadius: "5px", background: "#ffffffaa", color: "#333", fontSize: "16px" }}
            />
            <textarea
              placeholder="Description"
              value={resourceData.description}
              onChange={(e) => setResourceData({ ...resourceData, description: e.target.value })}
              required
              style={{
                padding: "10px",
                borderRadius: "5px",
                background: "#ffffffaa",
                color: "#333",
                fontSize: "16px",
                resize: "none",
              }}
            />
            <input
              type="file"
              onChange={(e) => setResourceData({ ...resourceData, file: e.target.files[0] })}
              required
              style={{ padding: "10px", borderRadius: "5px", background: "#ffffffaa", color: "#333", fontSize: "16px" }}
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
                    borderRadius: "5px",
                    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                    color: "white",
                    fontSize: "16px",
                    cursor: "pointer",
                    transition: "0.3s",
                  }}
                >
                  Upload Resource
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <footer>
        <div className="container-fluid">
          <div id="EduResourceUpload-footer-row" className="row">
            <div
              id="EduResourceUpload-footer-col"
              className="col-12 d-flex flex-column justify-content-center align-items-center mt-4 mb-4"
            >
              © {new Date().getFullYear()} EDUConnect. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
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

export default ResourceUpload;