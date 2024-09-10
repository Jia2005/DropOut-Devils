import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion, setDoc, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './QuizForm.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { v1 } from 'uuid';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

function QuizForm() {
  const [quizList, setQuizList] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [responses, setResponses] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);
  const [attemptedQuizzes, setAttemptedQuizzes] = useState({});
  const [role, setRole] = useState('');
  const auth = getAuth();
   const [childDocId, setChildDocId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserDetails(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const fetchUserDetails = async (user) => {
    if (!user) {
      console.error('User not logged in');
      return;
    }
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setRole(userData.type); // 'type' field determines if the user is a parent or student
        fetchQuizzesAndResponses(userData, user);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchQuizzesAndResponses = async (userData, user) => {
    try {
      const quizCollection = collection(db, 'quizzes');
      let q;
      let childDocId = null;

      if (userData.type === 1) { // Student
        q = query(quizCollection, where('grade', '==', userData.grade));
      } else if (userData.type === 3) { // Parent
        const childDocRef = query(collection(db, 'users'), where('email', '==', userData.childEmail));
        const childDocSnapshot = await getDocs(childDocRef);
        if (!childDocSnapshot.empty) {
          const childData = childDocSnapshot.docs[0].data();
          childDocId = childDocSnapshot.docs[0].id;
          q = query(quizCollection, where('grade', '==', childData.grade));
        } else {
          console.error('Child data not found');
          return;
        }
      }

      const quizSnapshot = await getDocs(q);
      const quizListData = quizSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.createdAt.toDate() - a.createdAt.toDate())); // Sort by creation date descending

      setQuizList(quizListData);

      const responsesCollection = collection(db, 'responses');
      let responsesQuery;

      if (userData.type === 1) { // Student
        responsesQuery = query(responsesCollection, where('userId', '==', user.uid));
      } else if (userData.type === 3) { // Parent
        responsesQuery = query(responsesCollection, where('userId', '==', childDocId));
      }

      const responsesSnapshot = await getDocs(responsesQuery);
      const attemptedData = {};
      responsesSnapshot.docs.forEach(doc => {
        const data = doc.data();
        attemptedData[data.quizId] = data.time.toDate(); // Store attempted time
      });

      setAttemptedQuizzes(attemptedData);
    } catch (error) {
      console.error('Error fetching quizzes and responses:', error.message);
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
    const quiz = quizList.find(q => q.id === quizId);
    const { style } = getQuizStatusStyle(quiz);

    if (style.backgroundColor !== '#C8E6C9' && style.backgroundColor !== '#FFE0D2') {
      fetchQuestions(quizId);
    } else {
      alert('You have already submitted or attempted this quiz.');
    }
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
        const userId = role === 3 && childDocId ? childDocId : user.uid; // Use childDocId if the user is a parent
  
        await updateDoc(quizRef, {
          attemptedBy: arrayUnion(userId)
        });
  
        const responsesRef = doc(db, 'responses', v1());
  
        await setDoc(responsesRef, {
          quizId: selectedQuiz,
          selected: responses,
          time: Timestamp.now(),
          userId: userId
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
    const attemptedTime = attemptedQuizzes[quiz.id];
    let style = {};
    let comment = '';

    if (attemptedTime) {
      if (attemptedTime > submissionDeadline) {
        style.backgroundColor = '#FFE0D2'; // Orange
        style.borderLeft = '1.2vw solid #FF8900';
        comment = 'Deadline exceeded and attempted';
      } else {
        style.backgroundColor = '#C8E6C9'; // Light green
        style.borderLeft = '1.2vw solid #4CAF50';
        comment = 'Submitted';
      }
    } else if (currentDate > submissionDeadline) {
      style.backgroundColor = '#FFCDD2'; // Light red
      style.borderLeft = '1.2vw solid #F44336';
      comment = 'Deadline exceeded and not submitted';
    } else {
      style.backgroundColor = '#B3E5FC'; // Light blue
      style.borderLeft = '1.2vw solid #2196F3';
      comment = 'Not submitted';
    }

    return { style, comment };
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
                <div className="form-group-quiz">
                  <label style={{fontSize: '16px', fontWeight: 'bold'}}>
                    {question.questionNumber}. {question.question}
                  </label>
                  <div className="options option-group">
                    {question.options.map((option, oIndex) => (
                      <div className='quiz-option-radio'>
                        <input className='radio-quiz'
                          type="radio"
                          style={{height: '20px'}}
                          name={`question-${qIndex}`}
                          value={oIndex}
                          checked={responses[qIndex] === oIndex}
                          onChange={() => handleResponseChange(qIndex, oIndex)}
                          disabled={submitted}
                        />
                      <label style={{fontSize: '15px'}} className='option' key={oIndex}>
                        {option}
                      </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button type="submit" disabled={submitted} className="submit-button">
            Submit Quiz
          </button>
        </form>
      )}

      {submitted && (
        <div className="submission-message">
          <h2>Thank you for submitting your responses</h2>
          <p class>You scored {score}/{questions.length}.</p>
          <div className="pie-chart-container">
          <Pie style={{height: '280px'}} data={chartData} /></div>
          <div className="correct-answers ">
            <h3>Correct Answers:</h3><br />
            {questions.map((question, qIndex) => (
              <div key={qIndex} style={{marginTop:'8px'}}>
                <strong>{question.questionNumber}. {question.question}</strong><br /><br />
                Correct Answer: {question.options[question.correctOptionIndex]}
                <br />
                Your Answer: {question.options[responses[qIndex]]}
                <br /><br />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizForm;
