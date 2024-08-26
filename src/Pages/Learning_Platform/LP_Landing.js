import React from 'react';
import './LP_Landing.css'
import { Link } from 'react-router-dom';

function LP_Landing() {
  return (
 
      
  <div className="body">
    <nav className="Navbar">
      <h1 className="welcome">Welcome to the learning platform</h1>
    </nav>
    <div className='Panel'>

    <Link to="/subjects">
      <h3>
        Video Lectures
      </h3>
      </Link>
      <Link to='/note'>
      <h3>
        Notes
      </h3>
      </Link>

      <Link to ="/quizsec">
      <h3>
        Quizzes
      </h3>
      </Link>

      <Link to ="#">
      <h3>
        Meetings
      </h3>  
      </Link>  
    </div>

    
      
      

  </div>
  
  
  
  )
}

export default LP_Landing;
