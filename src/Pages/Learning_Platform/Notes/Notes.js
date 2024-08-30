import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, listAll } from 'firebase/storage';
import { storage } from '../../../firebase';

function Notes() {
  const [classFolder, setClassFolder] = useState('');
  const [subjectFolder, setSubjectFolder] = useState('');
  const [chapterFolder, setChapterFolder] = useState('');
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchClasses = async () => {
      const folderRef = ref(storage, 'learn_platform');
      const result = await listAll(folderRef);
      const classNames = result.prefixes.map((folder) => folder.name);
      setClasses(classNames);
    };
    fetchClasses();
  }, []);

  const handleClassChange = async (e) => {
    setClassFolder(e.target.value);
    setSubjectFolder('');
    setChapterFolder('');
    setChapters([]);

    const classRef = ref(storage, `learn_platform/${e.target.value}/lec`);
    const result = await listAll(classRef);
    const subjectNames = result.prefixes.map((folder) => folder.name);
    setSubjects(subjectNames);
  };

  const handleSubjectChange = async (e) => {
    setSubjectFolder(e.target.value);
    setChapterFolder('');

    const subjectRef = ref(storage, `learn_platform/${classFolder}/ref/${e.target.value}`);
    const result = await listAll(subjectRef);
    const chapterNames = result.prefixes.map((folder) => folder.name);
    setChapters(chapterNames);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullPath = `${classFolder}/${subjectFolder}/${chapterFolder}`;
    navigate(`/subjectnotes/${fullPath}`);
  };

  return (
    <div className='allform'>
    <form onSubmit={handleSubmit}>
      <label>
        Select Class Folder:
        <select 
          value={classFolder} 
          onChange={handleClassChange} 
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
      <label>
        Select Subject Folder:
        <select 
          value={subjectFolder} 
          onChange={handleSubjectChange} 
          required
          disabled={!classFolder}
        >
          <option value="" disabled>Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Select Chapter Folder:
        <select 
          value={chapterFolder} 
          onChange={(e) => setChapterFolder(e.target.value)} 
          required
          disabled={!subjectFolder}
        >
          <option value="" disabled>Select Chapter</option>
          {chapters.map((chapter) => (
            <option key={chapter} value={chapter}>
              {chapter}
            </option>
          ))}
        </select>
      </label>
      <br />
      <button type="submit" disabled={!chapterFolder}>Get PDFs</button>
    </form>
    </div>
  );
}

export default Notes;
