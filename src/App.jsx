import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import EduconnectLogin from "./EduconnectComponents/EduconnectLoginPage/EduconnectLogin";
import PrivateRoute from "./services/PrivateRoute";
import EduconnectStudent from "./EduconnectComponents/EduconnectStudentPage/EduconnectStudent";
import Loader from "./EduconnectComponents/EduconnectLoginPage/Loader";
import LoginSuccess from "./EduconnectComponents/EduconnectLoginPage/LoginSuccess";
import LoginError from "./EduconnectComponents/EduconnectLoginPage/LoginError";
import AttendQuiz from "./EduconnectComponents/EduconnectStudentPage/AttendQuiz";
import QuizList from "./EduconnectComponents/EduconnectStudentPage/QuizList";
import ModuleDetail from "./EduconnectComponents/EduconnectStudentPage/ModuleDetail";

import ModuleCreation from "./EduconnectComponents/EduconnectTeacherPage/ModuleCreation";
import ResourceUpload from "./EduconnectComponents/EduconnectTeacherPage/ResourceUpload";
import QuizManager from "./EduconnectComponents/EduconnectTeacherPage/QuizManager";
import AnnouncementManager from "./EduconnectComponents/EduconnectTeacherPage/AnnouncementManager";
import EduconnectAdmin from "./EduconnectComponents/EduconnectTeacherPage/EduconnectAdmin";
import ModuleManagement from "./EduconnectComponents/EduconnectTeacherPage/ModuleManagement";
import Conversation from "./EduconnectComponents/EduconnectConversation/Conversation";
import AddStudents from "./EduconnectComponents/EduconnectTeacherPage/AddStudents";
import ModifyStudents from "./EduconnectComponents/EduconnectTeacherPage/ModifyStudents";
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<EduconnectLogin />} />
        
         
        <Route path="/module/:moduleId" element={<ModuleDetail />} />
        
        <Route path="/con" element={<Conversation/>} />
        <Route path="/add" element={<AddStudents/>} />
        <Route path="/u" element={<ModifyStudents/>} />
       


        {/* Protected Route */}
        <Route 
           path="/*"
         
          element={
            <PrivateRoute> 
              <Routes>
                <Route path="/" element={<EduconnectStudent/>}/>
                <Route path="/quizzes" element={<QuizList />} />
                <Route path="/quiz/:quizId" element={<AttendQuiz />} />
                <Route path="/admin" element={<EduconnectAdmin/>} />
                <Route path="/m" element={<ModuleManagement/>} />
              </Routes>
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
