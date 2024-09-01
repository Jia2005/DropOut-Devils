import React, { useState } from 'react';  
import './Navbar.css';   
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 
import main_logo from '../../assets/main-logo.png';  
import search_icon from '../../assets/search.png';  
import notification_icon from '../../assets/notification.png';   
import profile_icon from '../../assets/profile.png';   
import LP_Landing from '../../../Learning_Platform/LP_Landing';
import Form from '../../../financial-aid-form/form';
import TrackYourApplication from '../../../financial-aid-form/trackYourApplication';
import Main from '../../../../main';
import ProgressReport from '../ProgressReport/ProgressReport';
import ScheduleMeeting from '../ScheduleMeeting/ScheduleMeeting';
import TeacherLanding from '../../../Learning_Platform/TeacherSection/TeacherLanding';
import CreateQuizPage from '../../../Quiz/Createquiz';
import ApplicationReviewPage from '../../../financial-aid-form/ApplicationReviewPage';
import FundsDisbursementPage from '../../../financial-aid-form/FundsDisbursement';
import TeacherInput from '../../../Teacher-input/TeacherInput';

const Navbar = ({ role, setComponent }) => {  
  const [isDropdownOpen, setDropdownOpen] = useState(false);  
  const navigate = useNavigate(); // Updated to use react-router-dom's navigate
  const toggleDropdown = () => {  
    setDropdownOpen(prevState => !prevState);  
  };  

  const getSectionOptions = () => {  
    switch (role) {  
      case 'student':  
        return [  
          { name: 'Dashboard', component: <Main/> },
          { name: 'Learning Platform', component: <LP_Landing/> },  
          { name: 'Financial Aid', component: <Form/> },  
          { name: 'Track Your Application', component: <TrackYourApplication/> },  
        ];  
      case 'parent':  
        return [  
          { name: 'Parent Dashboard', component: <Main />},
          { name: 'Learning Platform', component: <LP_Landing/> },  
          { name: 'Progress Report', component: <ProgressReport/> },  
          { name: 'Interact With Teacher', component: <ScheduleMeeting/> }  
        ];  
      case 'teacher':  
        return [  
          { name: 'Student Dashboard', component: <Main/> },  
          { name: 'Learning Platform', component: <TeacherLanding/> },  
          { name: 'Quiz Creation', component: <CreateQuizPage/> },   
          { name: 'Create Student Report', component: <TeacherInput/> }, 
        ];  
      case 'admin':  
        return [  
          { name: 'Statistical Report', component: <Main/> },  
          { name: 'Manage Users', component: <Main/> },  
          { name: 'View and Approve Applications', component: <ApplicationReviewPage/> },  
          { name: 'Approve Funds', component: <FundsDisbursementPage/> }, 
          { name: 'Delete User', component: <Main/> }  
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
          <li className='navbar-item'><Link to="/home">Home</Link></li>  
          <li className='navbar-item'>About</li>  
          <li className='navbar-item dropdown'>  
            <div onMouseEnter={toggleDropdown} className='dropdown-toggle'>Features</div>  
            {isDropdownOpen && (  
              <div className='dropdown-menu' onMouseLeave={toggleDropdown} >  
                {getSectionOptions().map((section, index) => (  
                  <button  
                    key={index}  
                    onClick={() => setComponent(section.component)} // Navigate to the respective route
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
