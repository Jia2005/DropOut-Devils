import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import './QuizForm.css';

function QuizFormPage() {
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [quizId, setQuizId] = useState('');
  const [quizGrade, setQuizGrade] = useState('');
  const [questions, setQuestions] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [responses, setResponses] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (quizGrade) {
      const fetchQuizzes = async () => {
        const quizCollection = collection(db, 'quizzes');
        const q = query(quizCollection, where('grade', '==', quizGrade));
        const quizSnapshot = await getDocs(q);
        const quizList = quizSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (quizList.length > 0) {
          const selectedQuiz = quizList[0];
          setQuizId(selectedQuiz.id);
          fetchQuestions(selectedQuiz.id);
        }
      };

      const fetchQuestions = async (quizId) => {
        const questionCollection = collection(db, 'questions');
        const questionSnapshot = await getDocs(questionCollection);
        const questionList = questionSnapshot.docs
          .filter(doc => doc.data().quizId === quizId)
          .map(doc => doc.data());

        setQuestions(questionList);
        setCorrectAnswers(questionList.map(q => q.correctAnswer)); // Ensure 'correctAnswer' is the index of the correct option
      };

      fetchQuizzes();
    }
  }, [quizGrade]);

  const handleStudentDetailsSubmit = (e) => {
    e.preventDefault();

    if (studentClass) {
      setQuizGrade(studentClass);
      setShowQuiz(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let calculatedScore = 0;
  
    responses.forEach((response, index) => {
      console.log(`Question ${index + 1}:`);
      console.log(`User's Response: ${response}`);
      console.log(`Correct Answer Index: ${correctAnswers[index]}`);
      console.log(`Correct Option: ${questions[index].options[correctAnswers[index]]}`);
      if (response === correctAnswers[index]) {
        calculatedScore += 1;
      } else {
        console.log("Incorrect Answer");
      }
    });
  
    console.log("Final Score: ", calculatedScore);
    setScore(calculatedScore);
    setSubmitted(true);
  };
  
  const handleResponseChange = (questionIndex, optionIndex) => {
    const newResponses = [...responses];
    newResponses[questionIndex] = optionIndex;
    setResponses(newResponses);
  };

  return (
    <div className="quiz-form-container">
      {!showQuiz ? (
        <form onSubmit={handleStudentDetailsSubmit}>
          <div className="form-group">
            <label>Student Name:</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Class:</label>
            <input
              type="text"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Proceed to Quiz
          </button>
        </form>
      ) : (
        !submitted ? (
          <form onSubmit={handleSubmit}>
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="question-block">
                <div className="form-group">
                  <label>{question.question}</label>
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
        ) : (
          <div className="submission-message">
            <h2>Thank you for submitting your responses!</h2>
            <p>Your score: {score} / {questions.length}</p>
            <h3>Correct Answers:</h3>
            {questions.map((question, index) => (
              <div key={index} className="question-block">
                <div className="form-group">
                  <label>{question.question}</label>
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
        )
      )}
    </div>
  );
}

export default QuizFormPage;
