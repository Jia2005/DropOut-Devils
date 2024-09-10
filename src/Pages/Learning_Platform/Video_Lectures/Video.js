import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

function VideoPlayer() {
  const { videoId } = useParams(); // Get the video ID from the route
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const fetchVideoUrl = async () => {
      const docRef = doc(db, 'video_lectures', videoId); // Get the document by ID
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setVideoUrl(docSnap.data().vid_link); // Get the video URL from the document
      } else {
        console.error('No such document!');
      }
    };

    fetchVideoUrl();
  }, [videoId]);

  return (
    <div>
      <h2>Video Player</h2>
      {videoUrl ? (
        <video width="100%" controls>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
}

export default VideoPlayer;

