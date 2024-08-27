import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';

function VideoList() {
  const { subjectFolder, chapterFolder } = useParams();
  const [imageLinks, setImageLinks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      const folderPath = `${subjectFolder}/${chapterFolder}`;
      const folderRef = ref(storage, folderPath);
      const result = await listAll(folderRef);
      const links = await Promise.all(result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return { name: itemRef.name, url };
      }));
      setImageLinks(links.filter(link => isImage(link.name)));
    };

    fetchImages();
  }, [subjectFolder, chapterFolder]);

  const isImage = (fileName) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const fileExtension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    return imageExtensions.includes(fileExtension);
  };

  const handleImageClick = (imageName) => {
    const videoName = imageName.split('.')[0]; // Get the base name of the image to match the video name
    navigate(`/play-video/${subjectFolder}/${chapterFolder}/${videoName}`);
  };

  return (
    <div>
      <h2>Images in {subjectFolder}/{chapterFolder}</h2>
      <ul>
        {imageLinks.map((image) => (
          <li key={image.name}>
            <p>{image.name}</p>
            <img 
              src={image.url} 
              alt={image.name} 
              style={{ width: '200px', height: 'auto', cursor: 'pointer' }} 
              onClick={() => handleImageClick(image.name)} 
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VideoList;
