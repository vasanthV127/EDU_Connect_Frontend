import React from "react";
import "./EduconnectQuizPortal.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AttendQuiz from "./AttendQuiz";
import QuizList from "./QuizList";

function EduconnectQuizPortal() {
  return (
    <div>
      
      <QuizList/>
    </div>
  );
}

export default EduconnectQuizPortal;
