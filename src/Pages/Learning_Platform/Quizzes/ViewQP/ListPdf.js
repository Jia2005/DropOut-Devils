import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../firebase'; // Adjust your Firebase storage import as needed

function ListPdfs() {
  const { classFolder } = useParams();
  const [pdfLinks, setPdfLinks] = useState([]);

  useEffect(() => {
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

    fetchPDFs();
  }, [classFolder]);

  return (
    <div>
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
  );
}

export default ListPdfs;
