import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { addDoc, Timestamp } from 'firebase/firestore';
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
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        fetchQuizzes(userData.grade);
      }
    }
  };

  const fetchQuizzes = async (grade) => {
    const quizCollection = collection(db, 'quizzes');
    const q = query(quizCollection, where('grade', '==', grade));
    const quizSnapshot = await getDocs(q);
    const quizListData = quizSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setQuizList(quizListData);
  };

  const fetchQuestions = async (quizId) => {
    const questionCollection = collection(db, 'questions');
    const questionSnapshot = await getDocs(questionCollection);
    
    // Filter questions based on quizId and sort them by questionNumber in ascending order
    const questionList = questionSnapshot.docs
      .filter(doc => doc.data().quizId === quizId)
      .map(doc => doc.data())
      .sort((a, b) => a.questionNumber - b.questionNumber);
  
    setQuestions(questionList);
    setCorrectAnswers(questionList.map(q => q.correctOptionIndex));
    setSelectedQuiz(quizId);
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

  return (
    <div className="quiz-form-container">
      {!selectedQuiz && (
        <div className="quiz-selection">
          <h2>Select a Quiz</h2>
          {quizList.map(quiz => (
            <div key={quiz.id} className="quiz-item" onClick={() => handleQuizSelection(quiz.id)}>
              <h3>{quiz.quizName}</h3>
              <p>Subject: {quiz.subject}</p>
              <p>Submission Date: {quiz.submissionDate}</p>
            </div>
          ))}
        </div>
      )}
      
      {selectedQuiz && !submitted && (
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      )}

      {submitted && (
        <div className="submission-message">
          <h2>Thank you for submitting your responses!</h2>
          <p>Your score: {score} / {questions.length}</p>
          <div className="pie-chart-container">
            <Pie data={chartData} />
          </div>
          <h3>Correct Answers:</h3>
          {questions.map((question, index) => (
            <div key={index} className="question-block">
              <div className="form-group">
                <label>{`Q${question.questionNumber}. ${question.question}`}</label>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} 
                       className={`option-group ${responses[index] === oIndex ? 'selected' : ''} ${correctAnswers[index] === oIndex ? 'correct' : ''}`}>
                    <input
                      type="radio"
                      id={`q${index}o${oIndex}`}
                      name={`question${index}`}
                      value={oIndex}
                      disabled
                      checked={responses[index] === oIndex}
                    />
                    <label htmlFor={`q${index}o${oIndex}`}>{option}</label>
                    {correctAnswers[index] === oIndex && <span className="correct-tick">✔️</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuizFormPage;

