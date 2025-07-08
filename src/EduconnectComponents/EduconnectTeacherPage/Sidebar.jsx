import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DragHandleOutlinedIcon from "@mui/icons-material/DragHandleOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Badge from "@mui/material/Badge";
import RoofingOutlinedIcon from "@mui/icons-material/RoofingOutlined";
import NoteOutlinedIcon from "@mui/icons-material/NoteOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined"; // For Module Creation
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined"; // For Resource Upload
import AnnouncementOutlinedIcon from "@mui/icons-material/AnnouncementOutlined"; // For Announcement Manager
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined"; // For Module Management
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined"; // For Add Students
import EDUClogo from "../../assets/EDUCLogo.png";
import { AuthContext } from "../../services/AuthContext";
import { makeAuthenticatedRequest } from "../../services/auth.service";

function Sidebar({ setActivePage }) {
  const navigate = useNavigate();
  const { logout  } = useContext(AuthContext);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const sidebarRef = useRef(null);

  const fetchAnnouncements = async () => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        console.error("No user data found in localStorage");
        setNotificationCount(0);
        return;
      }

      const user = JSON.parse(userString);
      const userId = user.id;
      if (!userId) {
        console.error("User ID not found in stored user data");
        setNotificationCount(0);
        return;
      }

      const announcements = await makeAuthenticatedRequest(`/api/modules/1/announcements`);
      const viewedAnnouncements = JSON.parse(localStorage.getItem("viewedAnnouncements") || "[]");
      const unreadCount = announcements.filter(
        (announcement) => !viewedAnnouncements.includes(announcement.id)
      ).length;
      setNotificationCount(unreadCount);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setNotificationCount(0);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        console.error("No user data found in localStorage");
        return;
      }

      const user = JSON.parse(userString);
      const userId = user.id;
      if (!userId) {
        console.error("User ID not found in stored user data");
        return;
      }

      const announcements = await makeAuthenticatedRequest(`/api/modules/1/announcements`);
      const viewedAnnouncements = JSON.parse(localStorage.getItem("viewedAnnouncements") || "[]");
      const updatedViewed = [...new Set([...viewedAnnouncements, ...announcements.map(a => a.id)])];
      localStorage.setItem("viewedAnnouncements", JSON.stringify(updatedViewed));
      
      setNotificationCount(0);
      setActivePage("Announcements");
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (localStorage.getItem("token") && localStorage.getItem("user")) {
      fetchAnnouncements();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {!isSidebarVisible && (
        <div id="edu-menu-toggle" onClick={toggleSidebar}>
          <DragHandleOutlinedIcon style={{ fontSize: 30, color: "white", zIndex: 1000 }} />
        </div>
      )}
      <div
        id="edu-sidebar-container"
        className={isSidebarVisible ? "visible" : ""}
        ref={sidebarRef}
      >
        <div id="edu-logo-section">
          <img src={EDUClogo} alt="EDUConnect Logo" className="sidebar-logo" />
          {isSidebarVisible && (
            <div id="edu-close-btn" onClick={toggleSidebar}>
              <CloseOutlinedIcon style={{ fontSize: 30, color: "white" }} />
            </div>
          )}
        </div>
        <div id="edu-nav-links">
         
          
          {/* New Admin Links */}
          <a href="#" className="sidebar-link" onClick={() => setActivePage("ResourceUpload")}>
            <UploadFileOutlinedIcon style={{ fontSize: 25, color: "white" }} />
            <span className="sidebar-text">Resource Upload</span>
          </a>
          <a href="#" className="sidebar-link" onClick={() => setActivePage("QuizManager")}>
            <QuizOutlinedIcon style={{ fontSize: 25, color: "white" }} />
            <span className="sidebar-text">Quiz Manager</span>
          </a>
          <a href="#" className="sidebar-link" onClick={() => setActivePage("ModuleCreation")}>
            <SchoolOutlinedIcon style={{ fontSize: 25, color: "white" }} />
            <span className="sidebar-text">Module Creation</span>
          </a>
          <a href="#" className="sidebar-link" onClick={() => setActivePage("ModuleManagement")}>
            <LibraryBooksOutlinedIcon style={{ fontSize: 25, color: "white" }} />
            <span className="sidebar-text">Module Management</span>
          </a>
          <a href="#" className="sidebar-link" onClick={() => setActivePage("AnnouncementManager")}>
            <AnnouncementOutlinedIcon style={{ fontSize: 25, color: "white" }} />
            <span className="sidebar-text">Announcement Manager</span>
          </a>
          <a href="#" className="sidebar-link" onClick={() => setActivePage("AddStudents")}>
            <GroupAddOutlinedIcon style={{ fontSize: 25, color: "white" }} />
            <span className="sidebar-text">Add Students</span>
          </a>
          <div id="edu-footer-section">
            <a href="#" className="sidebar-link" onClick={() => setActivePage("Profile")}>
              <PersonOutlinedIcon style={{ fontSize: 25, color: "white" }} />
              <span className="sidebar-text">Profile</span>
            </a>
            
            <a href="#" className="sidebar-link" onClick={handleLogout}>
              <LogoutOutlined style={{ fontSize: 25, color: "white" }} />
              <span className="sidebar-text">Log out</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;