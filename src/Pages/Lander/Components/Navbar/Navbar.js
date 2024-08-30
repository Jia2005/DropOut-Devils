// src/components/Navbar/Navbar.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 
import main_logo from '../../assets/main-logo.png';
import search_icon from '../../assets/search.png';
import notification_icon from '../../assets/notification.png'; 
import profile_icon from '../../assets/profile.png';

const Navbar = ({ role, onFeatureSelect }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const getSectionOptions = () => {
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
                  </button>
                ))}
              </div>
            )}
          </li>
          <li className="navbar-item pd">Contact</li>
        </ul>
      </div>
      <div className="navbar-right">
        <img src={notification_icon} alt="Notifications" className="notification-icon" />
        <img src={profile_icon} alt="Profile" className="profile-icon" />
        <img src={search_icon} alt="Search" className="search-icon" />
      </div>
    </div>
  );
};

export default Navbar;
