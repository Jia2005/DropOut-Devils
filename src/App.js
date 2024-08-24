import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Form from './Pages/financial-aid-form/form';
import SignupPage from './Pages/Auth/Signup';
import LoginPage from './Pages/Auth/Login';
import HomePage from './Pages/Home/Home';
<<<<<<< HEAD
import TrackYourApplication from './Pages/financial-aid-form/trackYourApplication';
import {app} from './firebase';
=======
import UnauthorizedPage from './Pages/Auth/Unauth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase';
import Main from './main';
>>>>>>> 24a59cdcd7fe34fc2b4c9e5e84d1be4e1ae7a448

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Main />} />
        <Route path="/form" element={<Form />} />
<<<<<<< HEAD
        <Route path="/trackYourApplication" element={<TrackYourApplication />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
=======
        <Route path="/signup" element={<SignupPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
>>>>>>> 24a59cdcd7fe34fc2b4c9e5e84d1be4e1ae7a448
      </Routes>
    </Router>
  );
}

export default App;