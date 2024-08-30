<<<<<<< HEAD
import React, { useState } from 'react';
import Navbar from './Components/Navbar/Navbar';
import RoleSwitcher from './Components/RoleSwitcher';
import ProgressReport from './Components/ProgressReport/ProgressReport';
import ScheduleMeeting from './Components/ScheduleMeeting/ScheduleMeeting';
import './lander.css';

const Lander = () => {
  const [role, setRole] = useState('student');
  const [selectedFeature, setSelectedFeature] = useState(''); 
  const handleFeatureSelect = (feature) => {
    setSelectedFeature(feature);
  };

  return (
    <div className={`container2 ${role === 'parent' ? 'parent-role' : ''}`}>
      <Navbar role={role} onFeatureSelect={handleFeatureSelect} /> {}
      <RoleSwitcher currentRole={role} onRoleChange={setRole} />

      {role === 'parent' && selectedFeature === 'Schedule Meeting' ? (
        <ScheduleMeeting />
      ) : role === 'parent' ? (
        <ProgressReport /> 
      ) : null}
=======
import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar/Navbar'
import './Lander.css'
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Firebase Auth

const Lander = () => {
  const [role, setRole] = useState('');
  const [theme, setTheme] = useState('light');
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Firestore and Auth initialization
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const fetchUserRole = async (uid) => {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const userType = userData.type;

        // Map user type to role
        const roleMapping = {
          1: 'student',
          2: 'teacher',
          3: 'parent',
          4: 'admin',
        };

        setRole(roleMapping[userType] || 'student');
      } else {
        console.error("No such user!");
      }
    };

    // Listen for authentication state changes
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, get the UID
        const uid = user.uid;
        fetchUserRole(uid);
      } else {
        console.error("No user is signed in");
      }
    });
  }, [auth, db]);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const getSectionOptions = () => {
    switch (role) {
      case 'student':
        return ['Learning Platform', 'Financial Aid', 'Student Support', 'Dashboard'];
      case 'parent':
        return ['Learning Platform', 'Statistical Report', 'Parental Portal'];
      case 'teacher':
        return ['Learning Platform', 'Quiz Creation', 'Uploading of Study Material', 'Student Dashboard'];
      case 'admin':
        return ['Statistical Report', 'Manage Users', 'View and Approve Applications', 'Delete User'];
      default:
        return [];
    }
  };

  const handleSectionClick = (section) => {
    alert('Clicked on: ' + section);
    setDropdownOpen(false);
  };

  return (
    <div className={`container2 ${theme}`}>
      <Navbar theme={theme} setTheme={setTheme} role={role} />
      <header>
        <button onClick={toggleDropdown} className="dropdown-toggle">
          Sections
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            {getSectionOptions().map((section, index) => (
              <button key={index} onClick={() => handleSectionClick(section)}>
                {section}
              </button>
            ))}
          </div>
        )}
      </header>
      <main>
        <p>Content for role: {role}</p>
      </main>
>>>>>>> 852204d24ca1c1a6d31bb98654164afd86bb3b38
    </div>
  );
};

export default Lander;
