import React, { useState } from 'react';
import './Createquiz.css';

function CreateQuizPage() {
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [questions, setQuestions] = useState([]);

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

  const handleCorrectAnswerChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].correctAnswer = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ subject, grade, questions });
  };

  return (
    <div className="create-quiz-container">
      <h2>Create Quiz</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Subject Name:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Grade:</label>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
          />
        </div>
        <div className="question-group">
          <h3>Questions:</h3><br></br>
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="question-block">
              <div className="form-group">
                <label>Question:</label>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  required
                />
              </div>
              <button
                type="button"
                className="add-button"
                onClick={() => handleAddOption(qIndex)}
              >
                Add Option
              </button><br></br><br></br>
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="option-group">
                  <label>Option {oIndex + 1}:</label>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(qIndex, oIndex, e.target.value)
                    }
                    required
                  />
                </div>
              ))}
              <div className="form-group">
                <label>Correct Answer:</label>
                <input
                  type="text"
                  value={question.correctAnswer}
                  onChange={(e) =>
                    handleCorrectAnswerChange(qIndex, e.target.value)
                  }
                  required
                />
              </div>
            </div>
          ))}
          <button type="button" className="add-button" onClick={handleAddQuestion}>
            Add Question
          </button>
        </div>
        <button type="submit" className="submit-button">
          Upload Quiz
        </button>
      </form>
    </div>
  );
}

export default CreateQuizPage;
