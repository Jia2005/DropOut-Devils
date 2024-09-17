import React, { useState, useEffect } from 'react';
import './Enrollment.css';
import { db } from '../../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Enrollment = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [enrollmentStatus] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleEnrollClick = async () => {
    if (selectedCard) {
      try {
        if (currentUser) {
          const userId = currentUser.email;
          const userDocRef = doc(db, 'students', userId);

          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.type === 1) {
              await updateDoc(userDocRef, {
                enrolledCourse: selectedCard
              });

              window.alert('Enrolled successfully!');
            } else {
              window.alert('Only students can enroll in courses.');
            }
          } else {
            window.alert('User does not exist.');
          }
        } else {
          window.alert('No user is currently signed in.');
        }
      } catch (error) {
        console.error('Error enrolling user: ', error);
        window.alert('Error enrolling user.');
      }
    }
  };

  return (
    <div className="landing-page">
      <div className="features-section2">
        <div className="feature-cards-container">
          <div
            className={`card card-full-time ${selectedCard === 'full-time' ? 'selected' : ''}`}
            onClick={() => handleCardClick('full-time')}
          >
            <h2>Full-Time Course</h2>
            <p>Comprehensive full-time course designed to immerse you in the subject matter, ensuring a deep and thorough understanding.</p>
            <br />
            <p>Classes are from morning 7 to afternoon 1 daily</p>
          </div>
          <div
            className={`card card-part-time ${selectedCard === 'part-time' ? 'selected' : ''}`}
            onClick={() => handleCardClick('part-time')}
          >
            <h2>Part-Time Course</h2>
            <p>Flexible part-time course that allows you to balance learning with other commitments, providing a more adaptable schedule.</p>
            <br />
            <p>Classes are from morning 7 to morning 10 daily</p>
          </div>
          <div
            className={`card card-evening-classes ${selectedCard === 'evening-classes' ? 'selected' : ''}`}
            onClick={() => handleCardClick('evening-classes')}
          >
            <h2>Evening Classes</h2>
            <p>Evening classes for those who prefer to study after work or other daytime obligations, offering a convenient alternative.</p>
            <br />
            <p>Classes are from evening 6 to night 10</p>
          </div>
        </div>
        <button
          className="enroll-button"
          onClick={handleEnrollClick}
          disabled={selectedCard === null}
        >
          Enroll
        </button>
        {enrollmentStatus && <p>{enrollmentStatus}</p>}
      </div>
    </div>
  );
};

export default Enrollment;
