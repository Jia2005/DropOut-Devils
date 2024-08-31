import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase'; 
import './SubjectList.css';

function SubjectList() {
  const [classFolder, setClassFolder] = useState('');
  const [subjectFolder, setSubjectFolder] = useState('');
  const [chapterFolder, setChapterFolder] = useState('');
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [isReviewLecture, setIsReviewLecture] = useState(false);
  const [contentLinks, setContentLinks] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();

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
    setSubjectFolder('');
    setChapterFolder('');
    setSubjects([]);
    setChapters([]);

    if (!isReviewLecture) {
      const lecRef = ref(storage, `learn_platform/${selectedClass}/lec`);
      const result = await listAll(lecRef);
      const subjectNames = result.prefixes.map((folder) => folder.name);
      setSubjects(subjectNames);
    }
  };

  const handleSubjectChange = async (e) => {
    const selectedSubject = e.target.value;
    setSubjectFolder(selectedSubject);
    setChapterFolder('');
    setChapters([]);

    if (!isReviewLecture) {
      const subjectRef = ref(storage, `learn_platform/${classFolder}/lec/${selectedSubject}`);
      const result = await listAll(subjectRef);
      const chapterNames = result.prefixes.map((folder) => folder.name);
      setChapters(chapterNames);
    }
  };

  const handleReviewLectureChange = async (e) => {
    const isReview = e.target.value === 'true';
    setIsReviewLecture(isReview);
    setSubjectFolder('');
    setChapterFolder('');
    setSubjects([]);
    setChapters([]);

    if (isReview) {
      const subjectRef = ref(storage, `learn_platform/${classFolder}/lec/rev`);
      const result = await listAll(subjectRef);
      const chapterNames = result.prefixes.map((folder) => folder.name);
      setChapters(chapterNames);
    }
  };

  const fetchContentLinks = async () => {
    setIsFetching(true);
    const folderPath = isReviewLecture
      ? `learn_platform/${classFolder}/lec/rev`
      : `learn_platform/${classFolder}/lec/${subjectFolder}/${chapterFolder}`;
    const folderRef = ref(storage, folderPath);
    const result = await listAll(folderRef);

    const links = await Promise.all(result.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      return { name: itemRef.name, url };
    }));

    setContentLinks(links);
    setIsFetching(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchContentLinks();
  };

  return (
    <div className='subject-list-container'>
      <form onSubmit={handleSubmit} className='subject-list-form'>
        <label>
          Select Class:
          <select 
            value={classFolder} 
            onChange={handleClassChange} 
            required
          >
            <option value="" disabled>Select Class</option>
            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </label>

        <label>
          Is this a Review Lecture?
          <select 
            value={isReviewLecture} 
            onChange={handleReviewLectureChange} 
            required
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </label>

        {!isReviewLecture && (
          <>
            <label>
              Select Subject:
              <select 
                value={subjectFolder} 
                onChange={handleSubjectChange} 
                required
                disabled={!classFolder}
              >
                <option value="" disabled>Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Select Chapter:
              <select 
                value={chapterFolder} 
                onChange={(e) => setChapterFolder(e.target.value)} 
                required
                disabled={!subjectFolder}
              >
                <option value="" disabled>Select Chapter</option>
                {chapters.map((chapter) => (
                  <option key={chapter} value={chapter}>
                    {chapter}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        <button 
          className='btn-subjectlist'
          type="submit" 
          disabled={!classFolder || (!isReviewLecture && (!subjectFolder || !chapterFolder))}
        >
          {isFetching ? 'Loading...' : 'Submit'}
        </button>
      </form>

      {contentLinks.length > 0 && (
        <div className='content-list'>
          <h3>Available Content:</h3>
          <ul>
            {contentLinks.map((content) => (
              <li key={content.name}>
                <a href={content.url} download={content.name}>
                  {content.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SubjectList;
