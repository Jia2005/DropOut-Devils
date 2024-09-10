// VideoPlayer.js
import React from 'react';
import { useParams } from 'react-router-dom';

function VideoPlayer() {
  const { videoUrl } = useParams();
  console.log(decodeURIComponent(videoUrl));

  return (
    <div>
      <h2>Video Player</h2>
      <video width="100%" controls>
        <source src={decodeURIComponent(videoUrl)} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default VideoPlayer;
