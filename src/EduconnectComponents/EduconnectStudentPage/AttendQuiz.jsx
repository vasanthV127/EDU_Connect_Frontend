import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { makeAuthenticatedRequest } from '../../services/auth.service';
import './AttendQuiz.css';
import EduconnectSidebar from './EduconnectSidebar';

const AttendQuiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = (e) => {
    e.preventDefault(); // Prevent form submission
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = (e) => {
    e.preventDefault(); // Prevent form submission
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
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
        `${import.meta.env.VITE_Backend_API_URL
      }/api/quizzes/${quizId}/submit`,
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
    } catch (err) {
      setSubmissionStatus(err.response?.data || 'Failed to submit quiz. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading quiz...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!quiz) return <div className="no-quiz">No quiz found.</div>;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div>
     
      
    <div className="attend-quiz-container">
      <h1 className="quiz-title">{quiz.title}</h1>
      <p className="quiz-description">{quiz.description}</p>
      {submissionStatus ? (
        <div className="submission-result animate-fade-in">
          <p>{submissionStatus}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="question-container animate-slide-in">
            <h3 className="question-text">{currentQuestion.questionText}</h3>
            <div className="options">
              {['A', 'B', 'C', 'D'].map((option) => (
                <label key={option} className="option-label">
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={() => handleAnswerChange(currentQuestion.id, option)}
                  />
                  <span className="option-text">{currentQuestion[`option${option}`]}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="navigation">
            <button
              type="button"
              className="nav-btn prev-btn"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <button
                type="button"
                className="nav-btn next-btn"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="submit-btn"
                disabled={Object.keys(answers).length === 0}
              >
                Submit Quiz
              </button>
            )}
          </div>
          <div className="progress">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </div>
        </form>
      )}
    </div>
    </div>
  );
};

export default AttendQuiz;