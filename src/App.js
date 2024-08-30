import React, { useEffect, useState } from 'react';
import CreateQuizPage from './Pages/Quiz/Createquiz';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Form from './Pages/financial-aid-form/form';
import SignupPage from './Pages/Auth/Signup';
import LoginPage from './Pages/Auth/Login';
import HomePage from './Pages/Home/Home';
import QuizFormPage from './Pages/QuizStudent/QuizForm';
import TrackYourApplication from './Pages/financial-aid-form/trackYourApplication';
import { app } from './firebase';
import Main from './main';
import LP_Landing from './Pages/Learning_Platform/LP_Landing';
import SubjectList from './Pages/Learning_Platform/Video_Lectures.js/SubjectList';
import VideoList from './Pages/Learning_Platform/Video_Lectures.js/VideoList';
import VideoPlayer from './Pages/Learning_Platform/Video_Lectures.js/Video';
import Notes from './Pages/Learning_Platform/Notes/Notes';
import SubjectNotes from './Pages/Learning_Platform/Notes/SubjectNotes';
import FormFolder from './Pages/Learning_Platform/Quizzes/ViewQP/FolderForm';
import ListPdfs from './Pages/Learning_Platform/Quizzes/ViewQP/ListPdf';
import UploadFile from './Pages/Learning_Platform/Quizzes/AnswerQP/UploadFile';
import Quizzes from './Pages/Learning_Platform/Quizzes/Quizpage';
import Lander from './Pages/Lander/Lander';
import ProgressReport from './Pages/Lander/Components/ProgressReport/ProgressReport';
import ScheduleMeeting from './Pages/Lander/Components/ScheduleMeeting/ScheduleMeeting';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/form" element={<Form />} />
        <Route path="/trackYourApplication" element={<TrackYourApplication />} />
        <Route path="/signup" element={<SignupPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/quiz" element={<CreateQuizPage/>}/>
        <Route path="/studentquiz" element={<QuizFormPage/>}/>
        <Route path="/learnplatform" element={<LP_Landing/>}/>
        <Route path="/subjects" element={<SubjectList/>}/>
        <Route path="//list-images/:subjectFolder/:chapterFolder" element={<VideoList/>}/>
        <Route path="//play-video/:subjectFolder/:chapterFolder/:videoName" element={<VideoPlayer/>}/>
        <Route path="/note" element={<Notes/>}/>
        <Route path="/subjectnotes" element={<SubjectNotes/>}/>
        <Route path="/viewqp" element={<FormFolder/>}/>
        <Route path="/list-pdfs/:subjectFolder/:chapterFolder" element={<ListPdfs/>}/>
        <Route path="/uploadanswer" element={<UploadFile/>}/>
        <Route path="/quizsec" element={<Quizzes/>}/>
        <Route path="/lander" element={<Lander/>}/>
        <Route path="/ProgressReport" element={<ProgressReport/>}/>


      </Routes>
    </Router>
  );
}

export default App;