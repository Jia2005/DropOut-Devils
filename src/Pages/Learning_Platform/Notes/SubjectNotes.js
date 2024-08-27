import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';

function SubjectNotes() {
  const { subjectFolder, chapterFolder } = useParams();
  const [pdfLinks, setPdfLinks] = useState([]);

  useEffect(() => {
    const fetchPDFs = async () => {
      const fullPath = `${subjectFolder}/${chapterFolder}`;
      const folderRef = ref(storage, fullPath);
      const result = await listAll(folderRef);
      const links = await Promise.all(result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return { name: itemRef.name, url };
      }));
      setPdfLinks(links);
    };

    fetchPDFs();
  }, [subjectFolder, chapterFolder]);

  return (
    <div>
      <h2>PDFs in {subjectFolder}/{chapterFolder}</h2>
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
  );
}

export default SubjectNotes;
