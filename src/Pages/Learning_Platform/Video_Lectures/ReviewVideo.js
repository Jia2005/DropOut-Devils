import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';

function ReviewVideo() {
  const { classFolder, videoName } = useParams();
  const [videoUrl, setVideoUrl] = useState('');
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoPath = `learn_platform/${classFolder}/rev/${videoName}.mp4`; // Path for review videos
        const videoRef = ref(storage, videoPath);
        const url = await getDownloadURL(videoRef);
        setVideoUrl(url);
      } catch (error) {
        console.error('Error fetching review video:', error);
      }
    };

    fetchVideo();
  }, [classFolder, videoName]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        navigate(-1);
      }
    };

    if (videoUrl && videoRef.current) {
      videoRef.current.requestFullscreen();
      videoRef.current.play();

      document.addEventListener('fullscreenchange', handleFullscreenChange);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [videoUrl, navigate]);

  return (
    <div>
      <h2>Playing Review Video: {videoName}</h2>
      {videoUrl ? (
        <video ref={videoRef} controls width="640">
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <p>Loading review video...</p>
      )}
    </div>
  );
}

export default ReviewVideo;
