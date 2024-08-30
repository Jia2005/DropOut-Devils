import React, { useState } from 'react';  
import './Navbar.css';   
import { useNavigate } from 'react-router-dom'; // Updated import
import main_logo from '../../assets/main-logo.png';  
import search_icon from '../../assets/search.png';  
import notification_icon from '../../assets/notification.png';   
import profile_icon from '../../assets/profile.png';   

const Navbar = ({ role }) => {  
  const [isDropdownOpen, setDropdownOpen] = useState(false);  
  const navigate = useNavigate(); // Updated to use react-router-dom's navigate
  const toggleDropdown = () => {  
    setDropdownOpen(prevState => !prevState);  
  };  

  const getSectionOptions = () => {  
    switch (role) {  
      case 'student':  
        return [  
          { name: 'Learning Platform', path: '/learnplatform' },  
          { name: 'Financial Aid', path: '/form' },  
          { name: 'Track Your Application', path: '/trackYourApplication' },  
          { name: 'Dashboard', path: '/' }  
        ];  
      case 'parent':  
        return [  
          { name: 'Learning Platform', path: '/learnplatform' },  
          { name: 'Statistical Report', path: '/progressreport' },  
          { name: 'Parental Portal', path: '/' }  
        ];  
      case 'teacher':  
        return [  
          { name: 'Learning Platform', path: '/teacherlanding' },  
          { name: 'Quiz Creation', path: '/quiz' },   
          { name: 'Student Dashboard', path: '/' }  
        ];  
      case 'admin':  
        return [  
          { name: 'Statistical Report', path: '/' },  
          { name: 'Manage Users', path: '/' },  
          { name: 'View and Approve Applications', path: '/applicationReview' },  
          { name: 'Approve Funds', path: '/Funds' }, 
          { name: 'Delete User', path: '/' }  
        ];  
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
                    onClick={() => navigate(section.path)} // Navigate to the respective route
                    className='dropdown-item'  
                  >  
                    {section.name}  
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
        <img src={profile_icon} onClick={() => navigate('/profile')} alt='Profile' className='profile-icon' />  
        <img src={search_icon} alt='Search' className='search-icon' />  
      </div>  
    </div>  
  );  
};  

export default Navbar;