import React, { useState } from 'react';  
import './Navbar.css';   
import { Navigate, useNavigate } from 'react-router-dom';
import main_logo from '../../assets/main-logo.png';  
import search_icon from '../../assets/search.png';  
import notification_icon from '../../assets/notification.png';   
import profile_icon from '../../assets/profile.png';   

const Navbar = ({ role }) => {  
  const [isDropdownOpen, setDropdownOpen] = useState(false);  
  const navigate = useNavigate();
  const toggleDropdown = () => {  
    setDropdownOpen(prevState => !prevState);  
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

  return (  
    <div className='navbar'>  
      <div className='navbar-left'>  
        <img src={main_logo} alt='Main Logo' className='logo' />  
      </div>  
      <div className='navbar-center'>  
        <ul className='navbar-menu'>  
          <li className='navbar-item'>Home</li>  
          <li className='navbar-item'>About</li>  
          <li className='navbar-item dropdown'>  
            <div onMouseEnter={toggleDropdown} className='dropdown-toggle'>Features</div>  
            {isDropdownOpen && (  
              <div className='dropdown-menu' onMouseLeave={toggleDropdown} >  
                {getSectionOptions().map((section, index) => (  
                  <button  
                    key={index}  
                    onClick={() => alert('Clicked on: ' + section)}  
                    className='dropdown-item'  
                  >  
                    {section}  
                  </button>  
                ))}  
              </div>  
            )}  
          </li>  
          <li className='navbar-item'>Contact</li>  
        </ul>  
      </div>  
      <div className='navbar-right'>  
        <img src={notification_icon} alt='Notifications' className='notification-icon' />  
        <img src={profile_icon} onClick={()=>{navigate('/profile');}} alt='Profile' className='profile-icon' />  
        <img src={search_icon} alt='Search' className='search-icon' />  
      </div>  
    </div>  
  );  
};  

export default Navbar;