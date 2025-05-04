import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { makeAuthenticatedRequest } from '../../services/auth.service';
import './AttendQuiz.css';
import Notification from './Notification';
import EduconnectSidebar from './EduconnectSidebar';

const AttendQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizData = await makeAuthenticatedRequest(`/api/quizzes/${quizId}`);
        setQuiz(quizData);

        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          const submissionCheck = await makeAuthenticatedRequest(`/api/quizzes/${quizId}/submit?userId=${user.id}`);
          if (submissionCheck) {
            setSubmissionStatus(`You already submitted this quiz! Your score: ${submissionCheck.score}/${quizData.questions.length}`);
          }
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load quiz. Please ensure you are logged in and try again.');
        setLoading(false);
        showNotification('Error', 'Failed to load quiz', 'error');
      }
    };
    fetchQuiz();
  }, [quizId]);

  const showNotification = (title, description, type) => {
    setNotification({ title, description, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
      showNotification('Error', 'Please log in to submit the quiz', 'error');
      setSubmissionStatus('Please log in to submit the quiz.');
      return;
    }

    try {
      const submission = {
        quizId: parseInt(quizId),
        submittedById: parseInt(user.id),
        answers: answers,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_Backend_API_URL}/api/quizzes/${quizId}/submit`,
        submission,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSubmissionStatus(`Quiz submitted successfully! Your score: ${response.data.score}/${quiz.questions.length}`);
      setAnswers({});
      showNotification('Success', `Quiz submitted! Score: ${response.data.score}/${quiz.questions.length}`, 'success');
    } catch (err) {
      const errorMessage = err.response?.data || 'Failed to submit quiz. Please try again.';
      setSubmissionStatus(errorMessage);
      showNotification('Error', errorMessage, 'error');
    }
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div id="QuizLoadingContainer">
        <div id="QuizLoading">Loading quiz...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="QuizErrorMessage">
        <div id="QuizError">{error}</div>
      </div>
    );
  }

  if (!quiz) {
    return <div id="QuizNoQuiz">No quiz found.</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div id="QuizContainer">
      <div id="EduQuiz-Logo-row" className="container-fluid text-white">
        <div id="EduQuiz-Logo-col" className="col-6 d-flex justify-content-start align-items-center ps-4">
          EDUCONNECT
        </div>
      </div>

      <div id="QuizCard-main" className="container-fluid">
        <div id="QuizContentWrapper" className="row">
          <div id="QuizContent" className="col-12 d-flex flex-column align-items-center">
            <h1 id="EducQuiz-Title">{quiz.title}</h1>
            <p id="EducQuiz-Description">{quiz.description}</p>
            {submissionStatus ? (
              <div id="QuizSubmissionResult" style={{ animation: 'fadeIn 0.5s ease-out forwards' }}>
                <p>{submissionStatus}</p>
                <button
                  id="QuizHomeBtn"
                  onClick={handleGoToHome}
                >
                  Go to Home
                </button>
              </div>
            ) : (
              <form id="QuizForm" onSubmit={handleSubmit}>
                <div id="QuizQuestionContainer" style={{ animation: 'fadeIn 0.5s ease-out forwards' }}>
                  <h3 id="QuizQuestionText">{currentQuestion.questionText}</h3>
                  <div id="QuizOptions">
                    {['A', 'B', 'C', 'D'].map((option) => (
                      <label
                        key={option}
                        id={`QuizOptionLabel-${currentQuestion.id}-${option}`}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value={option}
                          checked={answers[currentQuestion.id] === option}
                          onChange={() => handleAnswerChange(currentQuestion.id, option)}
                        />
                        <span id={`QuizOptionText-${currentQuestion.id}-${option}`}>
                          {currentQuestion[`option${option}`]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div id="QuizNavigation">
                  <button
                    type="button"
                    id="QuizPrevBtn"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </button>
                  {currentQuestionIndex < quiz.questions.length - 1 ? (
                    <button
                      type="button"
                      id="QuizNextBtn"
                      onClick={handleNext}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      id="QuizSubmitBtn"
                      disabled={Object.keys(answers).length === 0}
                    >
                      Submit Quiz
                    </button>
                  )}
                </div>
                <div id="QuizProgress">
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      {notification && (
        <Notification
          title={notification.title}
          description={notification.description}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      <footer>
        <div id="EduQuiz-footer-row" className="container-fluid">
          <div id="EduQuiz-footer-col" className="col-12 d-flex flex-column justify-content-center align-items-center mt-4 mb-4">
            © {new Date().getFullYear()} EDUConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AttendQuiz;