import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';

function VideoPlayer() {
  const { subjectFolder, chapterFolder, videoName } = useParams();
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      const videoPath = `${subjectFolder}/${chapterFolder}/${videoName}.mp4`; // assuming videos are .mp4 files
      const videoRef = ref(storage, videoPath);
      const url = await getDownloadURL(videoRef);
      setVideoUrl(url);
    };

    fetchVideo();
  }, [subjectFolder, chapterFolder, videoName]);

  return (
    <div>
      <h2>Playing Video: {videoName}</h2>
      {videoUrl ? (
        <video controls width="640">
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
