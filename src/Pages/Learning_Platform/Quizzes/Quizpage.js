import React from 'react'
import { Link } from 'react-router-dom';
import './Quizpage.css'
function Quizzes() {
  return (
    <div className="panel">
      <h2>Test Section</h2>
      <br/>

      <Link to = '/viewqp'><button>Question papers</button></Link>
      <br/>
      <Link to = '/studentquiz'><button>MCQs</button></Link>
      <br/>
      <Link to = '/uploadanswer'><button>Answer a question paper</button></Link>
      <br/>
      <br/>
    </div>
  )
}

export default Quizzes
