import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SubjectList.css'

function SubjectList() {
  const [subjectFolder, setSubjectFolder] = useState('');
  const [chapterFolder, setChapterFolder] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/list-images/${subjectFolder}/${chapterFolder}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Enter Subject Folder Name:
        <input 
          type="text" 
          value={subjectFolder} 
          onChange={(e) => setSubjectFolder(e.target.value)} 
          required 
        />
      </label>
      <br />
      <label>
        Enter Chapter Folder Name:
        <input 
          type="text" 
          value={chapterFolder} 
          onChange={(e) => setChapterFolder(e.target.value)} 
          required 
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}

export default SubjectList;
