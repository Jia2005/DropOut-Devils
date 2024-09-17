import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar/Navbar';
import './Lander.css';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Notifications from './Components/Navbar/Notifications';
import LP_Landing from '../Learning_Platform/LP_Landing';
import TeacherLanding from '../Learning_Platform/TeacherSection/TeacherLanding';
import ApplicationReviewPage from '../financial-aid-form/ApplicationReviewPage';

const Lander = ({ component, setComponent }) => {
  const [role, setRole] = useState('');
  const [theme, setTheme] = useState('light');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [defaultComponent, setDefaultComponent] = useState(null);

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const fetchUserRole = async (uid) => {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const userType = userData.type;

        const roleMapping = {
          1: 'student',
          2: 'teacher',
          3: 'parent',
          4: 'admin',
        };

        const userRole = roleMapping[userType] || 'student';
        setRole(userRole);

        switch (userRole) {
          case 'student':
          case 'parent':
            setDefaultComponent(<LP_Landing />);
            break;
          case 'teacher':
            setDefaultComponent(<TeacherLanding />);
            break;
          case 'admin':
            setDefaultComponent(<ApplicationReviewPage />);
            break;
          default:
            setDefaultComponent(null);
        }
      } else {
        console.error('No such user!');
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        fetchUserRole(uid);
      } else {
        console.error('No user is signed in');
      }
    });
  }, [auth, db]);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const getSectionOptions = () => {
    switch (role) {
      case 'student':
        return ['Learning Platform','Time Table', 'Financial Aid', 'Student Support', 'Dashboard'];
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
      <Navbar 
        theme={theme} 
        setTheme={setTheme} 
        role={role} 
        setComponent={setComponent} 
        onNotificationClick={handleNotificationClick}
      />
      <header>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            {getSectionOptions().map((section, index) => (
              <button key={index} onClick={() => handleSectionClick(section)}>
                {section}
              </button>
            ))}
          </div>
        )}
      </header><br />
      <main>
        {component || defaultComponent}
        {showNotifications && (
          <div className="notifications-container">
            <Notifications /> 
          </div>
        )}
      </main>
    </div>
  );
};

export default Lander;
