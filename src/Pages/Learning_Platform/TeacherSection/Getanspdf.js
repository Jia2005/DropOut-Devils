import React, { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase'; 
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import './Getanspdf.css';

function Getanspdf() {
  const [classFolder, setClassFolder] = useState('');
  const [quizFolder, setQuizFolder] = useState('');
  const [classes, setClasses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classRef = ref(storage, 'quizzes');
        const result = await listAll(classRef);
        const classNames = result.prefixes.map((folder) => folder.name);
        setClasses(classNames);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);

  const handleClassChange = async (e) => {
    setClassFolder(e.target.value);
    setQuizFolder('');

    const quizRef = ref(storage, `quizzes/${e.target.value}/ans`);
    const result = await listAll(quizRef);
    const quizNames = result.prefixes.map((folder) => folder.name);
    setQuizzes(quizNames);
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    const zip = new JSZip();
    const folderRef = ref(storage, `quizzes/${classFolder}/ans/${quizFolder}`);

    const result = await listAll(folderRef);
    const pdfFiles = result.items.filter((item) => item.name.endsWith('.pdf'));

    await Promise.all(
      pdfFiles.map(async (item) => {
        const fileURL = await getDownloadURL(item);
        const fileData = await fetch(fileURL).then((res) => res.blob());
        zip.file(item.name, fileData);
      })
    );

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `${quizFolder}.zip`);
  };

  return (
    <div className="get-anspdf-wrapper">
      <form className="get-anspdf-form" onSubmit={handleDownload}>
        <label>
          Select Class:
          <select value={classFolder} onChange={handleClassChange} required>
            <option value="" disabled>
              Select Class
            </option>
            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Select Quiz:
          <select
            value={quizFolder}
            onChange={(e) => setQuizFolder(e.target.value)}
            required
            disabled={!classFolder}
          >
            <option value="" disabled>
              Select Quiz
            </option>
            {quizzes.map((quizName) => (
              <option key={quizName} value={quizName}>
                {quizName}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit" disabled={!quizFolder}>
          Download PDFs as ZIP
        </button>
      </form>
    </div>
  );
}

export default Getanspdf;
