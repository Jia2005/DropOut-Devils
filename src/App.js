import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Login';
import SignupPage from './Signup';
import FinancialForm from './financial-aid-form/form'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/financialform" element={<FinancialForm />} />
      </Routes>
    </Router>
  );
}

export default App;
