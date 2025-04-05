import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./EduconnectSidebar.css";
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
import EDUCLogo from "./EDUCLogo.png";
import { AuthContext } from "../../services/AuthContext";
import { makeAuthenticatedRequest } from "../../services/auth.service";

function EduconnectSidebar({ setActivePage }) {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const sidebarRef = useRef(null);

  // Fetch announcements for the authenticated user
  const fetchAnnouncements = async () => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        console.error("No user data found in localStorage");
        setNotificationCount(0);
        return;
      }

      const user = JSON.parse(userString);
      const userId = user.id; // Extract ID from parsed user object
      if (!userId) {
        console.error("User ID not found in stored user data");
        setNotificationCount(0);
        return;
      }

      // Fetch user's module announcements
      const announcements = await makeAuthenticatedRequest(`/api/modules/1/announcements`);
      
      // Get viewed announcements from localStorage
      const viewedAnnouncements = JSON.parse(localStorage.getItem("viewedAnnouncements") || "[]");
      // Calculate unread announcements
      const unreadCount = announcements.filter(
        (announcement) => !viewedAnnouncements.includes(announcement.id)
      ).length;
      setNotificationCount(unreadCount);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setNotificationCount(0);
    }
  };

  // Mark notifications as read
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
    navigate("/");
  };

  // Fetch announcements on mount if token exists
  useEffect(() => {
    if (localStorage.getItem("token") && localStorage.getItem("user")) {
      fetchAnnouncements();
    }
  }, []);

  // Handle clicks outside sidebar to close it
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
        <div id="hamburger-icon" onClick={toggleSidebar}>
          <DragHandleOutlinedIcon style={{ fontSize: 30, color: "white", zIndex: 1000 }} />
        </div>
      )}
      <div
        id="Sidebar-main"
        className={isSidebarVisible ? "visible" : ""}
        ref={sidebarRef}
      >
        <div id="Sidebar-logo">
          <img src={EDUCLogo} alt="EDUConnect Logo" className="sidebar-logo" />
          {isSidebarVisible && (
            <div id="close-icon" onClick={toggleSidebar}>
              <CloseOutlinedIcon style={{ fontSize: 30, color: "white" }} />
            </div>
          )}
        </div>
        <div id="Sidebar-links">
          <a href="#" className="sidebar-link" onClick={() => setActivePage("Home")}>
            <RoofingOutlinedIcon style={{ fontSize: 25, color: "white" }} />
            <span className="sidebar-text">Home</span>
          </a>
          <a href="#" className="sidebar-link" onClick={() => setActivePage("Resources")}>
            <NoteOutlinedIcon style={{ fontSize: 25, color: "white" }} />
            <span className="sidebar-text">Resources</span>
          </a>
          <a href="#" className="sidebar-link" onClick={() => setActivePage("QuizPortal")}>
            <QuizOutlinedIcon style={{ fontSize: 25, color: "white" }} />
            <span className="sidebar-text">Quiz Portal</span>
          </a>
          <a href="#" className="sidebar-link" onClick={markNotificationsAsRead}>
            <Badge
              badgeContent={notificationCount}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#7E57C2",
                  color: "white",
                  border: "2px solid white",
                },
              }}
              overlap="circular"
            >
              <NotificationsOutlinedIcon style={{ fontSize: 25, color: "white" }} />
            </Badge>
            <span className="sidebar-text">Announcements</span>
          </a>
          <div id="Sidebar-bottom">
            <a href="#" className="sidebar-link" onClick={() => setActivePage("Profile")}>
              <PersonOutlinedIcon style={{ fontSize: 25, color: "white" }} />
              <span className="sidebar-text">Profile</span>
            </a>
            
            <a href="#" className="sidebar-link" onClick={() => setActivePage("Help&Support")}>
              <HeadsetMicOutlinedIcon style={{ fontSize: 25, color: "white" }} />
              <span className="sidebar-text">Help&Support</span>
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

export default EduconnectSidebar;