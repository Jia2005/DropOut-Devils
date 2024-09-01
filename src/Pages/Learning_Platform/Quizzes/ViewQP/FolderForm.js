import React, { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../firebase';
import './FolderForm.css'; // Ensure you have a CSS file for styling

function FormFolder() {
  const [classFolder, setClassFolder] = useState('');
  const [classes, setClasses] = useState([]);
  const [pdfLinks, setPdfLinks] = useState([]);
  const [showPdfs, setShowPdfs] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      const classRef = ref(storage, 'quizzes');
      const result = await listAll(classRef);
      const classNames = result.prefixes.map((folder) => folder.name);
      setClasses(classNames);
    };
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullPath = `quizzes/${classFolder}/QP`; // Adjust this path as needed
    const folderRef = ref(storage, fullPath);
    
    try {
      const result = await listAll(folderRef);
      const links = await Promise.all(result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return { name: itemRef.name, url };
      }));
      setPdfLinks(links);
      setShowPdfs(true); // Show PDFs after fetching
    } catch (error) {
      console.error("Error fetching PDFs: ", error);
      setPdfLinks([]);
      setShowPdfs(false);
    }
  };

  return (
    <div className='form-folder-container'>
      <form onSubmit={handleSubmit}>
        <label style={{textAlign:'left'}} className='form-folder-label'>
          Select Class:
          <select className='class-selection'
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
        <button className='submit-button' type="submit" disabled={!classFolder}>Get PDFs</button>
      </form>

      {showPdfs && (
        <div className='pdf-list-container'>
          <h2 style={{textAlign:'left'}}>PDFs in {`${classFolder}/QP`}</h2>
          <ul>
            {pdfLinks.map((pdf) => (
              <li key={pdf.name}>
                <a href={pdf.url} download={pdf.name}>
                  <p style={{textAlign:'left', color:'black',fontSize:'16px'}}>{pdf.name}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FormFolder;
