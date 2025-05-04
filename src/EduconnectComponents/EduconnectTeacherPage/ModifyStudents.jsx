import React, { useState, useEffect, useCallback } from "react";
import { makeAuthenticatedPutRequest, makeAuthenticatedRequest } from "../../services/auth.service";
import Notification from "../EduconnectStudentPage/Notification";

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
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchStudents = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const data = await makeAuthenticatedRequest(`/teacher/students?teacherId=${user.id}`);
      setStudents(data);
      setLoading(false);
      showNotification("Success", "Students loaded successfully", "success");
    } catch (err) {
      showNotification("Error", err.response?.data?.message || "Failed to fetch students", "error");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setFormData({ name: student.name || "", email: student.email || "", semester: student.semester || "" });
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

    if (name === "name") {
      setFormErrors((prev) => ({ ...prev, name: value.trim() ? "" : "Name is required" }));
    } else if (name === "email") {
      setFormErrors((prev) => ({
        ...prev,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Invalid email format",
      }));
    } else if (name === "semester") {
      const semester = parseInt(value);
      setFormErrors((prev) => ({
        ...prev,
        semester: value === "" || (semester >= 1 && semester <= 8) ? "" : "Semester must be between 1 and 8",
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
      const user = JSON.parse(localStorage.getItem("user"));
      const payload = {
        name: formData.name,
        email: formData.email,
        semester: formData.semester ? parseInt(formData.semester) : null,
      };
      await makeAuthenticatedPutRequest(`/teacher/students/${selectedStudent.id}?teacherId=${user.id}`, payload);
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
      showNotification("Error", err.response?.data?.message || "Failed to update student", "error");
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      (student.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (student.email?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSemester = selectedSemester === "All" || student.semester?.toString() === selectedSemester;
    return matchesSearch && matchesSemester;
  });

  if (loading) {
    return (
      <div className="vh-100 bg-dark d-flex align-items-center justify-content-center">
        <p className="text-white h5">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-dark text-white min-vh-100">
      <header className="bg-dark py-3 px-4">
        <h1 className="h4 font-weight-bold">EDUCONNECT</h1>
      </header>

      <main className="container py-4">
        <h2 className="h3 text-center mb-4 animate__animated animate__fadeIn">Student Management</h2>
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label htmlFor="searchInput" className="form-label">Search by Name or Email</label>
            <input
              type="text"
              id="searchInput"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter name or email"
              className="form-control bg-dark text-white border-secondary"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="semesterFilter" className="form-label">Filter by Semester</label>
            <select
              id="semesterFilter"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="form-select bg-dark text-white border-secondary"
            >
              <option value="All">All</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-hover animate__animated animate__fadeIn">
            <thead>
              <tr>
                <th scope="col" style={{ width: "10%" }}>ID</th>
                <th scope="col" style={{ width: "25%" }}>Name</th>
                <th scope="col" style={{ width: "35%" }}>Email</th>
                <th scope="col" style={{ width: "15%" }}>Semester</th>
                <th scope="col" style={{ width: "15%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name || "N/A"}</td>
                  <td className="text-truncate" style={{ maxWidth: "200px" }}>{student.email || "N/A"}</td>
                  <td>{student.semester || "N/A"}</td>
                  <td>
                    <button
                      onClick={() => handleEditClick(student)}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && (
          <p className="text-center h5 mt-4">No students found.</p>
        )}
      </main>

      {editModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Student</h5>
                <button type="button" className="btn-close" onClick={handleModalClose}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="nameInput" className="form-label">Name</label>
                  <input
                    type="text"
                    id="nameInput"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Enter name"
                    className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
                  />
                  {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">Email</label>
                  <input
                    type="email"
                    id="emailInput"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="Enter email"
                    className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
                  />
                  {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="semesterInput" className="form-label">Semester</label>
                  <input
                    type="number"
                    id="semesterInput"
                    name="semester"
                    value={formData.semester}
                    onChange={handleFormChange}
                    placeholder="Enter semester (1-8)"
                    className={`form-control ${formErrors.semester ? "is-invalid" : ""}`}
                  />
                  {formErrors.semester && <div className="invalid-feedback">{formErrors.semester}</div>}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateStudent}
                  disabled={!isFormValid()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <Notification
          title={notification.title}
          description={notification.description}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <footer className="bg-dark py-3 text-center text-secondary">
        © {new Date().getFullYear()} EDUConnect. All rights reserved.
      </footer>

      <style jsx>{`
        @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css');
        @import url('https://cdn.jsdelivr.net/npm/animate.css@4.1.1/animate.min.css');

        .form-select, .form-control {
          background-color: #212529;
          border-color: #495057;
          color: #fff;
        }

        .form-select:focus, .form-control:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
      `}</style>
    </div>
  );
};

export default ModifyStudents;