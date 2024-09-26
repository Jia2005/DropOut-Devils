import React, { useState } from 'react';
import './Quizpage.css';
import FormFolder from './ViewQP/FolderForm';
import QuizFormPage from '../../QuizStudent/QuizForm';
import UploadFile from './AnswerQP/UploadFile';

function Quizzes() {
  const [activeTab, setActiveTab] = useState('questionPapers');

  const renderContent = () => {
    switch (activeTab) {
      case 'questionPapers':
        return <FormFolder />;
      case 'mcqs':
        return <QuizFormPage />;
      case 'uploadAnswer':
        return <UploadFile />;
      default:
        return '';
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-tabs">
        <button
          className={`quiz-tab ${activeTab === 'questionPapers' ? 'active' : ''}`}
          onClick={() => setActiveTab('questionPapers')}
        >
          Question Papers
        </button>
        <button
          className={`quiz-tab ${activeTab === 'uploadAnswer' ? 'active' : ''}`}
          onClick={() => setActiveTab('uploadAnswer')}
        >
          Answer a Question Paper
        </button>
        <button
          className={`quiz-tab ${activeTab === 'mcqs' ? 'active' : ''}`}
          onClick={() => setActiveTab('mcqs')}
        >
          MCQs
        </button>
      </div>
      <div className="quiz-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default Quizzes;
