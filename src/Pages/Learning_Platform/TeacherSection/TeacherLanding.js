import React, { useState } from 'react';
import './TeacherLanding.css';
import CreateLecture from './CreateLecture';
import UploadRef from './UploadRef';
import EnterMeet from '../Meetings/EnterMeet';
import UploadPdf from './UploadQP';
import Getanspdf from './Getanspdf';

function TeacherLanding() {
  const [activeTab, setActiveTab] = useState('createLecture');

  const renderContent = () => {
    switch (activeTab) {
      case 'createLecture':
        return <CreateLecture />;
      case 'uploadRef':
        return <UploadRef />;
      case 'uploadQP':
        return <UploadPdf />;
      case 'enterMeet':
        return <EnterMeet />;
      case 'getAnsPdf':
        return <Getanspdf />;
      default:
        return <CreateLecture />;
    }
  };

  return (
    <div className="teacher-landing-container">
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'createLecture' ? 'active' : ''}`}
          onClick={() => setActiveTab('createLecture')}
        >
          Add a Lecture/Review Lecture
        </button>
        <button
          className={`tab ${activeTab === 'uploadRef' ? 'active' : ''}`}
          onClick={() => setActiveTab('uploadRef')}
        >
          Add a Reference Book
        </button>
        <button
          className={`tab ${activeTab === 'uploadQP' ? 'active' : ''}`}
          onClick={() => setActiveTab('uploadQP')}
        >
          Add a Question Paper
        </button>
        <button
          className={`tab ${activeTab === 'enterMeet' ? 'active' : ''}`}
          onClick={() => setActiveTab('enterMeet')}
        >
          Enter a Class
        </button>
        <button
          className={`tab ${activeTab === 'getAnsPdf' ? 'active' : ''}`}
          onClick={() => setActiveTab('getAnsPdf')}
        >
          Download Answer Sheets
        </button>
      </div>
      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
}

export default TeacherLanding;
