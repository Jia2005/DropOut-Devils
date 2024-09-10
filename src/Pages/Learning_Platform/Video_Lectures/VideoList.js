import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import './VideoList.css';

function VideoList() {
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [videoLectures, setVideoLectures] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      // Fetch available grades
      const gradeSnap = await getDocs(collection(db, 'video_lectures'));
      const gradesSet = new Set();
      gradeSnap.docs.forEach(doc => gradesSet.add(doc.data().grade));
      setGrades(Array.from(gradesSet));

      // Fetch subjects based on selected grade
      if (selectedGrade) {
        const subjectSnap = await getDocs(query(
          collection(db, 'video_lectures'),
          where('grade', '==', selectedGrade)
        ));
        const subjectsSet = new Set();
        subjectSnap.docs.forEach(doc => subjectsSet.add(doc.data().subject));
        setSubjects(Array.from(subjectsSet));
      }

      // Fetch chapters based on selected subject
      if (selectedSubject) {
        const chapterSnap = await getDocs(query(
          collection(db, 'video_lectures'),
          where('grade', '==', selectedGrade),
          where('subject', '==', selectedSubject)
        ));
        const chaptersSet = new Set();
        chapterSnap.docs.forEach(doc => chaptersSet.add(doc.data().chapter));
        setChapters(Array.from(chaptersSet));
      }
    };

    fetchOptions();
  }, [selectedGrade, selectedSubject]);

  const handleGetVideos = async () => {
    const q = query(
      collection(db, 'video_lectures'),
      where('grade', '==', selectedGrade),
      where('subject', '==', selectedSubject),
      where('chapter', '==', selectedChapter)
    );
    const querySnapshot = await getDocs(q);
    const lectures = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setVideoLectures(lectures);
  };

  const handleImageClick = (videoId) => {
    navigate(`/play-video/${videoId}`);  // Pass video ID to the route
  };
  
  return (
    <div className='video-list-container'>
      <h2 className='video-list-header'>Select Filters and Get Videos</h2>
      <div className='filters-container'>
        <div className='filter-group'>
          <label htmlFor='grade'>Grade:</label>
          <select
            id='grade'
            value={selectedGrade}
            onChange={(e) => {
              setSelectedGrade(e.target.value);
              setSelectedSubject('');
              setSelectedChapter('');
            }}
          >
            <option value=''>Select Grade</option>
            {grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>
        <div className='filter-group'>
          <label htmlFor='subject'>Subject:</label>
          <select
            id='subject'
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setSelectedChapter('');
            }}
            disabled={!selectedGrade}
          >
            <option value=''>Select Subject</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        <div className='filter-group'>
          <label htmlFor='chapter'>Chapter:</label>
          <select
            id='chapter'
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            disabled={!selectedSubject}
          >
            <option value=''>Select Chapter</option>
            {chapters.map(chapter => (
              <option key={chapter} value={chapter}>{chapter}</option>
            ))}
          </select>
        </div>
        <button onClick={handleGetVideos}>Get Videos</button>
      </div>
      <ul className='video-list-items'>
        {videoLectures.map((lecture) => (
          <li key={lecture.id} className={`video-list-item ${lecture.is_rev ? 'review' : ''}`}>
            <img 
              src={lecture.img_link} 
              alt={lecture.title} 
              onClick={() => handleImageClick(lecture.id)}  // Pass video ID here
            />
            <p>Name: {lecture.title}</p>
            <p>{lecture.is_rev ? 'Review Lecture' : 'Lecture'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VideoList;
