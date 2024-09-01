import React, { useState, useEffect } from 'react';
import { ref, listAll, uploadBytes } from 'firebase/storage';
import { storage } from '../../../firebase'; 
import './CreateLecture.css';

function CreateLecture() {
  const [classFolder, setClassFolder] = useState('');
  const [subjectFolder, setSubjectFolder] = useState('');
  const [chapterFolder, setChapterFolder] = useState('');
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [newChapter, setNewChapter] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isReviewLecture, setIsReviewLecture] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      const classRef = ref(storage, 'learn_platform');
      const result = await listAll(classRef);
      const classNames = result.prefixes.map((folder) => folder.name);
      setClasses(classNames);
    };
    fetchClasses();
  }, []);

  const handleClassChange = async (e) => {
    const selectedClass = e.target.value;
    setClassFolder(selectedClass);
    const subjectRef = ref(storage, `learn_platform/${selectedClass}/lec`);
    const result = await listAll(subjectRef);
    const subjectNames = result.prefixes.map((folder) => folder.name);
    setSubjects(subjectNames);
    setSubjectFolder('');
    setChapters([]);
    setChapterFolder('');
    setNewChapter('');
  };

  const handleSubjectChange = async (e) => {
    const selectedSubject = e.target.value;
    setSubjectFolder(selectedSubject);
    const chapterRef = ref(storage, `learn_platform/${classFolder}/lec/${selectedSubject}`);
    const result = await listAll(chapterRef);
    const chapterNames = result.prefixes.map((folder) => folder.name);
    setChapters(chapterNames);
    setChapterFolder('');
    setNewChapter('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    let basePath = `learn_platform/${classFolder}`;
    if (isReviewLecture) {
      basePath = `${basePath}/rev`;
    } else {
      let chapterPath = newChapter || chapterFolder;
      basePath = `${basePath}/lec/${subjectFolder}/${chapterPath}`;
    }

    if (videoFile) {
      const videoRef = ref(storage, `${basePath}/${videoFile.name}`);
      await uploadBytes(videoRef, videoFile);
    }

    if (imageFile) {
      const imageExtension = imageFile.name.split('.').pop();
      const imageName = `${videoFile.name.split('.')[0]}.${imageExtension}`;
      const imageRef = ref(storage, `${basePath}/${imageName}`);
      await uploadBytes(imageRef, imageFile);
    }

    alert('Video and image uploaded successfully!');
  };

  return (
    <div className='create-lecture-wrapper'>
      <div className='create-lecture-form'>
        <form onSubmit={handleUpload}>
          <label>
            Select Class:
            <select value={classFolder} onChange={handleClassChange} required>
              <option value="" disabled>Select Class</option>
              {classes.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Is this a Review Lecture?
            <select value={isReviewLecture} onChange={(e) => setIsReviewLecture(e.target.value === 'true')} required>
              <option value={false}>No</option>
              <option value={true}>Yes</option>
            </select>
          </label>
          <br />
          {!isReviewLecture && (
            <>
              <label>
                Select Subject:
                <select value={subjectFolder} onChange={handleSubjectChange} required disabled={!classFolder}>
                  <option value="" disabled>Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </label>
              <br />
              <label>
                Select Chapter:
                <select
                  value={chapterFolder}
                  onChange={(e) => {
                    setChapterFolder(e.target.value);
                    setNewChapter('');
                  }}
                  disabled={!subjectFolder || newChapter}
                >
                  <option value="" disabled>Select Chapter</option>
                  {chapters.map((chapter) => (
                    <option key={chapter} value={chapter}>
                      {chapter}
                    </option>
                  ))}
                </select>
              </label>
              <br />
              <label>
                OR Enter New Chapter:
                <input
                  type="text"
                  value={newChapter}
                  onChange={(e) => {
                    setNewChapter(e.target.value);
                    setChapterFolder('');
                  }}
                  className='input-new-chapter'
                  disabled={!subjectFolder || chapterFolder}
                />
              </label>
              <br />
            </>
          )}
          <label>
            Upload Video:
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              required
            />
          </label>
          <br />
          <label>
            Upload Image:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              required
            />
          </label>
          <br />
          <button type="submit" disabled={!videoFile}>Upload Lecture</button>
        </form>
      </div>
    </div>
  );
}

export default CreateLecture;
