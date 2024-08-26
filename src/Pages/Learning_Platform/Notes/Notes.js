import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Notes() {
  const [subjectFolder, setSubjectFolder] = useState('');
  const [chapterFolder, setChapterFolder] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullPath = `${subjectFolder}/${chapterFolder}`;
    navigate(`/list-pdfs/${fullPath}`);
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
      <button type="submit">Get PDFs</button>
    </form>
  );
}

export default Notes;
