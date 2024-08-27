import React from 'react'
import { Link } from 'react-router-dom';
function Quizzes() {
  return (
    <div>
      this is a quizzes page
      <br/>

      <Link to = '/viewqp'>Question papers</Link>
      <br/>
      <Link to = '#'>MCQs</Link>
      <br/>
      <Link to = '/uploadanswer'>Answer a question paper</Link>
    </div>
  )
}

export default Quizzes
