import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Form from './Pages/financial-aid-form/form';
import SignupPage from './Pages/Auth/Signup';
import LoginPage from './Pages/Auth/Login';
import HomePage from './Pages/Home/Home';
import UnauthorizedPage from './Pages/Auth/Unauth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/form" element={<Form />} />
        <Route path="/signup" element={<AuthRedirect Component={SignupPage} />} />
        <Route path="/login" element={<AuthRedirect Component={LoginPage} />} />
        <Route path="/home" element={<PrivateRoute Component={HomePage} />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
    </Router>
  );
}

function PrivateRoute({ Component }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate('/unauthorized');
      }
    });
    return unsubscribe;
  }, [auth, navigate]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return <Component />;
}

function AuthRedirect({ Component }) {
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/home');
      }
    });
    return unsubscribe;
  }, [auth, navigate]);

  return <Component />;
}

export default App;
