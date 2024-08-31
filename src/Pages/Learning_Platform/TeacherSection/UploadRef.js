import React, { useState, useEffect } from 'react';
import { ref, listAll, uploadBytes } from 'firebase/storage';
import { storage } from '../../../firebase'; // Adjust your Firebase storage import as needed
import './Teachform.css'






function UploadRef() {
  const [classFolder, setClassFolder] = useState('');
  const [subjectFolder, setSubjectFolder] = useState('');
  const [chapterFolder, setChapterFolder] = useState('');
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [newChapter, setNewChapter] = useState('');
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
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
    const subjectRef = ref(storage, `learn_platform/${e.target.value}/ref`);
    const result = await listAll(subjectRef);
    const subjectNames = result.prefixes.map((folder) => folder.name);
    setSubjects(subjectNames);
    setSubjectFolder('');
    setChapters([]);
    setChapterFolder('');
    setNewChapter('');
  };

  const handleSubjectChange = async (e) => {
    setSubjectFolder(e.target.value);
    const chapterRef = ref(storage, `learn_platform/${classFolder}/ref/${e.target.value}`);
    const result = await listAll(chapterRef);
    const chapterNames = result.prefixes.map((folder) => folder.name);
    setChapters(chapterNames);
    setChapterFolder(''); 
    setNewChapter('');
  };

  const handlePdfUpload = async (e) => {
    e.preventDefault();

    if (!pdfFile) {
      alert('Please select a PDF file to upload.');
      return;
    }

    let chapterPath = chapterFolder;
    if (newChapter) {
      chapterPath = newChapter;
    }

    const pdfRef = ref(storage, `learn_platform/${classFolder}/ref/${subjectFolder}/${chapterPath}/${pdfFile.name}`);
    await uploadBytes(pdfRef, pdfFile);

    alert('PDF uploaded successfully!');

    setClassFolder('');
    setSubjectFolder('');
    setChapterFolder('');
    setNewChapter('');
    setPdfFile(null);
    setSubjects([]);
    setChapters([]);
  };

  return (
    <div className='thatform'>
    <form onSubmit={handlePdfUpload}>
      <label>
        Select Class:
        <select value={classFolder} onChange={handleClassChange} required>
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
        <select value={subjectFolder} onChange={handleSubjectChange} required disabled={!classFolder}>
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
          onChange={(e) => {
            setChapterFolder(e.target.value);
            setNewChapter(''); 
          }}
          disabled={!subjectFolder || newChapter}
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
      <label>
        OR Enter New Chapter:
        <input
          type="text"
          value={newChapter}
          onChange={(e) => {
            setNewChapter(e.target.value);
            setChapterFolder('');
          }}
          disabled={!subjectFolder || chapterFolder}
        />
      </label>
      <br />
      <label>
        Upload PDF:
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
          required
        />
      </label>
      <br />
      <button type="submit" disabled={!pdfFile}>Upload PDF</button>
    </form>
    </div>
  );
}

export default UploadRef;
