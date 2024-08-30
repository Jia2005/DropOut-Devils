import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';
import './SubjectNotes.css';

function SubjectNotes() {
  const { classFolder, subjectFolder, chapterFolder } = useParams();
  const [pdfLinks, setPdfLinks] = useState([]);

  useEffect(() => {
    const fetchPDFs = async () => {
      const fullPath = `learn_platform/${classFolder}/ref/${subjectFolder}/${chapterFolder}`;
      const folderRef = ref(storage, fullPath);
      const result = await listAll(folderRef);
      const links = await Promise.all(result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return { name: itemRef.name, url };
      }));
      setPdfLinks(links);
    };

    fetchPDFs();
  }, [classFolder, subjectFolder, chapterFolder]);

  return (
    <div className='panel'>
      <h2>PDFs available</h2>
      <ul>
        {pdfLinks.map((pdf) => (
          <li key={pdf.name}>
            <a href={pdf.url} download={pdf.name}>
              {pdf.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SubjectNotes;
