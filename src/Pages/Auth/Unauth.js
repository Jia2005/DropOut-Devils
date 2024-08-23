import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css'; 

function UnauthorizedPage() {
  return (
    <div className="auth-container">
      <h2>Unauthorized Access</h2>
      <p>You do not have permission to view this page. Please <Link to="/login">log in</Link> or <Link to="/signup">sign up</Link>.</p>
    </div>
  );
}

export default UnauthorizedPage;