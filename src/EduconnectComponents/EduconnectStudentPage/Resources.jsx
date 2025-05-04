import React, { useState, useEffect } from "react";
import { makeAuthenticatedRequest } from "../../services/auth.service";
import axios from "axios";
import RoofingOutlinedIcon from "@mui/icons-material/RoofingOutlined";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import "./Resources.css";
import Loader from "../EduconnectLoginPage/Loader";
import LoginError from "../EduconnectLoginPage/LoginError";
import Notification from "./Notification";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const API_URL = import.meta.env.VITE_Backend_API_URL;

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const userString = localStorage.getItem("user");
      const userId = JSON.parse(userString).id;
      const data = await makeAuthenticatedRequest(
        `/student/resources?userId=${userId}`
      );
      const sortedResources = data.sort((a, b) => b.semester - a.semester);
      setResources(sortedResources);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch resources");
      setLoading(false);
      showNotification("Error", "Failed to fetch resources", "error");
    }
  };

  const showNotification = (title, description, type) => {
    setNotification({ title, description, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const handleDownload = async (fileUrl) => {
    try {
      const token = localStorage.getItem("token");
      const filename = fileUrl.split("/").pop();
      const response = await axios.get(
        `${API_URL}/teacher/download/${filename}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      showNotification("Success", "File downloaded successfully", "success");
    } catch (err) {
      console.error("Download failed:", err);
      showNotification("Error", "Failed to download file", "error");
    }
  };

  const handleView = async (fileUrl) => {
    try {
      const token = localStorage.getItem("token");
      const filename = fileUrl.split("/").pop();
      const response = await axios.get(`${API_URL}/teacher/view/${filename}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(url), 30000);

      showNotification("Success", "File opened successfully", "success");
    } catch (err) {
      console.error("View failed:", err);
      showNotification("Error", "Failed to view file", "error");
    }
  };

  if (loading) {
    return (
      <div id="ResLoadingContainer">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div id="ResErrorMessage">
        <LoginError message="Download failed" description="Please Try Again" />
      </div>
    );
  }

  const gradientColors = [
    "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)",
    "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
  ];

  return (
    <div id="ResContainer">
      {/* Resource - Header */}
      <div className="container-fluid">
        <div id="EduRes-Logo-row" className="row">
          <div
            id="EduRes-Logo-col"
            className="col-6 d-flex justify-content-start align-items-center ps-4"
          >
            EDUCONNECT
          </div>
        </div>
      </div>
      {/* Resource - Cards - Main */}
      <div id="ResCard-main" className="container-fluid">
        <div id="ResContentWrapper" className="row">
          <div id="ResContent" className="col-12 d-flex">
            <Box id="ResBox">
              <Typography
                id="EducRes-Title"
                sx={{ color: "#ffffff", textAlign: "center" }}
              >
                Learning Resources
              </Typography>
              <Box
                id="ResGrid"
                className=" col -12 d-flex gap -2"
              >
                {resources.map((resource, index) => (
                  <Card
                    key={resource.id}
                    id={`ResCard-${resource.id}`}
                    size="lg"
                    variant="outlined"
                    sx={{
                      background: gradientColors[index % gradientColors.length],
                      animation: `fadeIn 0.5s ease-out forwards`,
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <Typography id={`ResCardTitle-${resource.id}`} level="h2">
                      {resource.title}
                    </Typography>
                    <Divider
                      id={`ResCardDivider1-${resource.id}`}
                      inset="none"
                    />
                    <Typography
                      id={`ResCardDescription-${resource.id}`}
                      sx={{ color: "text.secondary", mb: 2 }}
                    >
                      {resource.description}
                    </Typography>
                    <Typography
                      id={`ResCardUpload-${resource.id}`}
                      level="body-sm"
                      sx={{ mb: 2 }}
                    >
                      Uploaded by: {resource.uploadedByName}
                      <br />
                      Semester: {resource.semester}
                    </Typography>
                    <Divider
                      id={`ResCardDivider2-${resource.id}`}
                      inset="none"
                    />
                    <CardActions id={`ResCardActions-${resource.id}`}>
                      <Button
                        id={`ResCardBtnDownload-${resource.id}`}
                        variant="soft"
                        color="neutral"
                        onClick={() => handleDownload(resource.fileUrl)}
                      >
                        Download
                      </Button>
                      <Button
                        id={`ResCardBtnView-${resource.id}`}
                        variant="outlined"
                        color="neutral"
                        onClick={() => handleView(resource.fileUrl)}
                      >
                        View
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            </Box>
          </div>
        </div>
      </div>
      {notification && (
        <Notification
          title={notification.title}
          description={notification.description}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      <footer>
        <div className="container-fluid">
          <div id="EduRes-footer-row" className="row">
            <div
              id="EduRes-footer-col"
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

export default Resources;
