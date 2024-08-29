import React, { useState } from 'react';
import Navbar from './Components/Navbar/Navbar'
import RoleSwitcher from './Components/RoleSwitcher';
import './Lander.css';

const Lander = () => {
  const [role, setRole] = useState('student');
  const [theme, setTheme] = useState('light');
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const getSectionOptions = () => {
    switch (role) {
      case 'student':
        return ['Learning Platform', 'Financial Support', 'Student Support', 'Dashboard'];
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
      <RoleSwitcher currentRole={role} onRoleChange={setRole} />
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
