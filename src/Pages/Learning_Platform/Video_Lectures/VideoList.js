import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import './VideoList.css';

function VideoList() {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(''); 
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [videoLectures, setVideoLectures] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchUserGrade = async () => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const userType = userData.type;
        
        if (userType === 3) {
          const childEmail = userData.childEmail;
          
          if (childEmail) {
            const childUserQuery = query(collection(db, 'users'), where('email', '==', childEmail));
            const childUserSnap = await getDocs(childUserQuery);

            if (!childUserSnap.empty) {
              const childUserData = childUserSnap.docs[0].data();
                setSelectedGrade(childUserData.grade);
            } else {
              console.error('No child user found with the provided email.');
            }
          } else {
            console.error('No child email found for the parent user.');
          }
        } else if (userType === 1) {
          setSelectedGrade(userData.grade);
        }
      } else {
        console.error('User document does not exist.');
      }
    } else {
      console.error('No user is signed in.');
    }
  };

  fetchUserGrade();
}, []);

  useEffect(() => {
    const fetchOptions = async () => {
      if (selectedGrade) {
        const subjectSnap = await getDocs(query(
          collection(db, 'video_lectures'),
          where('grade', '==', selectedGrade)
        ));
        const subjectsSet = new Set();
        subjectSnap.docs.forEach(doc => subjectsSet.add(doc.data().subject));
        setSubjects(Array.from(subjectsSet));
      }
    };

    fetchOptions();
  }, [selectedGrade]);

  useEffect(() => {
    const fetchChapters = async () => {
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

    fetchChapters();
  }, [selectedGrade, selectedSubject]); 

  const fetchVideos = async () => {
    const q = query(
      collection(db, 'video_lectures'),
      where('grade', '==', selectedGrade),
      ...(selectedSubject ? [where('subject', '==', selectedSubject)] : []),
      ...(selectedChapters.length ? [where('chapter', 'in', selectedChapters)] : [])
    );
    const querySnapshot = await getDocs(q);
    const lectures = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setVideoLectures(lectures);
  };

  useEffect(() => {
    fetchVideos();
  }, [selectedGrade, selectedSubject, selectedChapters]);

  const handleImageClick = (videoId) => {
    navigate(`/play-video/${videoId}`);
  };

  const toggleFilterPanel = () => {
    setShowFilters(prev => !prev);
  };

  const handleApplyFilters = () => {
    fetchVideos();
    setShowFilters(false);
  };

  return (
      <div className='video-list-container'>
        <div className='filters-toggle-container'>
          <button className='filters-toggle-button' onClick={toggleFilterPanel}>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        {showFilters && (
          <div className='filter-panel'>
            <div className="filterhere">
              <div className='filter-group'>
                <label htmlFor='subject'>Subjects:</label>
                <select
                  id='subject'
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)} 
                  disabled={!selectedGrade}
                >
                  <option value=''>Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div className='filter-group'>
                <label htmlFor='chapter'>Chapters:</label>
                <select
                  id='chapter'
                  value={selectedChapters}
                  onChange={(e) => setSelectedChapters([e.target.value])} 
                  disabled={!selectedSubject}
                >
                  <option value=''>Select Chapter</option>
                  {chapters.map(chapter => (
                    <option key={chapter} value={chapter}>{chapter}</option>
                  ))}
                </select>
              </div>
            </div>
            <button className='apply-filters-button' onClick={handleApplyFilters}>Apply Filters</button>
          </div>
        )}
        <div className='video-list-grid'>
          {videoLectures.map((lecture) => (
            <div key={lecture.id} className={`video-list-item ${lecture.is_rev ? 'review' : ''}`}>
              <img 
                src={lecture.img_link} 
                alt={lecture.title} 
                onClick={() => handleImageClick(lecture.id)}  
                className='video-thumbnail'
              />
              <p className='video-title'>{lecture.title}</p>
              <p className='video-type'>{lecture.is_rev ? 'Review Lecture' : 'Lecture'}</p>
            </div>
          ))}
        </div>
      </div>
  );
}

export default VideoList;
