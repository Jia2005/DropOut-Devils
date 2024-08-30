import React, { useState, useEffect } from 'react';
import { auth,db } from '../../firebase';
import Navbar from './Components/Navbar/Navbar';
import './Lander.css';
import { doc, getDoc } from 'firebase/firestore';

const Lander = () => {
  const [role, setRole] = useState(1);
  const [theme, setTheme] = useState('light');
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setRole(userData.type); 
        } else {
          console.error('No such document!');
        }
      } else {
        console.error('No user is signed in');
      }
    };

    fetchUserRole();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const getSectionOptions = () => {
    switch (role) {
      case 1:
        return ['Learning Platform', 'Financial Support', 'Student Support', 'Dashboard'];
      case 2:
        return ['Learning Platform', 'Statistical Report', 'Parental Portal'];
      case 3:
        return ['Learning Platform', 'Quiz Creation', 'Uploading of Study Material', 'Student Dashboard'];
      case 4:
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
    </div>
  );
};

export default Lander;
