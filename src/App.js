import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Login';
import SignupPage from './Signup';
import FinancialForm from './financial-aid-form/FinancialForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/financial-form" element={<FinancialForm />} />
      </Routes>
    </Router>
  );
}

export default App;
