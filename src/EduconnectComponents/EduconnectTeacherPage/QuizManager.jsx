import React, { useState, useEffect } from "react";
import { makeAuthenticatedPostRequest, makeAuthenticatedRequest } from "../../services/auth.service";
import "./QuizManager.css";
import Notification from "../EduconnectStudentPage/Notification";
import LoginError from "../EduconnectLoginPage/LoginError";
import Loader from "../EduconnectLoginPage/Loader";

const QuizManager = ({ teacherId }) => {
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    moduleId: "",
    semester: "",
  });
  const [questions, setQuestions] = useState([]);
  const [modules, setModules] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Safely get user ID from localStorage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const Id = user?.id || null;

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await makeAuthenticatedRequest("/modules");
        setModules(response);
        setLoading(false);
      } catch (error) {
        showNotification("Error", "Failed to fetch modules: " + (error.response?.data?.message || error.message), "error");
        setError(error);
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  const showNotification = (title, description, type) => {
    setNotification({ title, description, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const effectiveTeacherId = Id || teacherId;
      if (!effectiveTeacherId) {
        showNotification("Error", "User not authenticated. Please log in.", "error");
        return;
      }

      const quizPayload = {
        title: quizData.title,
        description: quizData.description,
        module: { id: Number(quizData.moduleId) },
        semester: Number(quizData.semester),
        createdBy: { id: Number(effectiveTeacherId) },
        isActive: true,
      };

      const quizResponse = await makeAuthenticatedPostRequest("/api/quizzes/create", quizPayload);
      if (questions.length > 0) {
        const formattedQuestions = questions.map((q) => ({
          questionText: q.questionText,
          optionA: q.options[0],
          optionB: q.options[1],
          optionC: q.options[2],
          optionD: q.options[3],
          correctAnswer: q.correctAnswer.charAt(0).toUpperCase(),
        }));

        await makeAuthenticatedPostRequest(`/api/quizzes/${quizResponse.id}/questions/batch`, formattedQuestions);
      }

      showNotification("Quiz Created", "Quiz has been successfully created!", "success");
      setQuizData({ title: "", description: "", moduleId: "", semester: "" });
      setQuestions([]);
    } catch (error) {
      showNotification("Error", "Failed to create quiz: " + (error.response?.data?.message || error.message), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      },
    ]);
  };

  const handleModuleChange = (e) => {
    const selectedModuleId = e.target.value;
    const selectedModule = modules.find((module) => module.id === Number(selectedModuleId));
    setQuizData({
      ...quizData,
      moduleId: selectedModuleId,
      semester: selectedModule ? selectedModule.semester : "",
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader />
      </div>
    );
  }

  if (error || !Id) {
    return (
      <div className="error-message">
        <LoginError
          message="Access Denied"
          description={Id ? "Failed to load resources. Please try again." : "Please log in to create a quiz."}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="container-fluid text-white">
        <div id="EduQuizManager-Logo-row" className="row">
          <div
            id="EduQuizManager-Logo-col"
            className="col-6 d-flex justify-content-start align-items-center ps-4"
          >
            EDUCONNECT
          </div>
        </div>
      </div>
      <div id="quizmanager-main">
        <div className="quiz-manager">
          <h2 id="EduQuizManager-title" style={{ color: "#333" }}>
            Create Quiz
          </h2>
          <form onSubmit={handleQuizSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="text"
              placeholder="Quiz Title"
              value={quizData.title}
              onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
              required
              style={{ padding: "10px", borderRadius: "5px", background: "#ffffffaa", color: "#333", fontSize: "16px" }}
            />
            <textarea
              placeholder="Quiz Description"
              value={quizData.description}
              onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
              required
              style={{
                padding: "10px",
                borderRadius: "5px",
                background: "#ffffffaa",
                color: "#333",
                fontSize: "16px",
                resize: "none",
              }}
            />
            <select
              value={quizData.moduleId}
              onChange={handleModuleChange}
              required
              style={{ padding: "10px", borderRadius: "5px", background: "#ffffffaa", color: "#333", fontSize: "16px" }}
            >
              <option value="" disabled>
                Select Module
              </option>
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  Semester - {module.semester} : {module.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Semester"
              value={quizData.semester}
              readOnly
              style={{ padding: "10px", borderRadius: "5px", background: "#ffffffaa", color: "#333", fontSize: "16px" }}
            />

            {questions.map((question, index) => (
              <div key={index} className="question-block">
                <input
                  type="text"
                  placeholder="Question"
                  value={question.questionText}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].questionText = e.target.value;
                    setQuestions(newQuestions);
                  }}
                  style={{ padding: "10px", borderRadius: "5px", background: "#ffffffaa", color: "#333", fontSize: "16px" }}
                />
                {question.options.map((option, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                    value={option}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].options[optIndex] = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    style={{ padding: "10px", borderRadius: "5px", background: "#ffffffaa", color: "#333", fontSize: "16px" }}
                  />
                ))}
                <input
                  type="text"
                  placeholder="Correct Answer (A,B,C,D)"
                  value={question.correctAnswer}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].correctAnswer = e.target.value;
                    setQuestions(newQuestions);
                  }}
                  style={{ padding: "10px", borderRadius: "5px", background: "#ffffffaa", color: "#333", fontSize: "16px" }}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
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
              Add Question
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
                  Create Quiz
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <footer>
        <div className="container-fluid">
          <div id="EduQuizManager-footer-row" className="row">
            <div
              id="EduQuizManager-footer-col"
              className="col-12 d-flex flex-column justify-content-center align-items-center mt-4 mb-4"
            >
              © {new Date().getFullYear()} EDUConnect. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
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

export default QuizManager;