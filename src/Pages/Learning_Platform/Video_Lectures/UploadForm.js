import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { storage, db } from '../../../firebase';
import './UploadForm.css';

function UploadForm() {
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [title, setTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isRev, setIsRev] = useState('no'); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile || !imageFile) {
      alert('Please select both video and image files.');
      return;
    }

    try {
      const imgLink = await uploadFile(imageFile, 'video_images/images');
      const vidLink = await uploadFile(videoFile, 'video_images/videos');

      await setDoc(doc(db, 'video_lectures', uuidv4()), {
        grade,
        subject,
        chapter,
        vid_link: vidLink,
        img_link: imgLink,
        title,
        is_rev: isRev === 'yes', 
      });

      alert('Upload successful!');
      setGrade('');
      setSubject('');
      setChapter('');
      setTitle('');
      setVideoFile(null);
      setImageFile(null);
      setIsRev('no'); 
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Upload failed.');
    }
  };

  const uploadFile = async (file, folder) => {
    const fileRef = ref(storage, `${folder}/${uuidv4()}`);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <div className="groupit">
        <div className="form-group">
          <label htmlFor="grade">Grade:</label>
          <input
            id="grade"
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="Grade"
            required
          />
        </div>

        <div className="form-group">
          <label>Review Lecture:</label><br></br>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="isRev"
                value="yes"
                checked={isRev === 'yes'}
                onChange={(e) => setIsRev(e.target.value)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="isRev"
                value="no"
                checked={isRev === 'no'}
                onChange={(e) => setIsRev(e.target.value)}
              />
              No
            </label>
          </div>
        </div>
      </div>

      <div className="subchap">
        <div className="form-group">
          <label htmlFor="subject">Subject:</label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="chapter">Chapter:</label>
          <input
            id="chapter"
            type="text"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            placeholder="Chapter"
            required
          />
        </div>
      </div>

      <div className="form-group titlehere">
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
      </div>

      <div className="filegroup">
        <div className="form-group">
          <label htmlFor="videoFile">Video File:</label>
          <input
            id="videoFile"
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageFile">Image File:</label>
          <input
            id="imageFile"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            required
          />
        </div>
      </div>

      <button className="submit-button" type="submit">Upload</button>
    </form>
  );
}

export default UploadForm;
