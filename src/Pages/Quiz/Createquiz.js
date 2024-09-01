import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './Createquiz.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { doc, setDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore'; 
function CreateQuizPage() {
  const [quizName, setQuizName] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [questions, setQuestions] = useState([]);
  const [submissionDate, setSubmissionDate] = useState('');
  const [submissionTime, setSubmissionTime] = useState('');
  const handleDeleteQuestion = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions.splice(questionIndex, 1);
    setQuestions(newQuestions);
  };
  const handleDeleteOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: [], correctAnswer: '' },
    ]);
  };
  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };
  const handleAddOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push('');
    setQuestions(newQuestions);
  };
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };
  const handleCorrectAnswerChange = (questionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctAnswer = value;
    setQuestions(newQuestions);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const quizDocRef = doc(collection(db, 'quizzes'));
      const quizId = quizDocRef.id;
      await setDoc(quizDocRef, {
        quizId: quizId,
        quizName,
        subject,
        grade,
        submissionDate,
        submissionTime,
        createdAt: Timestamp.now(), // Add createdAt field with current timestamp
        attemptedBy: [] // Initialize an empty array for storing attempted students' IDs
      });
  
      // Add each question with the associated quizId and question number
      await Promise.all(
        questions.map(async (question, qIndex) => {
          const correctAnswerIndex = question.options.indexOf(question.correctAnswer);

          await addDoc(collection(db, 'questions'), {
            quizId: quizId,
            questionNumber: qIndex + 1, // Store question number here
            question: question.question,
            options: question.options,
            correctOptionIndex: correctAnswerIndex,
          });
        })
      );

      window.alert('Quiz submitted successfully!');

      setQuizName('');
      setSubject('');
      setGrade('');
      setQuestions([]);
      setSubmissionDate('');
      setSubmissionTime('');
    } catch (error) {
      console.error('Error adding quiz and questions: ', error);
      window.alert('Error occurred while submitting the quiz.');
    }
  };
  return (
    <div className="create-quiz-container">
      <h2 style={{fontSize:'40px'}}>Create Quiz</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Quiz Name:</label>
          <input
            style={{ width:'100%' }}
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Subject Name:</label>
          <input
            style={{ width:'100%' }}
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Grade:</label>
          <input
            style={{ width:'100%' }}
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
          />
        </div>
        <div className="question-group">
          <h3 className='heading'>Questions</h3><br></br>
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="question-block">
              <div className="form-group-2">
                <h4>Question:</h4>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="delete-icon"
                  onClick={() => handleDeleteQuestion(qIndex)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="option-group2">
                  <label style={{fontSize:'14px', fontWeight:'bold'}}>Option {oIndex + 1}:</label>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(qIndex, oIndex, e.target.value)
                    }
                    required
                  />
                  <button
                    type="button"
                    className="delete-icon"
                    onClick={() => handleDeleteOption(qIndex, oIndex)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="add-button"
                onClick={() => handleAddOption(qIndex)}
              >
                Add Option
              </button><br></br><br></br>
              <div className="form-group" style={{ width:'85%' }}>
                <label>Correct Answer:</label>
                <select
                  value={question.correctAnswer}
                  onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                  required
                >
                  <option value="">Select correct answer</option>
                  {question.options.map((option, oIndex) => (
                    <option key={oIndex} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          <button type="button" className="add-button" onClick={handleAddQuestion}>
            Add Question
          </button>
        </div>
        <div className="form-group-2">
          <label style={{fontSize:'16px', fontWeight:'bold'}}>Quiz should be submitted by:</label>
          <input
            style={{ width:'100%' }}
            type="date"
            value={submissionDate}
            onChange={(e) => setSubmissionDate(e.target.value)}
            required
          />
          <input
            style={{ width:'100%' }}
            type="time"
            value={submissionTime}
            onChange={(e) => setSubmissionTime(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button2">
          Upload Quiz
        </button>
      </form>
    </div>
  );
}
export default CreateQuizPage;