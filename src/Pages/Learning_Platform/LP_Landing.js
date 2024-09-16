import React, { useState } from 'react';
import './LP_Landing.css';
import Notes from './Notes/Notes';
import Quizzes from './Quizzes/Quizpage';
import SubjectList from './Video_Lectures/SubjectList';
import EnterMeet from './Meetings/EnterMeet';
import VideoList from './Video_Lectures/VideoList';

function LP_Landing() {
  const [activeTab, setActiveTab] = useState('videoLectures');

  const renderContent = () => {
    switch (activeTab) {
      case 'videoLectures':
        return <VideoList />;
      case 'notes':
        return <Notes />;
      case 'quizzes':
        return <Quizzes />;
      case 'meetings':
        return <EnterMeet />;
      default:
        return <SubjectList />;
    }
  };

  return (
    <div className="container-card-student">
      <div className="card-container"> {/* Wrap content in card container */}
        <div className="tabs">
          <button
            className={`tab2 ${activeTab === 'videoLectures' ? 'active' : ''}`}
            onClick={() => setActiveTab('videoLectures')}
          >
            Video Lectures
          </button>
          <button
            className={`tab2 ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            Notes
          </button>
          <button
            className={`tab2 ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quizzes')}
          >
            Quizzes
          </button>
          <button
            className={`tab2 ${activeTab === 'meetings' ? 'active' : ''}`}
            onClick={() => setActiveTab('meetings')}
          >
            Meetings
          </button>
        </div>
        <div className="content2">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default LP_Landing;
