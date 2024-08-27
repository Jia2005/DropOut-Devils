import React, { useState } from 'react';
import './lander.css'; // Ensure you have CSS for styling
import Navbar from './Components/Navbar/Navbar';
import RoleSwitcher from './Components/RoleSwitcher';

const Lander = () => {
  const [role, setRole] = useState('student'); // Default role
  const [theme, setTheme] = useState('light'); // Default theme
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

  return React.createElement(
    'div',
    { className: `container ${theme}` },
    React.createElement(Navbar, { theme, setTheme, role }),
    React.createElement(RoleSwitcher, { currentRole: role, onRoleChange: setRole }),
    React.createElement(
      'header',
      null,
      React.createElement(
        'button',
        { onClick: toggleDropdown, className: 'dropdown-toggle' },
        'Sections'
      ),
      isDropdownOpen &&
        React.createElement(
          'div',
          { className: 'dropdown-menu' },
          getSectionOptions().map((section, index) =>
            React.createElement(
              'button',
              { key: index, onClick: () => handleSectionClick(section) },
              section
            )
          )
        )
    ),
    React.createElement(
      'main',
      null,
      React.createElement('p', null, 'Content for role: ' + role)
    )
  );
};

export default Lander;
