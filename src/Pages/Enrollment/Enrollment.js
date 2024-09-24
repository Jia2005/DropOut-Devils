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
          const userId = currentUser.uid;
          const userDocRef = doc(db, 'users', userId);

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
            className={`card card-full-time ${selectedCard === 'Full time' ? 'selected' : ''}`}
            onClick={() => handleCardClick('Full time')}
          >
            <h2>Full-Time Course</h2>
            <p><ul ><li style={{fontSize:"1.2rem"}}>Designed to immerse you in the subject matter</li> <li style={{fontSize:"1.2rem"}}> Ensures a deep and thorough understanding.</li></ul></p>
            <br />
            <p style={{fontWeight:"bold"}}>Timing: 7 am  to 1 pm</p>
          </div>
          <div
            className={`card card-part-time ${selectedCard === 'Part time' ? 'selected' : ''}`}
            onClick={() => handleCardClick('Part time')}
          >
            <h2>Part-Time Course</h2>
            <p><ul><li style={{fontSize:"1.2rem"}}>Allows you to balance learning with other commitments</li> <li style={{fontSize:"1.2rem"}}>Provides a more adaptable schedule</li></ul></p>
            <br />
            <p style={{fontWeight:"bold"}}>Timing: 7 am  to 10 am</p>
          </div>
          <div
            className={`card card-evening-classes ${selectedCard === 'Evening classes' ? 'selected' : ''}`}
            onClick={() => handleCardClick('Evening classes')}
          >
            <h2>Evening Classes</h2>
            <p><ul><li style={{fontSize:"1.2rem"}}>If you prefer to study after work or other daytime obligations</li><li style={{fontSize:"1.2rem"}}> Offers a convenient alternative</li></ul></p>
            <br />
            <p style={{fontWeight:"bold"}}>Timing: 6 pm  to 10 pm</p>
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
