import React, { useState } from 'react';
import './Navbar.css'; // Ensure you have CSS for styling
import main_logo from '../../assets/main-logo.png';
import search_icon from '../../assets/search.png';
import notification_icon from '../../assets/notification.png'; // Add notification icon path
import profile_icon from '../../assets/profile.png'; // Add profile icon path

const Navbar = ({ role }) => {
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

  return React.createElement('div', { className: 'navbar' },
    React.createElement('div', { className: 'navbar-left' },
      React.createElement('img', { src: main_logo, alt: 'Main Logo', className: 'logo' })
    ),
    React.createElement('div', { className: 'navbar-center' },
      React.createElement('ul', { className: 'navbar-menu' },
        React.createElement('li', { className: 'navbar-item pd' }, 'Home'),
        React.createElement('li', { className: 'navbar-item pd' }, 'About'),
        React.createElement('li', { className: 'navbar-item dropdown' },
          React.createElement('button', { onClick: toggleDropdown, className: 'dropdown-toggle' },
            'Features'
          ),
          isDropdownOpen && React.createElement('div', { className: 'dropdown-menu' },
            getSectionOptions().map((section, index) =>
              React.createElement('button', { key: index, onClick: () => alert('Clicked on: ' + section), className: 'dropdown-item' },
                section
              )
            )
          )
        ),
        React.createElement('li', { className: 'navbar-item pd' }, 'Contact')
      )
    ),
    React.createElement('div', { className: 'navbar-right' },
      React.createElement('img', { src: notification_icon, alt: 'Notifications', className: 'notification-icon' }),
      React.createElement('img', { src: profile_icon, alt: 'Profile', className: 'profile-icon' }),
      React.createElement('img', { src: search_icon, alt: 'Search', className: 'search-icon' })
    )
  );
};

export default Navbar;
