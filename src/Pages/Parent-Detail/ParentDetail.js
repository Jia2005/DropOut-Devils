import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import './ParentDetail.css';

const ParentDetail = () => {
  const auth = getAuth();
  const db = getFirestore();

  const [user, setUser] = useState(null);
  const [annualIncome, setAnnualIncome] = useState('');
  const [education, setEducation] = useState('');
  const [error, setError] = useState('');
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        console.log('Current User:', currentUser);
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('User Data:', userData);
          setUser(currentUser);
          if (userData.type === 3) {
            setAnnualIncome(userData.annualIncome || '');
            setEducation(userData.education || '');
            setEditable(true);
          } else {
            setError('You are not authorized to view or edit this information.');
            setEditable(false);
          }
        } else {
          setError('User data not found.');
        }
      } else {
        setError('No user is logged in.');
      }
    };

    fetchUserData();
  }, [auth, db]);

  const handleSave = async () => {
    if (user && user.uid) {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.type === 3) {
          await updateDoc(userRef, {
            annualIncome,
            education,
          });
          alert('Details updated successfully.');
        } else {
          setError('You are not authorized to update this information.');
        }
      } else {
        setError('User data not found.');
      }
    } else {
      setError('No user is logged in.');
    }
  };

  return (
    <div className="parent-detail-container">
      <h2>Parent Details</h2>
      {error && <p className="error-message">{error}</p>}
      {editable && !error && (
        <>
          <div className="form-group">
            <label htmlFor="annualIncome">Annual Income:</label>
            <input
              type="text"
              id="annualIncome"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="education">Education:</label>
            <input
              type="text"
              id="education"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            />
          </div>
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
        </>
      )}
    </div>
  );
};

export default ParentDetail;