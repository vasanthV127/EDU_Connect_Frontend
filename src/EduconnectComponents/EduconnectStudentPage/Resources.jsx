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

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      // Sort resources by semester in descending order
      const sortedResources = data.sort((a, b) => b.semester - a.semester);
      setResources(sortedResources);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch resources");
      setLoading(false);
    }
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
    } catch (err) {
      console.error("Download failed:", err);
      setError("Failed to download file");
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
    } catch (err) {
      console.error("View failed:", err);
      setError("Failed to view file");
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

  // Gradient colors for cards
  const gradientColors = [
    "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)",
    "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
  ];

  return (
    <div className="resources-container">
      <div className="container-fluid text-white">
        <div id="EduRes-Logo-row" className="row">
          <div
            id="EduRes-Logo-col"
            className="col-6 d-flex justify-content-start align-items-center ps-4"
          >
            EDUCONNECT
          </div>
        </div>
      </div>

      <div id="ResCard-main" className="container-fluid">
        <div className="row">
          <div className="col ps-4 pe-4">
            <Box id sx={{ width: "100%", backgroundColor: "#000000" }}>
              <Typography
                className="d-flex justify-content-start align-items-center my-5"
                id="EducRes-Title"
                sx={{ color: "#ffffff", textAlign: "center" }}
              >
                Learning Resources
              </Typography>
              <Box
                className=""
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
                  gap: 2,
                }}
              >
                {resources.map((resource, index) => (
                  <Card
                    key={resource.id}
                    size="lg"
                    variant="outlined"
                    sx={{
                      background: gradientColors[index % gradientColors.length],
                      animation: `fadeIn 0.5s ease-out forwards`,
                      animationDelay: `${index * 0.1}s`,
                      "&:hover": {
                        transform: "translateY(-5px)",
                        transition: "transform 0.2s",
                      },
                    }}
                  >
                    <Typography id="ResCard-title" level="h2">
                      {resource.title}
                    </Typography>
                    <Divider inset="none" />
                    <Typography
                      id="ResCard-Description"
                      sx={{ color: "text.secondary", mb: 2 }}
                    >
                      {resource.description}
                    </Typography>
                    <Typography id="ResCard-Upload" level="body-sm" sx={{ mb: 2 }}>
                      Uploaded by: {resource.uploadedByName}
                      <br />
                      Semester: {resource.semester}
                    </Typography>
                    <Divider inset="none" />
                    <CardActions>
                      <Button
                        id="ResCard-btn-download"
                        variant="soft"
                        color="neutral"
                        onClick={() => handleDownload(resource.fileUrl)}
                      >
                        Download
                      </Button>
                      <Button
                        id="ResCard-btn-view"
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