import React, { useState, useEffect, useCallback } from "react";
import { makeAuthenticatedPutRequest, makeAuthenticatedRequest } from "../../services/auth.service";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Table from "@mui/joy/Table";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Notification from "../EduconnectStudentPage/Notification";
import "./ModifyStudents.css";

const ModifyStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", semester: "" });
  const [formErrors, setFormErrors] = useState({ name: "", email: "", semester: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("All");
  const API_URL = import.meta.env.VITE_Backend_API_URL;

  const showNotification = (title, description, type) => {
    setNotification({ title, description, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const fetchStudents = useCallback(async () => {
    try {
      const userString = localStorage.getItem("user");
      const teacherId = JSON.parse(userString).id;
      const data = await makeAuthenticatedRequest(`/teacher/students?teacherId=${teacherId}`);
      setStudents(data);
      setLoading(false);
      showNotification("Success", "Students loaded successfully", "success");
    } catch (err) {
      console.error("Failed to fetch students:", err.response?.data, err.message);
      showNotification(
        "Error",
        err.response?.data?.message || "Failed to fetch students",
        "error"
      );
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name || "",
      email: student.email || "",
      semester: student.semester || "",
    });
    setFormErrors({ name: "", email: "", semester: "" });
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedStudent(null);
    setFormData({ name: "", email: "", semester: "" });
    setFormErrors({ name: "", email: "", semester: "" });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Basic validation
    if (name === "name") {
      setFormErrors((prev) => ({
        ...prev,
        name: value.trim() ? "" : "Name is required",
      }));
    } else if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setFormErrors((prev) => ({
        ...prev,
        email: emailRegex.test(value) ? "" : "Invalid email format",
      }));
    } else if (name === "semester") {
      const semester = parseInt(value);
      setFormErrors((prev) => ({
        ...prev,
        semester:
          value === "" || (semester >= 1 && semester <= 8)
            ? ""
            : "Semester must be between 1 and 8",
      }));
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      (formData.semester === "" || (parseInt(formData.semester) >= 1 && parseInt(formData.semester) <= 8)) &&
      !formErrors.name &&
      !formErrors.email &&
      !formErrors.semester
    );
  };

  const handleUpdateStudent = async () => {
    if (!isFormValid()) {
      showNotification("Error", "Please fix form errors", "error");
      return;
    }

    try {
      const userString = localStorage.getItem("user");
      const teacherId = JSON.parse(userString).id;
      const payload = {
        name: formData.name,
        email: formData.email,
        semester: formData.semester ? parseInt(formData.semester) : null,
      };
      const response = await makeAuthenticatedPutRequest(
        `/teacher/students/${selectedStudent.id}?teacherId=${teacherId}`,
        payload
      );
      setStudents((prev) =>
        prev.map((student) =>
          student.id === selectedStudent.id
            ? { ...student, ...formData, semester: formData.semester ? parseInt(formData.semester) : null }
            : student
        )
      );
      handleModalClose();
      showNotification("Success", "Student updated successfully", "success");
    } catch (err) {
      console.error("Failed to update student:", err.response?.data, err.message);
      showNotification(
        "Error",
        err.response?.data?.message || "Failed to update student",
        "error"
      );
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      (student.name && student.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (student.email && student.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSemester =
      selectedSemester === "All" ||
      (student.semester && student.semester.toString() === selectedSemester);
    return matchesSearch && matchesSemester;
  });

  if (loading) {
    return (
      <div id="StudentsLoadingContainer">
        <Typography id="StudentsLoading">Loading...</Typography>
      </div>
    );
  }

  return (
    <div id="StudentsContainer">
      <div id="EduStudents-Logo-row" className="container-fluid text-white">
        <div id="EduStudents-Logo-col" className="col-6 d-flex justify-content-start align-items-center ps-4">
          EDUCONNECT
        </div>
      </div>

      <div id="Students-main" className="container-fluid">
        <div id="StudentsContentWrapper" className="row">
          <div id="StudentsContent" className="col-12 d-flex flex-column align-items-center">
            <Box id="StudentsBox" sx={{ width: "100%", backgroundColor: "#000000" }}>
              <Typography id="EduStudents-Title" sx={{ color: "#ffffff", textAlign: "center" }}>
                Student Management
              </Typography>
              <div id="StudentsFilters">
                <FormControl id="StudentsSearchControl">
                  <FormLabel id="StudentsSearchLabel">Search by Name or Email</FormLabel>
                  <Input
                    id="StudentsSearchInput"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Enter name or email"
                  />
                </FormControl>
                <FormControl id="StudentsSemesterControl">
                  <FormLabel id="StudentsSemesterLabel">Filter by Semester</FormLabel>
                  <select
                    id="StudentsSemesterFilter"
                    value={selectedSemester}
                    onChange={handleSemesterChange}
                  >
                    <option value="All">All</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </FormControl>
              </div>
              <Table
                id="StudentsTable"
                sx={{ width: "100%", color: "#ffffff" }}
                stripe="odd"
                hoverRow
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Semester</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.name || "N/A"}</td>
                      <td>{student.email || "N/A"}</td>
                      <td>{student.semester || "N/A"}</td>
                      <td>
                        <Button
                          id={`StudentsEditBtn-${student.id}`}
                          variant="outlined"
                          color="neutral"
                          onClick={() => handleEditClick(student)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {filteredStudents.length === 0 && (
                <Typography id="StudentsNoResults" sx={{ color: "#ffffff", textAlign: "center", my: 4 }}>
                  No students found.
                </Typography>
              )}
            </Box>
          </div>
        </div>
      </div>

      <Modal open={editModalOpen} onClose={handleModalClose}>
        <ModalDialog id="StudentsModalDialog">
          <Typography id="StudentsModalTitle" level="h2">
            Edit Student
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl id="StudentsNameControl" error={!!formErrors.name}>
              <FormLabel id="StudentsNameLabel">Name</FormLabel>
              <Input
                id="StudentsNameInput"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Enter name"
              />
              {formErrors.name && (
                <Typography id="StudentsNameError" color="danger" sx={{ fontSize: "sm" }}>
                  {formErrors.name}
                </Typography>
              )}
            </FormControl>
            <FormControl id="StudentsEmailControl" error={!!formErrors.email}>
              <FormLabel id="StudentsEmailLabel">Email</FormLabel>
              <Input
                id="StudentsEmailInput"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="Enter email"
              />
              {formErrors.email && (
                <Typography id="StudentsEmailError" color="danger" sx={{ fontSize: "sm" }}>
                  {formErrors.email}
                </Typography>
              )}
            </FormControl>
            <FormControl id="StudentsSemesterFormControl" error={!!formErrors.semester}>
              <FormLabel id="StudentsSemesterFormLabel">Semester</FormLabel>
              <Input
                id="StudentsSemesterInput"
                name="semester"
                type="number"
                value={formData.semester}
                onChange={handleFormChange}
                placeholder="Enter semester (1-8)"
              />
              {formErrors.semester && (
                <Typography id="StudentsSemesterError" color="danger" sx={{ fontSize: "sm" }}>
                  {formErrors.semester}
                </Typography>
              )}
            </FormControl>
            <Box id="StudentsModalActions" sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 2 }}>
              <Button
                id="StudentsCancelBtn"
                variant="outlined"
                color="neutral"
                onClick={handleModalClose}
              >
                Cancel
              </Button>
              <Button
                id="StudentsSaveBtn"
                variant="solid"
                color="primary"
                onClick={handleUpdateStudent}
                disabled={!isFormValid()}
              >
                Save
              </Button>
            </Box>
          </Box>
        </ModalDialog>
      </Modal>

      {notification && (
        <Notification
          title={notification.title}
          description={notification.description}
          type={notification.type}
          onClose={closeNotification}
        />
      )}

      <footer>
        <div id="EduStudents-footer-row" className="container-fluid">
          <div id="EduStudents-footer-col" className="col-12 d-flex flex-column justify-content-center align-items-center mt-4 mb-4">
            © {new Date().getFullYear()} EDUConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModifyStudents;