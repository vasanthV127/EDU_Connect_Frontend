import React, { useState } from "react";
import { makeAuthenticatedPostRequest, makeAuthenticatedFileUpload } from "../../services/auth.service";
import "./AddStudents.css";
import Notification from "../EduconnectStudentPage/Notification";
import LoginError from "../EduconnectLoginPage/LoginError";
import Loader from "../EduconnectLoginPage/Loader";

const AddStudents = () => {
  const [students, setStudents] = useState([{ email: "", name: "", semester: "" }]);
  const [file, setFile] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExcelLoading, setIsExcelLoading] = useState(false);
  const [error, setError] = useState(null);

  const showNotification = (title, description, type) => {
    setNotification({ title, description, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const handleInputChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  const addStudent = () => {
    setStudents([...students, { email: "", name: "", semester: "" }]);
  };

  const removeStudent = (index) => {
    if (students.length > 1) {
      const updatedStudents = students.filter((_, i) => i !== index);
      setStudents(updatedStudents);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      for (const student of students) {
        if (!student.email || !student.name || !student.semester) {
          throw new Error("All fields (email, name, semester) are required for each student");
        }
        if (!/^\d+$/.test(student.semester)) {
          throw new Error("Semester must be a number");
        }
      }

      const response = await makeAuthenticatedPostRequest("/api/auth/bulk-signup", students);
      showNotification("Success", response.message, "success");
      setStudents([{ email: "", name: "", semester: "" }]);
    } catch (error) {
      showNotification(
        "Error",
        "Failed to register users: " + (error.response?.data?.message || error.message),
        "error"
      );
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      showNotification("Error", "Please select an Excel file", "error");
      return;
    }

    setIsExcelLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await makeAuthenticatedFileUpload("/api/auth/bulk-signup-excel", formData);
      showNotification("Success", response.message, "success");
      setFile(null);
      e.target.reset(); // Reset file input
    } catch (error) {
      showNotification(
        "Error",
        "Failed to process Excel file: " + (error.response?.data?.message || error.message),
        "error"
      );
      setError(error.message);
    } finally {
      setIsExcelLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="container-fluid text-white">
        <div id="EduBulkSignup-Logo-row" className="row">
          <div id="EduBulkSignup-Logo-col" className="col-6 d-flex justify-content-start align-items-center ps-4">
            EDUCONNECT
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="bulkSignup-main">
        <div className="bulk-signup">
          <h2 id="EduBulkSignup-title" style={{ color: "#333" }}>
            Add Students
          </h2>

          {/* Manual Entry Form */}
          <h3 style={{ color: "#e0e0e0", fontSize: "20px" }}>Manual Entry</h3>
          <form onSubmit={handleManualSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {students.map((student, index) => (
              <div key={index} className="student-entry">
                <input
                  type="email"
                  placeholder="Email"
                  value={student.email}
                  onChange={(e) => handleInputChange(index, "email", e.target.value)}
                  required
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    background: "#ffffffaa",
                    color: "#333",
                    fontSize: "16px",
                    marginRight: "10px",
                  }}
                />
                <input
                  type="text"
                  placeholder="Name"
                  value={student.name}
                  onChange={(e) => handleInputChange(index, "name", e.target.value)}
                  required
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    background: "#ffffffaa",
                    color: "#333",
                    fontSize: "16px",
                    marginRight: "10px",
                  }}
                />
                <input
                  type="number"
                  placeholder="Semester"
                  value={student.semester}
                  onChange={(e) => handleInputChange(index, "semester", e.target.value)}
                  required
                  min="1"
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    background: "#ffffffaa",
                    color: "#333",
                    fontSize: "16px",
                    marginRight: "10px",
                  }}
                />
                {students.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStudent(index)}
                    style={{
                      padding: "10px",
                      borderRadius: "5px",
                      background: "#ff4444",
                      color: "white",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addStudent}
              style={{
                padding: "10px",
                borderRadius: "5px",
                background: "#444",
                color: "white",
                fontSize: "16px",
                cursor: "pointer",
                maxWidth: "200px",
                alignSelf: "center",
              }}
            >
              Add Another Student
            </button>
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
                  Register Users
                </button>
              )}
            </div>
          </form>

          {/* Excel Upload Form */}
          <h3 style={{ color: "#e0e0e0", fontSize: "20px", marginTop: "20px" }}>Upload Excel File</h3>
          <form onSubmit={handleFileSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              style={{
                padding: "10px",
                borderRadius: "5px",
                background: "#ffffffaa",
                color: "#333",
                fontSize: "16px",
                width: "100%",
                maxWidth: "300px",
                alignSelf: "center",
              }}
            />
            <div className="button-container">
              {isExcelLoading ? (
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
                  Upload & Register
                </button>
              )}
            </div>
          </form>

         
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="container-fluid">
          <div id="EduBulkSignup-footer-row" className="row">
            <div id="EduBulkSignup-footer-col" className="col-12 d-flex flex-column justify-content-center align-items-center mt-4 mb-4">
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

export default AddStudents;