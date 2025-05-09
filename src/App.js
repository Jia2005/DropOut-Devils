import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Form from './Pages/financial-aid-form/form';
import LoginPage from './Pages/Auth/Login';
import SignupPage from './Pages/Auth/Signup';
import HomePage from './Pages/Home/Home';
import { app } from './firebase';
import Main from './main';
import AdminSign from './Pages/Auth/AdminSign';
import UserProfile from './Pages/Profile/Profile';
import LandingPage from './Pages/LandingPage/LandingPage';
import Notifications from './Pages/Lander/Components/Navbar/Notifications';
import VideoPlayer from './Pages/Learning_Platform/Video_Lectures/Video';
import Room from './Pages/Learning_Platform/Meetings/Room'
import UploadForm from './Pages/Learning_Platform/Video_Lectures/UploadForm';
import VideoList from './Pages/Learning_Platform/Video_Lectures/VideoList';
import CommunityForum from './Pages/Community/CommunityForum';
import Predict from './Pages/Flask_Integration/Predict';
import Timetable from './Pages/TimeTable/timetable';
import Drop from './Pages/DropOut/Drop';
import ParentDetail from './Pages/Parent-Detail/ParentDetail';

function App() {

  const [component, setComponent] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/form" element={<Form />} />
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/upload' element={<UploadForm />}/>
        <Route path='/signup' element={<SignupPage />}/>
        <Route path='/adminsign' element={<AdminSign/>}/>
        <Route path='/profile' element={<UserProfile setComponent={setComponent}/>}/>
        <Route path="/home" element={<HomePage component={component} setComponent={setComponent}/>}/>
        <Route path="/lander" element={<LandingPage/>}/>
        <Route path="/predict" element={<Predict/>}/>
        <Route path="/notifications" element={<Notifications/>}></Route>
        <Route path="/room/:roomID" element={<Room />} />
        <Route path="/videos" element={<VideoList />} />
        <Route path="/comm" element={<CommunityForum />} />
        <Route path="/play-video/:videoId" element={<VideoPlayer />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="drop" element={<Drop />} />
        <Route path="/parentdetail" element={<ParentDetail/>} />
      </Routes>
    </Router>
  );
}

export default App;