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
      const subjectRef = ref(storage, `learn_platform/${classFolder}/rev`);
      const result = await listAll(subjectRef);
      const chapterNames = result.prefixes.map((folder) => folder.name);
      setChapters(chapterNames);
    }
  };



  const fetchContentLinks = async () => {
    setIsFetching(true);
    const folderPath = isReviewLecture
      ? `learn_platform/${classFolder}/rev`
      : `learn_platform/${classFolder}/lec/${subjectFolder}/${chapterFolder}`;
    const folderRef = ref(storage, folderPath);
    const result = await listAll(folderRef);

    const links = await Promise.all(result.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      return { name: itemRef.name, url };
    }));

    // Filter for image files
    const imageLinks = links.filter((link) => /\.(jpg|jpeg|png|gif)$/i.test(link.name));

    setContentLinks(imageLinks);
    setIsFetching(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchContentLinks();
  };

  const handleImageClick = (imageName) => {
    if (!subjectFolder || !chapterFolder){
      navigate(`/video/${classFolder}/revision/revisionchapter/${imageName.replace(/\.[^/.]+$/, "")}`);
    }else{
      navigate(`/video/${classFolder}/${subjectFolder}/${chapterFolder}/${imageName.replace(/\.[^/.]+$/, "")}`);
    }
    
  };

  return (
    <div className='subject-list-wrapper'>
      <form onSubmit={handleSubmit} className='subject-list-form'>
        <div className='form-group'>
          <label htmlFor='class-select'>Select Class:</label>
          <select 
            id='class-select'
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
        </div>

        <div className='form-group'>
          <label htmlFor='review-lecture-select'>Is this a Review Lecture?</label>
          <select 
            id='review-lecture-select'
            value={isReviewLecture} 
            onChange={handleReviewLectureChange} 
            required
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        {!isReviewLecture && (
          <>
            <div className='form-group'>
              <label htmlFor='subject-select'>Select Subject:</label>
              <select 
                id='subject-select'
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
            </div>

            <div className='form-group'>
              <label htmlFor='chapter-select'>Select Chapter:</label>
              <select 
                id='chapter-select'
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
            </div>
          </>
        )}

        <button 
          className='submit-button'
          type="submit" 
          disabled={!classFolder || (!isReviewLecture && (!subjectFolder || !chapterFolder))}
        >
          {isFetching ? 'Loading...' : 'Submit'}
        </button>
      </form>

      {contentLinks.length > 0 && (
        <div className='content-list'>
          <h3>Available Videos:</h3>
          <ul>
            {contentLinks.map((content) => (
              <li key={content.name}>
                <img 
                  src={content.url} 
                  alt={content.name} 
                  style={{ maxWidth: '200px', maxHeight: '200px', cursor: 'pointer' }} 
                  onClick={() => handleImageClick(content.name)} 
                />
                <p>{content.name.split('.')[0]}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}




export default SubjectList;
