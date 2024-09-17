import React, { useState } from 'react';
import './Enrollment.css';
import { db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const Enrollment = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState('');

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleEnrollClick = async () => {
    if (selectedCard) {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const userId = user.email;
          const userDocRef = doc(db, 'students', userId);

          await updateDoc(userDocRef, {
            enrolledCourse: selectedCard
          });

          setEnrollmentStatus('Enrolled successfully!');
        } else {
          setEnrollmentStatus('No user is currently signed in.');
        }
      } catch (error) {
        console.error('Error enrolling user: ', error);
        setEnrollmentStatus('Error enrolling user.');
      }
    }
  };

  return (
    <div className="landing-page">
      <div className="features-section">
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