import React, { useState } from 'react';
import { storage } from '../../../../firebase'; // Import your Firebase storage setup
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

function UploadFile() {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    quiz: '',
    file: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.file) {
      // Create a storage reference with the path 'subject/quiz/filename'
      const storageRef = ref(storage, `${formData.subject}/${formData.quiz}/${formData.file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, formData.file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Optional: Track the progress of the upload
        },
        (error) => {
          console.error("File upload error: ", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            // You can save the download URL and other form data to a database or perform other actions here
          });
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name/Unique ID:
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Subject:
        <input type="text" name="subject" value={formData.subject} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Quiz:
        <input type="text" name="quiz" value={formData.quiz} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Upload PDF:
        <input type="file" onChange={handleFileChange} accept="application/pdf" required />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}

export default UploadFile;
