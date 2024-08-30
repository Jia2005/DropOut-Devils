import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion, addDoc, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './QuizForm.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

function QuizFormPage() {
  const [quizList, setQuizList] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [responses, setResponses] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);
  const [attemptedQuizzes, setAttemptedQuizzes] = useState({});
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserGrade(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const fetchUserGrade = async (user) => {
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          fetchQuizzes(userData.grade);
        }
      } catch (error) {
        console.error('Error fetching user grade:', error);
      }
    }
  };

  const fetchQuizzes = async (grade) => {
    try {
      const quizCollection = collection(db, 'quizzes');
      const q = query(quizCollection, where('grade', '==', grade));
      const quizSnapshot = await getDocs(q);
      const quizListData = quizSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.createdAt.toDate() - a.createdAt.toDate())); // Sort by creation date descending
      setQuizList(quizListData);

      // Fetch attempted quizzes with response timestamps
      const responsesCollection = collection(db, 'responses');
      const responsesQuery = query(responsesCollection, where('userId', '==', user.uid));
      const responsesSnapshot = await getDocs(responsesQuery);
      const attemptedData = {};
      responsesSnapshot.docs.forEach(doc => {
        const data = doc.data();
        attemptedData[data.quizId] = data.time.toDate();
      });
      setAttemptedQuizzes(attemptedData);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const fetchQuestions = async (quizId) => {
    try {
      const questionCollection = collection(db, 'questions');
      const questionSnapshot = await getDocs(query(questionCollection, where('quizId', '==', quizId)));
      
      const questionList = questionSnapshot.docs
        .map(doc => doc.data())
        .sort((a, b) => a.questionNumber - b.questionNumber);

      setQuestions(questionList);
      setResponses(new Array(questionList.length).fill(null)); // Initialize responses array
      setCorrectAnswers(questionList.map(q => q.correctOptionIndex));
      setSelectedQuiz(quizId);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleQuizSelection = (quizId) => {
    fetchQuestions(quizId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let calculatedScore = 0;

    responses.forEach((response, index) => {
      if (response === correctAnswers[index]) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
    setSubmitted(true);

    if (selectedQuiz && user) {
      try {
        const quizRef = doc(db, 'quizzes', selectedQuiz);
        await updateDoc(quizRef, {
          attemptedBy: arrayUnion(user.uid)
        });
        const responsesRef = collection(db, 'responses');
        await addDoc(responsesRef, {
          quizId: selectedQuiz,
          responses: responses,
          time: Timestamp.now(),
          userId: user.uid
        });
      } catch (error) {
        console.error('Error submitting quiz:', error);
      }
    }
  };

  const handleResponseChange = (questionIndex, optionIndex) => {
    const newResponses = [...responses];
    newResponses[questionIndex] = optionIndex;
    setResponses(newResponses);
  };

  const chartData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [{
      data: [score, questions.length - score],
      backgroundColor: ['#4caf50', '#f44336'],
      borderColor: ['#ffffff', '#ffffff'],
      borderWidth: 1,
    }],
  };

  const getQuizStatusStyle = (quiz) => {
    const currentDate = new Date();
    const submissionDeadline = new Date(`${quiz.submissionDate}T${quiz.submissionTime}:00`);
    const isAttempted = isQuizAttempted(quiz);
    const attemptedTime = attemptedQuizzes[quiz.id];
    let style = {};
    let comment = '';

    if (isAttempted) {
      if (attemptedTime > submissionDeadline) {
        style.backgroundColor = '#FFE0D2';
        style.borderLeft = '1.2vw solid #FF8900';
        comment = 'Deadline exceeded and attempted';
      } else {
        style.backgroundColor = '#C8E6C9';
        style.borderLeft = '1.2vw solid #4CAF50';
        comment = 'Submitted';
      }
    } else if (currentDate > submissionDeadline) {
      style.backgroundColor = '#FFCDD2';
      style.borderLeft = '1.2vw solid #F44336';
      comment = 'Deadline exceeded and not submitted';
    } else {
      style.backgroundColor = '#B3E5FC';
      style.borderLeft = '1.2vw solid #2196F3';
      comment = 'Not submitted';
    }

    return { style, comment };
  };

  const isQuizAttempted = (quiz) => {
    return quiz.attemptedBy && quiz.attemptedBy.includes(user.uid);
  };

  return (
    <div className="quiz-form-container">
      {!selectedQuiz && (
        <div className="quiz-selection">
          <h2>Select a Quiz</h2>
          <div className="quiz-grid">
            {quizList.map(quiz => {
              const { style, comment } = getQuizStatusStyle(quiz);
              return (
                <div
                  key={quiz.id}
                  className="quiz-item"
                  onClick={() => handleQuizSelection(quiz.id)}
                  style={style}
                >
                  <h3>{quiz.quizName}</h3><br />
                  <p>Subject: {quiz.subject}</p>
                  <p>Submission Date: {quiz.submissionDate}</p>
                  <p>Submission Time: {quiz.submissionTime}</p>
                  <p className='comment'>{comment}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {selectedQuiz && !submitted && (
        <form onSubmit={handleSubmit} className="questions-form">
          <div className="questions-grid">
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="question-block">
                <div className="form-group">
                  <label>{`Q${question.questionNumber}. ${question.question}`}</label>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className={`option-group ${responses[qIndex] === oIndex ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        id={`q${qIndex}o${oIndex}`}
                        name={`question${qIndex}`}
                        value={oIndex}
                        onChange={() => handleResponseChange(qIndex, oIndex)}
                        checked={responses[qIndex] === oIndex}
                      />
                      <label htmlFor={`q${qIndex}o${oIndex}`}>{option}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      )}

      {submitted && (
        <div className="submission-message">
          <h2>Thank you for submitting your responses!</h2>
          <p>Your score: {score} / {questions.length}</p>
          <Pie data={chartData} />
        </div>
      )}
    </div>
  );
}

export default QuizFormPage;
