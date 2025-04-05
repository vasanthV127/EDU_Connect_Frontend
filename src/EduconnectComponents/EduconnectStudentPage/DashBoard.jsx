import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { makeAuthenticatedRequest } from '../../services/auth.service';

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const semester = 1; // Assuming semester is stored in user object
        const data = await makeAuthenticatedRequest(`/api/quizzes/semester/${semester}`);
        setQuizzes(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch quizzes:', err);
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) return <div>Loading quizzes...</div>;

  return (
    <div>
      <h1>Your Quizzes</h1>
      {quizzes.map((quiz) => (
        <div key={quiz.id}>
          <h3>{quiz.title}</h3>
          <p>{quiz.description}</p>
          <Link to={`/quiz/${quiz.id}`}>Take Quiz</Link>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;