import React, { useEffect, useState } from 'react';
import CreateQuizPage from './Pages/Quiz/Createquiz';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Form from './Pages/financial-aid-form/form';
import LoginPage from './Pages/Auth/Login';
import SignupPage from './Pages/Auth/Signup';
import HomePage from './Pages/Home/Home';
import QuizFormPage from './Pages/QuizStudent/QuizForm';
import TrackYourApplication from './Pages/financial-aid-form/trackYourApplication';
import FundsDisbursement from './Pages/financial-aid-form/FundsDisbursement';
import ApplicationReviewPage from './Pages/financial-aid-form/ApplicationReviewPage';
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
import EnterMeet from './Pages/Learning_Platform/Meetings/EnterMeet';
import Room from './Pages/Learning_Platform/Meetings/Room';
import TeacherLanding from './Pages/Learning_Platform/TeacherSection/TeacherLanding';
import CreateLecture from './Pages/Learning_Platform/TeacherSection/CreateLecture';
import UploadRef from './Pages/Learning_Platform/TeacherSection/UploadRef';
import UploadQP from './Pages/Learning_Platform/TeacherSection/UploadQP';
import Getanspdf from './Pages/Learning_Platform/TeacherSection/Getanspdf';
import AdminSign from './Pages/Auth/AdminSign';
import UserProfile from './Pages/Profile/Profile';
import ProgressReport from './Pages/Lander/Components/ProgressReport/ProgressReport';
import ScheduleMeeting from './Pages/Lander/Components/ScheduleMeeting/ScheduleMeeting';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/form" element={<Form />} />
        <Route path="/trackYourApplication" element={<TrackYourApplication />} />
        <Route path="/Funds" element={<FundsDisbursement />} />
        <Route path="/applicationReview" element={<ApplicationReviewPage />} />
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/adminsign' element={<AdminSign/>}/>
        <Route path='/profile' element={<UserProfile/>}/>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/quiz" element={<CreateQuizPage/>}/>
        <Route path="/studentquiz" element={<QuizFormPage/>}/>
        <Route path="/learnplatform" element={<LP_Landing/>}/>
        <Route path="/subjects" element={<SubjectList/>}/>
        <Route path="/list-images/:classFolder/:subjectFolder/:chapterFolder" element={<VideoList />} />
        <Route path="/play-video/:classFolder/:subjectFolder/:chapterFolder/:videoName" element={<VideoPlayer />} />
        <Route path="/note" element={<Notes/>}/>
        <Route path="/subjectnotes/:classFolder/:subjectFolder/:chapterFolder" element={<SubjectNotes />} />
        <Route path="/viewqp" element={<FormFolder/>}/>
        <Route path="/list-pdfs/:classFolder" element={<ListPdfs/>}/>
        <Route path="/uploadanswer" element={<UploadFile/>}/>
        <Route path="/quizsec" element={<Quizzes/>}/>
        <Route path="/entermeet" element={<EnterMeet/>}/>
        <Route path="/room/:roomID" element={<Room/>}/>
        <Route path="/teacherlanding" element={<TeacherLanding/>}/>
        <Route path="/createlecture" element={<CreateLecture/>}/>
        <Route path="/uploadref" element={<UploadRef/>}/>
        <Route path="/uploadqp" element={<UploadQP/>}/>
        <Route path="/getanspdf" element={<Getanspdf/>}/>
        <Route path="/progressreport" element={<ProgressReport/>}/>
        <Route path="/schedulemeeting" element={<ScheduleMeeting/>}/>
      </Routes>
    </Router>
  );
}

export default App;