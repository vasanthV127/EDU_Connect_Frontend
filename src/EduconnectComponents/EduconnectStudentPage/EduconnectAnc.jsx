import React, { useState, useEffect } from "react";
import "./EduconnectAnc.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { makeAuthenticatedRequest } from "../../services/auth.service";

function EduconnectAnc() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
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

        // Fetch announcements for the user
        const data = await makeAuthenticatedRequest(`/api/modules/user/${userId}/announcements`);
        setAnnouncements(data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="educonnect-anc-container">
      <h2>Announcements</h2>
      {loading ? (
        <p>Loading announcements...</p>
      ) : announcements.length > 0 ? (
        <ul className="announcement-list">
          {announcements.map((announcement) => (
            <li key={announcement.id} className="announcement-item">
              <h4>{announcement.title}</h4>
              <p>{announcement.content}</p>
              <small>Posted on: {new Date(announcement.datePosted).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No announcements available.</p>
      )}
    </div>
  );
}

export default EduconnectAnc;
