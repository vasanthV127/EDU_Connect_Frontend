import React, { useState, useEffect } from "react";
import { makeAuthenticatedRequest } from "../../services/auth.service"; // Adjust the import path as needed
import "./Announcements.css";
import EduconnectSidebar from "./EduconnectSidebar";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Loader from "../EduconnectLoginPage/Loader";
import LoginError from "../EduconnectLoginPage/LoginError";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const userString = localStorage.getItem("user");
        const userId = JSON.parse(userString).id;
        if (!userId) {
          throw new Error("User ID not found. Please log in again.");
        }

        const endpoint = `/api/modules/user/${userId}/announcements`;
        const data = await makeAuthenticatedRequest(endpoint);

        setAnnouncements(data);
        setLoading(false);
      } catch (err) {
        setError(
          err.message ||
            "Failed to fetch announcements. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

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
        <div id="EduAncmnt-Logo-row" className="row">
          <div
            id="EduAncmnt-Logo-col"
            className="col-6 d-flex justify-content-start align-items-center ps-4"
          >
            EDUCONNECT
          </div>
        </div>
      </div>
      {/* Announcements-Tilte */}
      <div className="container-fluid">
        <div id="EduAncmnt-Anctitle-row" className="row">
          <div
            id="EduAncmnt-Anctitle-col"
            className="col-12 d-flex justify-content-start align-items-center ps-4"
          >
            Announcements
          </div>
        </div>
      </div>
      {/* Announcements-Body */}
      <div className="container-fluid">
        <div id="Anc-main" className="row">
          <div
            id="announcement-list"
            className="col-12 d-flex flex-column  align-items-center ps-4 pe-4 ps-sm-5 pe-sm-5"
          >
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <Card
                  id="Ancmnt-each-card-main"
                  key={announcement.id}
                  variant="outlined"
                  // sx={{maxWidth: "800px"}}
                >
                  <CardContent>
                    <Typography id="Ancmnt-each-card-title" level="title-md">
                      {announcement.title}
                    </Typography>
                    <Typography id="Ancmnt-each-card-body" level="body-sm">
                      {announcement.content}
                    </Typography>
                  </CardContent>
                  <CardOverflow
                    variant="soft"
                    sx={{ bgcolor: "background.level1" }}
                  >
                    <Divider inset="context" />
                    <CardContent orientation="horizontal">
                      <Typography
                        id="Ancmnt-each-card-posted"
                        level="body-xs"
                        textColor="text.secondary"
                        sx={{ fontWeight: "md" }}
                      >
                        Posted:{" "}
                        {new Date(announcement.datePosted).toLocaleString()}
                      </Typography>
                      <Divider orientation="vertical" />
                      <Typography
                        id="Ancmnt-each-card-by"
                        level="body-xs"
                        textColor="text.secondary"
                        sx={{ fontWeight: "md" }}
                      >
                        By: {announcement.postedByName || "Unknown"}
                      </Typography>
                    </CardContent>
                  </CardOverflow>
                </Card>
              ))
            ) : (
              <p id="EduAnc-NoAnc" className="announcement-content">
                No announcements available.
              </p>
            )}
          </div>
        </div>
      </div>
      {/* <div className="container-fluid">
        <div id="Anc-main" className="row">
          <div id="announcement-list" className="col">
          {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div key={announcement.id} className="announcement-card">
              <h2 className="announcement-title">{announcement.title}</h2>
              <p className="announcement-content">{announcement.content}</p>
              <div className="announcement-meta">
                <span>Posted on: {new Date(announcement.datePosted).toLocaleString()}</span>
                <span>By: {announcement.postedByName || 'Unknown'}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="announcement-content">No announcements available.</p>
        )}
          </div>
        </div>
      </div> */}

      {/* <div id = "Anc-main" className="container-fluid">
      <div className="announcement-list">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div key={announcement.id} className="announcement-card">
              <h2 className="announcement-title">{announcement.title}</h2>
              <p className="announcement-content">{announcement.content}</p>
              <div className="announcement-meta">
                <span>Posted on: {new Date(announcement.datePosted).toLocaleString()}</span>
                <span>By: {announcement.postedByName || 'Unknown'}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="announcement-content">No announcements available.</p>
        )}
      </div>
    </div> */}
      {/* Footer */}
      <footer>
        <div className="container-fluid">
          <div id="EduAncmnt-footer-row" className="row">
            <div
              id="EduAncmnt-footer-col"
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

export default Announcements;
