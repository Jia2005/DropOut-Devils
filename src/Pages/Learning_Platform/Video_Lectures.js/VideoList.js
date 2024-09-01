import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';
import './VideoList.css';

function VideoList() {
  const { classFolder, subjectFolder, chapterFolder } = useParams();
  const [imageLinks, setImageLinks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      
      const folderPath = (subjectFolder=='revision' || chapterFolder=='revisionchapter')
      ? `learn_platform/${classFolder}/rev`
      : `learn_platform/${classFolder}/lec/${subjectFolder}/${chapterFolder}`;
      const folderRef = ref(storage, folderPath);
      const result = await listAll(folderRef);
      const links = await Promise.all(result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return { name: itemRef.name, url };
      }));
      setImageLinks(links.filter(link => isImage(link.name)));
    };

    fetchImages();
  }, [classFolder, subjectFolder, chapterFolder]);

  const isImage = (fileName) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const fileExtension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    return imageExtensions.includes(fileExtension);
  };

  const handleImageClick = (imageName) => {
    const videoName = imageName.split('.')[0];
    navigate(`/play-video/${classFolder}/${subjectFolder}/${chapterFolder}/${videoName}`);
  };
  
  return (
    <div className='video-list-container'>
      <h2 className='video-list-header'>Videos Available</h2>
      <ul className='video-list-items'>
        {imageLinks.map((image) => (
          <li key={image.name} className='video-list-item'>
            <img 
              src={image.url} 
              alt={image.name} 
              onClick={() => handleImageClick(image.name)} 
            />
            <p>Name: {image.name.split('.')[0]}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VideoList;
