import React from 'react';
import './Motivational.css';

const Motivational = () => {
  const videos = [
    {
      title: "How to Stay Motivated in School",
      src: "https://www.youtube.com/embed/V23328lkPm0?si=AAVMsoFJgPWoYj9K",
    },
    {
      title: "Overcoming Challenges in Education",
      src: "https://www.youtube.com/embed/oxdAatESX7s?si=DA6fF_18FHXfK90O",
    },
    {
      title: "Self-Discipline and Motivation",
      src: "https://www.youtube.com/embed/UVpn0f2_90g?si=wRDv4zWrI5FSeazM",
    },
    {
      title: "The Power of Yet",
      src: "https://www.youtube.com/embed/NcaoWeVOKls?si=gibyceS7HgrG7P0P",
    },
    {
      title: "Grit: The Power of Passion and Perseverance",
      src: "https://www.youtube.com/embed/H14bBuluwB8",
    },
    {
      title: "Your Attitude Determines Your Direction",
      src: "https://www.youtube.com/embed/T2zNqkMzl5E?si=2kU6BrabD2JOjdEU",
    },
  ];

  const successStories = [
    {
      name: "Ravi Kumar",
      story: "Ravi faced numerous challenges, including financial struggles, but with perseverance and support from mentors, he graduated with honors and is now pursuing his dream of becoming an engineer.",
      image: "https://plus.unsplash.com/premium_photo-1678197937465-bdbc4ed95815?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fHww" // Placeholder image
    },
    {
      name: "Anjali Singh",
      story: "Anjali overcame learning disabilities through determination and the help of her teachers. Today, she is a successful graphic designer, inspiring others to embrace their unique journeys.",
      image: "https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
  ];

  const affirmations = [
    "I am capable of achieving great things.",
    "Every challenge I face is an opportunity to grow.",
    "I believe in my abilities and trust my journey.",
    "I am resilient, and I will overcome obstacles.",
  ];

  return (
    <div className="motivational-page">
      <h1 className="motivational-title">Stay Motivated, Keep Going!</h1>
      <p className="motivational-subtext">
        🌟 Motivation is your key to unlocking success. Keep pushing forward and never stop believing in yourself. Here are some videos to inspire and energize you on your journey. 🚀
      </p>

      <div className="motivational-video-section">
        {videos.map((video, index) => (
          <div className="motivational-video-card" key={index}>
            <iframe 
              width="400" 
              height="250" 
              src={video.src} 
              title={video.title} 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
            <p className="motivational-video-title">{video.title}</p>
          </div>
        ))}
      </div>

      <h2 className="motivational-success-title">Success Stories</h2>
      <div className="motivational-success-section">
        {successStories.map((story, index) => (
          <div className="motivational-success-card" key={index}>
            <img src={story.image} alt={`${story.name}`} className="motivational-success-image" />
            <div className="motivational-success-content">
              <h3 className="motivational-success-name">{story.name}</h3>
              <p className="motivational-success-story">{story.story}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="motivational-affirmation-title">Positive Affirmations</h2>
      <div className="motivational-affirmation-section">
        {affirmations.map((affirmation, index) => (
          <blockquote className="motivational-affirmation" key={index}>
            {affirmation}
          </blockquote>
        ))}
      </div>

      <p className="motivational-final-note">
        Keep shining, keep striving, and never give up on your dreams! 💫✨
      </p>
    </div>
  );
};

export default Motivational;
