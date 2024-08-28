import React from 'react';
import './TeacherLanding.css'
import { Link } from 'react-router-dom';

function TeacherLanding() {
  return (
 
      
  <div className="body">
    <nav className="Navbar">
      <h1 className="welcome">Welcome to the learning platform</h1>
    </nav>
    <div className='Panel'>

    <Link to="/createlecture">
      <h3>
        Add a lecture/ review lecture
      </h3>
      </Link>
      <Link to='/uploadref'>
      <h3>
        Add a refrence book
      </h3>
      </Link>

      <Link to ="/uploadqp">
      <h3>
        Add a question paper
      </h3>
      </Link>

      <Link to ="/entermeet">
      <h3>
        Enter a class
      </h3>  
      </Link>  
    </div>

    
      
      

  </div>
  
  
  
  )
}

export default TeacherLanding;
