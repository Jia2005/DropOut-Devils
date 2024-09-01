import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, listAll } from 'firebase/storage';
import { storage } from '../../../firebase'; // Import your Firebase storage setup
import './SubjectList.css';






function SubjectList() {
  const [classFolder, setClassFolder] = useState('');
  const [subjectFolder, setSubjectFolder] = useState('');
  const [chapterFolder, setChapterFolder] = useState('');
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [isReviewLecture, setIsReviewLecture] = useState(false);
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
    setClassFolder(e.target.value);
    setSubjectFolder('');
    setChapterFolder('');
    setSubjects([]);
    setChapters([]);


    if (!isReviewLecture) {
      // Fetch the list of subjects (subfolders in 'lec' within selected class)
      const lecRef = ref(storage, `learn_platform/${e.target.value}/lec`);
      const result = await listAll(lecRef);
      const subjectNames = result.prefixes.map((folder) => folder.name);
      setSubjects(subjectNames);
    }

    const lecRef = ref(storage, `learn_platform/${e.target.value}/lec`);
    const result = await listAll(lecRef);
    const subjectNames = result.prefixes.map((folder) => folder.name);
    setSubjects(subjectNames);

  };

  const handleSubjectChange = async (e) => {
    setSubjectFolder(e.target.value);
    setChapterFolder('');
    setChapters([]);


    if (!isReviewLecture) {
      // Fetch the list of chapters (subfolders in selected subject)
      const subjectRef = ref(storage, `learn_platform/${classFolder}/lec/${e.target.value}`);
      const result = await listAll(subjectRef);
      const chapterNames = result.prefixes.map((folder) => folder.name);
      setChapters(chapterNames);
    }
  };


  const handleReviewLectureChange = async(e) => {

  const handleReviewLectureChange = async (e) => {

    setIsReviewLecture(e.target.value === 'true');
    setSubjectFolder('');
    setChapterFolder('');
    setSubjects([]);
    setChapters([]);

    const subjectRef = ref(storage, `learn_platform/${classFolder}/lec/${e.target.value}`);
    const result = await listAll(subjectRef);
    const chapterNames = result.prefixes.map((folder) => folder.name);
    setChapters(chapterNames);

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isReviewLecture) {
      navigate(`/list-images/${classFolder}/rev`);
    } else {
      navigate(`/list-images/${classFolder}/${subjectFolder}/${chapterFolder}`);
    }
  };

  return (
    <div className='bod'>
      <div className='allform'>
        <form onSubmit={handleSubmit}>
          <label>
            <pre>Select Class:</pre>
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
            <pre>Is this a Review Lecture?</pre>
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
                <pre>Select Subject:</pre>
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
                <pre>Select Chapter:</pre>
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

          <button type="submit" disabled={!classFolder || (!isReviewLecture && (!subjectFolder || !chapterFolder))}>
            Submit
          </button>
          <br />
        </form>
      </div>
    </div>
  );
}
}

export default SubjectList;
