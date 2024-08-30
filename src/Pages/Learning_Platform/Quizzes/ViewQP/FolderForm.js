import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, listAll } from 'firebase/storage';
import { storage } from '../../../../firebase'; 

function FormFolder() {
  const [classFolder, setClassFolder] = useState('');
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      const classRef = ref(storage, 'quizzes');
      const result = await listAll(classRef);
      const classNames = result.prefixes.map((folder) => folder.name);
      setClasses(classNames);
    };
    fetchClasses();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullPath = `${classFolder}`;
    navigate(`/list-pdfs/${fullPath}`);
  };

  return (
    <div className='allform'>
    <form onSubmit={handleSubmit}>
      <label>
        Select Class:
        <select 
          value={classFolder} 
          onChange={(e) => setClassFolder(e.target.value)} 
          required
        >
          <option value="" disabled>Select Class</option>
          {classes.map((className) => (
            <option key={className} value={className}>
              {className}
            </option>
          ))}
        </select>
      </label>
      <br />
      <button type="submit" disabled={!classFolder}>Get PDFs</button>
    </form>
    </div>
  );
}

export default FormFolder;
