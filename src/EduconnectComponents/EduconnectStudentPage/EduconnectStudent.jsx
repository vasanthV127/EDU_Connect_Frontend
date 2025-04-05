import React from "react";
import { useState } from "react";
import "./EduconnectStudent.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EduconnectSidebar from "./EduconnectSidebar";
import EduconnectResource from "./EduconnectResource";
import EduconnectHS from "./EduconnectHS";
import EduconnectHome from "./EduconnectHome";
import EduconnectQuizPortal from "./EduconnectQuizPortal";
import EduconnectAnc from "./EduconnectAnc";
import Announcements from "./Announcements";
import Resources from "./Resources";
import Profile from "./Profile";

function EduconnectStudent() {
  const [activePage, setActivePage] = useState("Home"); // Default page
  return (
    <div>
      <aside>
        <EduconnectSidebar setActivePage={setActivePage} />
      </aside>
      <main>
        {/* <div id="EducStudent-Dashboard-Main" className="container-fluid">
          <div id="EducStudent-row" className="row">
            <div id="EductStudent-col" className="col">
              {activePage === "Home" && <h1>Home</h1>}
              {activePage === "Resources" && <h1>Resources</h1>}
              {activePage === "QuizPortal" && <h1>QuizPortal</h1>}
              {activePage === "Announcements" && <h1>Announcements</h1>}
              {activePage === "Profile" && <h1>User</h1>}
              {activePage === "Settings" && <h1>Settings Page</h1>}
              {activePage === "Help&Support" && <EduconnectHS></EduconnectHS>}
            </div>
          </div>
        </div> */}
        {activePage === "Home" && <EduconnectHome></EduconnectHome>}
        {activePage === "Resources" && (
          <Resources/>
        )}
        {activePage === "QuizPortal" && (
          <EduconnectQuizPortal></EduconnectQuizPortal>
        )}
        {activePage === "Settings" && <h1>Settings Page</h1>}
        {activePage === "Announcements" && <Announcements/>}
        {activePage === "Profile" && <Profile/>}
        {activePage === "Settings" && <h1>Settings Page</h1>}
        {activePage === "Help&Support" && <EduconnectHS></EduconnectHS>}
      </main>
    </div>
  );
}

export default EduconnectStudent;
