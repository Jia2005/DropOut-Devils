import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Form from './Pages/financial-aid-form/form';
import SignupPage from './Pages/Auth/Signup';
import LoginPage from './Pages/Auth/Login';
import HomePage from './Pages/Home/Home';
import TrackYourApplication from './Pages/financial-aid-form/trackYourApplication';
import {app} from './firebase';
import UnauthorizedPage from './Pages/Auth/Unauth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import Main from './main';

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
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
    </Router>
  );
}

export default App;