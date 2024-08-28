import React, { useState, useEffect } from 'react';
import { ref, listAll, uploadBytes } from 'firebase/storage';
import { storage } from '../../../firebase'; // Adjust your Firebase storage import as needed

function CreateLecture() {
  const [classFolder, setClassFolder] = useState('');
  const [subjectFolder, setSubjectFolder] = useState('');
  const [chapterFolder, setChapterFolder] = useState('');
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [newChapter, setNewChapter] = useState('');
  const [videoFile, setVideoFile] = useState(null);

  useEffect(() => {
    // Fetch the list of class folders from 'learn_platform' in Firebase Storage
    const fetchClasses = async () => {
      const classRef = ref(storage, 'learn_platform');
      const result = await listAll(classRef);
      const classNames = result.prefixes.map((folder) => folder.name);
      setClasses(classNames);
    };
    fetchClasses();
  }, []);

  const handleClassChange = async (e) => {
    setClassFolder(e.target.value);
    // Fetch the list of subject folders within the selected class folder
    const subjectRef = ref(storage, `learn_platform/${e.target.value}/lec`);
    const result = await listAll(subjectRef);
    const subjectNames = result.prefixes.map((folder) => folder.name);
    setSubjects(subjectNames);
    setSubjectFolder(''); // Reset subject and chapter selections when class changes
    setChapters([]);
    setChapterFolder('');
    setNewChapter('');
  };

  const handleSubjectChange = async (e) => {
    setSubjectFolder(e.target.value);
    // Fetch the list of chapter folders within the selected subject folder
    const chapterRef = ref(storage, `learn_platform/${classFolder}/lec/${e.target.value}`);
    const result = await listAll(chapterRef);
    const chapterNames = result.prefixes.map((folder) => folder.name);
    setChapters(chapterNames);
    setChapterFolder(''); // Reset chapter selection when subject changes
    setNewChapter('');
  };

  const handleVideoUpload = async (e) => {
    e.preventDefault();

    let chapterPath = chapterFolder;
    if (newChapter) {
      chapterPath = newChapter;
      // No need to manually create the folder; just use this path for uploading the file
    }

    const videoRef = ref(storage, `learn_platform/${classFolder}/lec/${subjectFolder}/${chapterPath}/${videoFile.name}`);
    await uploadBytes(videoRef, videoFile);

    alert('Video uploaded successfully!');
  };

  return (
    <form onSubmit={handleVideoUpload}>
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
            setNewChapter(''); // Clear new chapter if selecting existing chapter
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
            setChapterFolder(''); // Clear existing chapter selection if entering new chapter
          }}
          disabled={!subjectFolder || chapterFolder}
        />
      </label>
      <br />
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
      <button type="submit" disabled={!videoFile}>Upload Lecture</button>
    </form>
  );
}

export default CreateLecture;
