import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { makeAuthenticatedRequest } from '../../services/auth.service';

const ModuleDetail = () => {
  const { moduleId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await makeAuthenticatedRequest(`/api/quizzes/module/${moduleId}`);
        setQuizzes(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch quizzes:', err);
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [moduleId]);

  if (loading) return <div>Loading module quizzes...</div>;

  return (
    <div>
      <h1>Module Quizzes</h1>
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

export default ModuleDetail;