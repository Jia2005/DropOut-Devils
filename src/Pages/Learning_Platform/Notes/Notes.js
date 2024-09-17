import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';
import './Notes.css';

function Notes() {
  const [classFolder, setClassFolder] = useState('');
  const [subjectFolder, setSubjectFolder] = useState('');
  const [chapterFolder, setChapterFolder] = useState('');
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [pdfLinks, setPdfLinks] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
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
    setSubjects([]);

    const classRef = ref(storage, `learn_platform/${e.target.value}/lec`);
    const result = await listAll(classRef);
    const subjectNames = result.prefixes.map((folder) => folder.name);
    setSubjects(subjectNames);
  };

  const handleSubjectChange = async (e) => {
    setSubjectFolder(e.target.value);
    setChapterFolder('');
    setChapters([]);

    const subjectRef = ref(storage, `learn_platform/${classFolder}/ref/${e.target.value}`);
    const result = await listAll(subjectRef);
    const chapterNames = result.prefixes.map((folder) => folder.name);
    setChapters(chapterNames);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFetching(true);

    const folderPath = `learn_platform/${classFolder}/ref/${subjectFolder}/${chapterFolder}`;
    const folderRef = ref(storage, folderPath);
    const result = await listAll(folderRef);

    const links = await Promise.all(result.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      return { name: itemRef.name, url };
    }));

    setPdfLinks(links);
    setIsFetching(false);
  };

  return (
    <div className='notes-wrapper'>
      <form onSubmit={handleSubmit} className='notes-form'>
        <div className='form-group-notes'>
          <label htmlFor='class-select'>Select Class Folder:</label>
          <select 
            id='class-select'
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
        </div>

        <div className='form-group-notes'>
          <label htmlFor='subject-select'>Select Subject Folder:</label>
          <select 
            id='subject-select'
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
        </div>

        <div className='form-group-notes'>
          <label htmlFor='chapter-select'>Select Chapter Folder:</label>
          <select 
            id='chapter-select'
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
        </div>

        <button 
          className='submit-button'
          type="submit" 
          disabled={!chapterFolder}
        >
          {isFetching ? 'Loading...' : 'Get PDFs'}
        </button>
      </form>

      {pdfLinks.length > 0 && (
        <div className='pdf-list'>
          <h2 style={{textAlign:'left'}}>Available PDFs:</h2>
          <ul>
            {pdfLinks.map((pdf) => (
              <li key={pdf.name}>
                <a style={{textAlign:'left', color:'black',fontSize:'16px'}} href={pdf.url} download={pdf.name}>
                  {pdf.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Notes;
