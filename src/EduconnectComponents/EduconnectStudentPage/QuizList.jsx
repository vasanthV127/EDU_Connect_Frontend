import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeAuthenticatedRequest } from "../../services/auth.service"; // Adjust path as needed
import "./QuizList.css"; // Optional: Add styling

import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Loader from "../EduconnectLoginPage/Loader";

import LoginError from "../EduconnectLoginPage/LoginError";
const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const semester = user?.semester || 2; // Default to semester 1 if not available
        const response = await makeAuthenticatedRequest(
          `/api/quizzes/semester/${semester}`
        );
        setQuizzes(response);
        setLoading(false);
      } catch (err) {
        setError("Failed to load quizzes. Please try again.");
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <LoginError message="Download failed" description="Please Try Again" />
      </div>
    );
  }
  if (quizzes.length === 0)
    return <div id="EduQuiz-forNoQuiz">No quizzes available for this semester.</div>;

  return (
    <div>
      {/* Header-Quizlist */}
      <div className="container-fluid text-white">
        <div id="EduQuizlist-Logo-row" className="row">
          <div
            id="EduQuizlist-Logo-col"
            className="col-6 d-flex justify-content-start align-items-center ps-4"
          >
            EDUCONNECT
          </div>
        </div>
      </div>
      {/* Quizlist-Body-Main */}
      <div id="Quizlist-Body-Main" className="container-fluid">
        <div id="EduQuizlist-body-main-row" className="row">
          <div id="EduQuizlist-body-main-col" className="col">
            <Typography
              id="EduQuizlist-body-submain-aq-title"
              sx={{
                color: "#ffffff",
                marginBottom: "2rem",
                paddingTop: "2rem",
                textAlign: "center",
              }}
            >
              Available Quizzes
            </Typography>
            <div className="container-fluid">
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="col">
                    <Card
                    id="EduQuizlist-Each-Card"
                      variant="outlined"
                      sx={{
                        backgroundColor: "#1a1a1a",
                        borderColor: "#333333",
                        "&:hover": {
                          backgroundColor: "#242424",
                          borderColor: "#444444",
                        },
                        height: "100%", // Ensures cards stretch to equal height
                      }}
                    >
                      <CardContent>
                        <Typography
                          level="title-md"
                          id="EduQuizlist-body-submain-quiz-title"
                          sx={{
                            color: "#ffffff",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {quiz.title}
                        </Typography>
                        <Typography
                          level="body-sm"
                          id="EduQuizlist-body-submain-quiz-description"
                          sx={{
                            color: "#cccccc",
                            minHeight: "40px",
                          }}
                        >
                          {quiz.description || "No description available"}
                        </Typography>
                      </CardContent>
                      <CardOverflow
                        variant="soft"
                        sx={{
                          bgcolor: "#2d2d2d",
                          borderTop: "1px solid #333333",
                        }}
                      >
                        <CardContent orientation="horizontal">
                          <Button
                          id="EduQuizlist-body-submain-button"
                            component={Link}
                            to={`/quiz/${quiz.id}`}
                            variant="solid"
                            size="sm"
                            sx={{
                              backgroundColor: "#ffffff",
                              color: "#000000",
                              "&:hover": {
                                backgroundColor: "#f0f0f0",
                              },
                              margin: "0.5rem",
                              width: "100%", // Makes button full width
                            }}
                          >
                            Take Quiz
                          </Button>
                        </CardContent>
                      </CardOverflow>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="quiz-list-container">
        <h1>Available Quizzes</h1>
        <div className="quiz-list">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-item">
              <h3>{quiz.title}</h3>
              <p>{quiz.description || "No description available"}</p>
              <Link to={`/quiz/${quiz.id}`} className="take-quiz-btn">
                Take Quiz
              </Link>
            </div>
          ))}
        </div>
      </div> */}

      {/* Footer-Quizlist */}
      <footer>
        <div className="container-fluid">
          <div id="EduQuizlist-footer-row" className="row">
            <div
              id="EduQuizlist-footer-col"
              className="col-12 d-flex flex-column justify-content-center align-items-center mt-4 mb-4"
            >
              © {new Date().getFullYear()} EDUConnect. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QuizList;
