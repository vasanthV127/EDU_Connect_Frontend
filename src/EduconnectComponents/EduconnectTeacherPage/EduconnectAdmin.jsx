import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Sidebar";
import EduconnectHome from "../EduconnectStudentPage/EduconnectHome";
import Resources from "../EduconnectStudentPage/Resources";
import Announcements from "../EduconnectStudentPage/Announcements";
import ResourceUpload from "./ResourceUpload";
import QuizManager from "./QuizManager";
import ModuleCreation from "./ModuleCreation";
import AnnouncementManager from "./AnnouncementManager";
import ModuleManagement from "./ModuleManagement";
import AddStudents from "./AddStudents"; // New import

function EduconnectAdmin() {
  const [activePage, setActivePage] = useState("ResourceUpload"); // Default page
  const userString = localStorage.getItem("user");
  const teacherId = userString ? JSON.parse(userString).id : null;

  return (
    <div>
      <aside>
        <Sidebar setActivePage={setActivePage} />
      </aside>
      <main>
        {activePage === "Home" && <EduconnectHome />}
        {activePage === "Resources" && <Resources />}
        {activePage === "QuizPortal" && <h1>Quiz Portal</h1>} {/* Placeholder until implemented */}
        {activePage === "Announcements" && <Announcements />}
        {activePage === "ResourceUpload" && <ResourceUpload teacherId={teacherId} />}
        {activePage === "ModuleManagement" && <ModuleManagement />}
        {activePage === "QuizManager" && <QuizManager teacherId={teacherId} />}
        {activePage === "ModuleCreation" && <ModuleCreation teacherId={teacherId} />}
        {activePage === "AnnouncementManager" && <AnnouncementManager teacherId={teacherId} />}
        {activePage === "AddStudents" && <AddStudents />} {/* New page */}
        {activePage === "Profile" && <h1>User</h1>}
        {activePage === "Settings" && <h1>Settings Page</h1>}
        {activePage === "Help&Support" && <h1>Help & Support</h1>}
      </main>
    </div>
  );
}

export default EduconnectAdmin;