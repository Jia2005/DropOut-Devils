import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, listAll } from 'firebase/storage';
import { storage } from '../../../firebase'; // Import your Firebase storage setup

function SubjectList() {
  const [classFolder, setClassFolder] = useState('');
  const [subjectFolder, setSubjectFolder] = useState('');
  const [chapterFolder, setChapterFolder] = useState('');
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of classes (folders in 'learn_platform')
    const fetchClasses = async () => {
      const classRef = ref(storage, 'learn_platform');
      const result = await listAll(classRef);
      const classNames = result.prefixes.map((folder) => folder.name);
      setClasses(classNames);
    };
    fetchClasses();
  }, []);

  const handleClassChange = async (e) => {
    setClassFolder(e.target.value);
    setSubjectFolder('');
    setChapterFolder('');
    setSubjects([]);
    setChapters([]);

    // Fetch the list of subjects (subfolders in 'lec' within selected class)
    const lecRef = ref(storage, `learn_platform/${e.target.value}/lec`);
    const result = await listAll(lecRef);
    const subjectNames = result.prefixes.map((folder) => folder.name);
    setSubjects(subjectNames);
  };

  const handleSubjectChange = async (e) => {
    setSubjectFolder(e.target.value);
    setChapterFolder('');
    setChapters([]);

    // Fetch the list of chapters (subfolders in selected subject)
    const subjectRef = ref(storage, `learn_platform/${classFolder}/lec/${e.target.value}`);
    const result = await listAll(subjectRef);
    const chapterNames = result.prefixes.map((folder) => folder.name);
    setChapters(chapterNames);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/list-images/${classFolder}/${subjectFolder}/${chapterFolder}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Select Class:
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
        Select Subject:
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
        Select Chapter:
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
      <button type="submit" disabled={!chapterFolder}>Submit</button>
    </form>
  );
}

export default SubjectList;
