// src/components/Navbar/Navbar.js

import React, { useState } from 'react';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
import './Navbar.css'; 
import main_logo from '../../assets/main-logo.png';
import search_icon from '../../assets/search.png';
import notification_icon from '../../assets/notification.png'; 
=======
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import main_logo from '../../assets/main-logo.png';
import search_icon from '../../assets/search.png';
import notification_icon from '../../assets/notification.png';
>>>>>>> 852204d24ca1c1a6d31bb98654164afd86bb3b38
import profile_icon from '../../assets/profile.png';

const Navbar = ({ role, onFeatureSelect }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState);
  };

  const sectionOptions = {
    student: [
      { name: 'Learning Platform', path: '/learnplatform' },
      { name: 'Financial Aid', path: '/form' },
      { name: 'Track Your Application', path: '/trackYourApplication' },
      { name: 'Student Support', path: '/' },
      { name: 'Dashboard', path: '/' }
    ],
    parent: [
      { name: 'Learning Platform', path: '/learnplatform' },
      { name: 'Statistical Report', path: '/progressreport' },
      { name: 'Parental Portal', path: '/' }
    ],
    teacher: [
      { name: 'Learning Platform', path: '/learnplatform' },
      { name: 'Quiz Creation', path: '/quiz' },
      { name: 'Uploading of Study Material', path: '/uploadref' },
      { name: 'Student Dashboard', path: '/' }
    ],
    admin: [
      { name: 'Statistical Report', path: '/' },
      { name: 'Manage Users', path: '/' },
      { name: 'View and Approve Applications', path: '/applicationReview' },
      { name: 'Delete User', path: '/' }
    ]
  };

  const getSectionOptions = () => {
<<<<<<< HEAD
    switch (role) {
      case 'student':
        return ['Learning Platform', 'Financial Support', 'Student Support', 'Dashboard'];
      case 'parent':
        return ['Learning Platform', 'Schedule Meeting'];
      case 'teacher':
        return ['Learning Platform', 'Quiz Creation', 'Uploading of Study Material', 'Student Dashboard'];
      case 'admin':
        return ['Statistical Report', 'Manage Users', 'View and Approve Applications', 'Delete User'];
      default:
        return [];
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={main_logo} alt="Main Logo" className="logo" />
      </div>
      <div className="navbar-center">
        <ul className="navbar-menu">
          <li className="navbar-item pd">Home</li>
          <li className="navbar-item pd">About</li>
          <li className="navbar-item dropdown">
            <button onClick={toggleDropdown} className="dropdown-toggle-item">
              Features
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {getSectionOptions().map((section, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onFeatureSelect(section); // Notify parent component of feature selection
                      setDropdownOpen(false); // Close dropdown after selection
                    }}
                    className="dropdown-item"
                  >
                    {section}
=======
    return sectionOptions[role] || [];
  };

  return (
    <div className='navbar'>
      <div className='navbar-left'>
        <img src={main_logo} alt='Main Logo' className='logo' />
      </div>
      <div className='navbar-center'>
        <ul className='navbar-menu'>
          <li className='navbar-item' onClick={() => navigate('/')}>Home</li>
          <li className='navbar-item' onClick={() => navigate('/about')}>About</li>
          <li
            className='navbar-item dropdown'
            onMouseEnter={toggleDropdown}
            onMouseLeave={toggleDropdown}
          >
            <div className='dropdown-toggle'>Features</div>
            {isDropdownOpen && (
              <div className='dropdown-menu'>
                {getSectionOptions().map((section, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(section.path)}
                    className='dropdown-item'
                  >
                    {section.name}
>>>>>>> 852204d24ca1c1a6d31bb98654164afd86bb3b38
                  </button>
                ))}
              </div>
            )}
          </li>
<<<<<<< HEAD
          <li className="navbar-item pd">Contact</li>
        </ul>
      </div>
      <div className="navbar-right">
        <img src={notification_icon} alt="Notifications" className="notification-icon" />
        <img src={profile_icon} alt="Profile" className="profile-icon" />
        <img src={search_icon} alt="Search" className="search-icon" />
=======
          <li className='navbar-item' onClick={() => navigate('/contact')}>Contact</li>
        </ul>
      </div>
      <div className='navbar-right'>
        <img src={notification_icon} alt='Notifications' className='notification-icon' />
        <img src={profile_icon} alt='Profile' className='profile-icon' onClick={() => navigate('/profile')} />
        <img src={search_icon} alt='Search' className='search-icon' />
>>>>>>> 852204d24ca1c1a6d31bb98654164afd86bb3b38
      </div>
    </div>
  );
};

export default Navbar;
