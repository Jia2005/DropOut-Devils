import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Form from './Pages/financial-aid-form/form';
import SignupPage from './Pages/Auth/Signup';
import LoginPage from './Pages/Auth/Login';
import HomePage from './Pages/Home/Home';
import app from './firebase';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/form" element={<Form />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
