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
    const selectedClass = e.target.value;
    setClassFolder(selectedClass);
    setQuizFolder('');

    try {
      const quizRef = ref(storage, `quizzes/${selectedClass}/ans`);
      const result = await listAll(quizRef);
      const quizNames = result.prefixes.map((folder) => folder.name);
      setQuizzes(quizNames);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const handleDownload = async (e) => {
    e.preventDefault();

    if (!classFolder || !quizFolder) {
      console.error('Class or quiz folder is not selected.');
      return;
    }

    const zip = new JSZip();
    const folderRef = ref(storage, `quizzes/${classFolder}/ans/${quizFolder}`);

    try {
      const result = await listAll(folderRef);
      const pdfFiles = result.items.filter((item) => item.name.endsWith('.pdf'));

      if (pdfFiles.length === 0) {
        console.error('No PDF files found in the selected quiz folder.');
        return;
      }

      await Promise.all(
        pdfFiles.map(async (item) => {
          try {
            const fileURL = await getDownloadURL(item);
            const response = await fetch(fileURL);

            if (!response.ok) {
              throw new Error(`Failed to fetch file: ${item.name}`);
            }

            const fileData = await response.blob();
            if (fileData.size > 0) {
              zip.file(item.name, fileData);
            } else {
              console.error(`File ${item.name} is empty.`);
            }
          } catch (error) {
            console.error(`Error fetching or adding file ${item.name} to ZIP:`, error);
          }
        })
      );

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      console.log(`ZIP Blob Size: ${zipBlob.size} bytes`);
      if (zipBlob.size > 0) {
        saveAs(zipBlob, `${quizFolder}.zip`);
      } else {
        console.error('ZIP file is empty.');
      }
    } catch (error) {
      console.error('Error creating ZIP file:', error);
    }
  };

  return (
    <div className="get-anspdf-wrapper">
      <form className="get-anspdf-form" onSubmit={handleDownload}>
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
          Select Quiz:
          <select
            value={quizFolder}
            onChange={(e) => setQuizFolder(e.target.value)}
            required
            disabled={!classFolder}
          >
            <option value="" disabled>Select Quiz</option>
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
