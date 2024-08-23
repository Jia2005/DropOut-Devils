import React from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Login';
import SignupPage from './Signup';
import FinancialForm from './financial-aid-form/form'
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './Pages/Auth/Signup';
import LoginPage from './Pages/Auth/Login';
import HomePage from './Pages/Home/Home';

>>>>>>> upstream/main
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
<<<<<<< HEAD
        <Route path="/financialform" element={<FinancialForm />} />
=======
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
>>>>>>> upstream/main
      </Routes>
    </Router>
  );
}

export default App;
