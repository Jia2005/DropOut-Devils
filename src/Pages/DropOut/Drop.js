import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { storage, db, auth } from './../../firebase'; 
import { useNavigate } from 'react-router-dom'; 
import './Drop.css';

function Drop() {
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileType, setFileType] = useState('');
  const [file, setFile] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); 
      } else {
        setUserId(null); 
      }
    });

    return () => unsubscribe();
  }, []);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert('User ID is missing.');
      console.error('User ID is missing:', userId);
      return;
    }

    if (!message.trim() && !file) {
      alert('Please provide a message or upload a file.');
      return;
    }

    try {
      let fileUrl = '';
      if (file) {
        const fileRef = ref(storage, `dropouts/${userId}/${uuidv4()}`);
        await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(fileRef);
      }

      await setDoc(doc(db, 'dropouts', uuidv4()), {
        userId,
        message,
        fileUrl,
        fileType,
        timestamp: new Date(),
      });

      alert('Submission successful!');
      setMessage('');
      setFile(null);
      setFileType('');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting data:', error);
      alert(`Submission failed: ${error.message}`);
    }
  };

  const handleFileUpload = (type) => {
    setFileType(type);
    document.getElementById(`${type}-file-input`).click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      alert(`Selected ${fileType}: ${selectedFile.name}`);
    }
  };

  const handleCancel = () => {
    navigate('/home');
  };


  const handleReturnToHome = () => {
    navigate('/home');
  };

  return (
    <div className="drop-container">
      <div className="drop-content">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <h1>Our systems have detected you are dropping out.</h1>
            <p className="drop-para">We're here to listen. You can share your thoughts with us below:</p>
            
            <textarea
              className="message-box"
              placeholder="Type your message here..."
              value={message}
              onChange={handleMessageChange}
            />
            
            <div className="media-options">
              <button type="button" className="media-btn" onClick={() => handleFileUpload('video')}>Upload Video</button>
              <button type="button" className="media-btn" onClick={() => handleFileUpload('voice')}>Upload Voice Note</button>
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

            <div className="button-container">
              <button className="drop-submit-btn" type="submit" style={{backgroundColor:'#28a745', borderRadius:'8px'}}>Send</button>
              <button className="drop-cancel-btn" type="button" onClick={handleCancel}>No, I am not dropping out</button>
            </div>

          </form>
        ) : (
          <div className="thank-you-message">
            <h2>Thank you for sharing your thoughts with us.</h2>
            <p className="drop-para">We will reach out to you soon.</p>
            <button className="media-btn" onClick={handleReturnToHome}>Return to Home</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Drop;