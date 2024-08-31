import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../firebase'; 

function ListPdfs() {
  const { classFolder } = useParams();
  const [pdfLinks, setPdfLinks] = useState([]);
  const [showPdfs, setShowPdfs] = useState(false); // Manage visibility of PDF list

  const fetchPDFs = async () => {
    const fullPath = `quizzes/${classFolder}/QP`;
    const folderRef = ref(storage, fullPath);
    const result = await listAll(folderRef);
    const links = await Promise.all(result.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      return { name: itemRef.name, url };
    }));
    setPdfLinks(links);
  };

  const handleButtonClick = () => {
    setShowPdfs(true); // Show the PDF list when button is clicked
    fetchPDFs(); // Fetch PDFs when button is clicked
  };

  return (
    <div className='list-pdfs-container'>
      <button onClick={handleButtonClick} className='fetch-button'>
        Get PDFs
      </button>

      {showPdfs && (
        <div className='pdf-list'>
          <h2>PDFs in {`${classFolder}/QP`}</h2>
          <ul>
            {pdfLinks.map((pdf) => (
              <li key={pdf.name}>
                <a href={pdf.url} download={pdf.name}>
                  <p>{pdf.name}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ListPdfs;
