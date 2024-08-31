import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';


function ReviewList() {
  const { classFolder } = useParams();
  const [imageLinks, setImageLinks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      const folderPath = `learn_platform/${classFolder}/rev`; // Path for review lectures
      const folderRef = ref(storage, folderPath);
      const result = await listAll(folderRef);
      const links = await Promise.all(result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return { name: itemRef.name, url };
      }));
      setImageLinks(links.filter(link => isImage(link.name)));
    };

    fetchImages();
  }, [classFolder]);

  const isImage = (fileName) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const fileExtension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    return imageExtensions.includes(fileExtension);
  };

  const handleImageClick = (imageName) => {
    const videoName = imageName.split('.')[0]; // Get the base name of the image to match the video name
    navigate(`/play-review-video/${classFolder}/${videoName}`);
  };

  return (
    <div className='panel'>
      <h2>Review Videos Available</h2>
      <ul>
        {imageLinks.map((image) => (
          <li key={image.name}>
            <img 
              src={image.url} 
              alt={image.name} 
              style={{ width: '300px', height: 'auto', cursor: 'pointer' }} 
              onClick={() => handleImageClick(image.name)} 
            />
            <p>Name: {image.name.split('.')[0]}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReviewList;
