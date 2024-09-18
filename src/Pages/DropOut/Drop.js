import React, { useState } from 'react';
import './Drop.css';

const Drop = () => {
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileType, setFileType] = useState('');

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = () => {
    if (message.trim()) {
      // Handle submission logic here (e.g., send the message to the server)
      setIsSubmitted(true);
    }
  };

  const handleFileUpload = (type) => {
    setFileType(type);
    document.getElementById(`${type}-file-input`).click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      alert(`Selected ${fileType}: ${file.name}`);
      // Handle file upload logic here
    }
  };

  const handleCancel = () => {
    // Handle cancel action (e.g., redirect to another page or close the form)
    console.log("User canceled the drop-out process.");
  };

  return (
    <div className="drop-container">
      <div className="drop-content">
        {!isSubmitted ? (
          <>
            <h1>Our systems have detected you are dropping out.</h1>
            <p>We're here to listen. You can share your thoughts with us below:</p>
            
            <textarea
              className="message-box"
              placeholder="Type your message here..."
              value={message}
              onChange={handleMessageChange}
            />
            
            <div className="media-options">
              <button className="media-btn" onClick={() => handleFileUpload('video')}>Upload Video</button>
              <button className="media-btn" onClick={() => handleFileUpload('voice')}>Upload Voice Note</button>
              <input
                type="file"
                id="video-file-input"
                accept="video/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <input
                type="file"
                id="voice-file-input"
                accept="audio/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            <button className="submit-btn" onClick={handleSubmit}>Send</button>
            <button className="cancel-btn" onClick={handleCancel}>No, I am not dropping out</button>
          </>
        ) : (
          <div className="thank-you-message">
            <h2>Thank you for sharing your thoughts with us.</h2>
            <p>We will reach out to you soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Drop;