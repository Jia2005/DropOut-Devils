import React, { useState, useEffect } from 'react';
import { ref, listAll, uploadBytes } from 'firebase/storage';
import { storage } from '../../../firebase'; 

function UploadPdf() {
  const [classFolder, setClassFolder] = useState('');
  const [classes, setClasses] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);

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

  const handleClassChange = (e) => {
    setClassFolder(e.target.value);
  };

  const handlePdfUpload = async (e) => {
    e.preventDefault();

    if (!pdfFile) {
      alert('Please select a PDF file to upload.');
      return;
    }

    const folderName = pdfFile.name.split('.').slice(0, -1).join('.');
    const ansFolderPath = `quizzes/${classFolder}/ans/${folderName}/`;
    const qpFolderPath = `quizzes/${classFolder}/QP/${pdfFile.name}`;

    try {
      console.log('Starting folder creation and file upload...');
      const emptyFileRef = ref(storage, `${ansFolderPath}.empty`);
      await uploadBytes(emptyFileRef, new Uint8Array()); 
      const pdfRef = ref(storage, qpFolderPath);
      await uploadBytes(pdfRef, pdfFile);

      console.log('Folder created and file uploaded successfully!');
      alert('PDF uploaded successfully and folder created!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    }

    setClassFolder('');
    setPdfFile(null);
  };

  return (
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
  );
}

export default UploadPdf;
