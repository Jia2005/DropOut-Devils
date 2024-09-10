import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { storage, db } from '../../../firebase';

function UploadForm() {
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [title, setTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isRev, setIsRev] = useState('no'); // Default to 'no'

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
        is_rev: isRev === 'yes', // Convert 'yes'/'no' to boolean
      });

      alert('Upload successful!');
      setGrade('');
      setSubject('');
      setChapter('');
      setTitle('');
      setVideoFile(null);
      setImageFile(null);
      setIsRev('no'); // Reset isRev
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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
        placeholder="Grade"
        required
      />
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        required
      />
      <input
        type="text"
        value={chapter}
        onChange={(e) => setChapter(e.target.value)}
        placeholder="Chapter"
        required
      />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <fieldset>
        <legend>Review Lecture:</legend>
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
      </fieldset>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideoFile(e.target.files[0])}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        required
      />
      <button type="submit">Upload</button>
    </form>
  );
}

export default UploadForm;
