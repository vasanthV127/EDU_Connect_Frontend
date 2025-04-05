import React, { useState, useEffect } from "react";
import { makeAuthenticatedPostRequest, makeAuthenticatedRequest } from "../../services/auth.service";
import "./AnnouncementManager.css";
import Notification from "../EduconnectStudentPage/Notification";
import LoginError from "../EduconnectLoginPage/LoginError";
import Loader from "../EduconnectLoginPage/Loader";
const AnnouncementManager = ({ teacherId }) => {
  const [announcementData, setAnnouncementData] = useState({
    moduleId: "",
    title: "",
    content: "",
  });
  const [modules, setModules] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await makeAuthenticatedRequest("/modules");
        setModules(response);
        setLoading(false)
      } catch (error) {
        showNotification("Error", "Failed to fetch modules: " + (error.response?.data?.message || error.message), "error");
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
    setIsLoading(true);
    try {
      const response = await makeAuthenticatedPostRequest(
        `/api/modules/${announcementData.moduleId}/announcements`,
        {
          title: announcementData.title,
          content: announcementData.content,
        }
      );
      showNotification("Announcement Posted", "Announcement has been successfully created!", "success");
      setAnnouncementData({ moduleId: "", title: "", content: "" });
    } catch (error) {
      showNotification("Error", "Failed to create announcement: " + (error.response?.data?.message || error.message), "error");
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

  if (error) {
    return (
      <div className="error-message">
        <LoginError message="Download failed" description="Please Try Again" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="container-fluid text-white">
        <div id="EduAnnouncementManager-Logo-row" className="row">
          <div
            id="EduAnnouncementManager-Logo-col"
            className="col-6 d-flex justify-content-start align-items-center ps-4"
          >
            EDUCONNECT
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="announcementManager-main">
        <div className="announcement-manager">
          <h2 id="EduAnnouncementManager-title" style={{ color: "#333" }}>
            Create Announcement
          </h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <select
              value={announcementData.moduleId}
              onChange={(e) => setAnnouncementData({ ...announcementData, moduleId: e.target.value })}
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
              value={announcementData.title}
              onChange={(e) => setAnnouncementData({ ...announcementData, title: e.target.value })}
              required
              style={{ padding: "10px", borderRadius: "5px", background: "#ffffffaa", color: "#333", fontSize: "16px" }}
            />
            <textarea
              placeholder="Content"
              value={announcementData.content}
              onChange={(e) => setAnnouncementData({ ...announcementData, content: e.target.value })}
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
                  Post Announcement
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="container-fluid">
          <div id="EduAnnouncementManager-footer-row" className="row">
            <div
              id="EduAnnouncementManager-footer-col"
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

export default AnnouncementManager;