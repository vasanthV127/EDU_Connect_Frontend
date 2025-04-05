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
import Dashboard from "./EduconnectComponents/EduconnectStudentPage/DashBoard";
import ModuleCreation from "./EduconnectComponents/EduconnectTeacherPage/ModuleCreation";
import ResourceUpload from "./EduconnectComponents/EduconnectTeacherPage/ResourceUpload";
import QuizManager from "./EduconnectComponents/EduconnectTeacherPage/QuizManager";
import AnnouncementManager from "./EduconnectComponents/EduconnectTeacherPage/AnnouncementManager";
import EduconnectAdmin from "./EduconnectComponents/EduconnectTeacherPage/EduconnectAdmin";
import ModuleManagement from "./EduconnectComponents/EduconnectTeacherPage/ModuleManagement";
import Conversation from "./EduconnectComponents/EduconnectConversation/Conversation";
import AddStudents from "./EduconnectComponents/EduconnectTeacherPage/AddStudents";
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<EduconnectLogin />} />
        
         
        <Route path="/module/:moduleId" element={<ModuleDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/con" element={<Conversation/>} />
        <Route path="/add" element={<AddStudents/>} />
        
       


        {/* Protected Route */}
        <Route 
           path="/*"
         
          element={
            <PrivateRoute> 
              <Routes>
                <Route path="/home" element={<EduconnectStudent/>}/>
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
