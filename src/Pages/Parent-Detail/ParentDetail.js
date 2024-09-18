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
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
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
    if (!annualIncome || !education) {
      setError('Please select both Annual Income and Education.');
      return;
    }

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
          <div className="form-group-parent">
            <label htmlFor="annualIncome">Annual Income:</label>
            <select
              id="annualIncome"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
            >
              <option value="">Select income range</option>
              <option value="Below 2 Lakh">Below 2 Lakh</option>
              <option value="2 Lakh - 4 Lakh">2 Lakh - 4 Lakh</option>
              <option value="4 Lakh - 6 Lakh">4 Lakh - 6 Lakh</option>
              <option value="6 Lakh - 8 Lakh">6 Lakh - 8 Lakh</option>
              <option value="Above 8 Lakh">Above 8 Lakh</option>
            </select>
          </div>
          <div className="form-group-parent">
            <label htmlFor="education">Education:</label>
            <select
              id="education"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            >
              <option value="">Select education level</option>
              <option value="Non Literate">Non Literate</option>
              <option value="Primary School">Primary School</option>
              <option value="Secondary School">Secondary School</option>
              <option value="Higher Secondary School">Higher Secondary School</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree">Master's Degree</option>
              <option value="Doctorate">Doctorate</option>
            </select>
          </div>
          <button
            className="save-button"
            onClick={handleSave}
            disabled={!annualIncome || !education}
          >
            Save
          </button>
        </>
      )}
    </div>
  );
};

export default ParentDetail;