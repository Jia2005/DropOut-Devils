import React, { useState } from 'react';
import './Navbar.css';
import { useNavigate, Link, Router } from 'react-router-dom';
import main_logo from './../../../LandingPage/assets/academic.png';
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
import Notifications from './Notifications';
import About from '../About/About';
import ContactUs from '../Contact/ContactUs';
import Enrollment from '../../../Enrollment/Enrollment';
import Timetable from '../../../TimeTable/timetable';

const Navbar = ({ role, setComponent }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const getDefaultComponent = () => {
    switch (role) {
      case 'student':
      case 'parent':
        return <LP_Landing />;
      case 'teacher':
        return <TeacherLanding />;
      case 'admin':
        return <ApplicationReviewPage />;
      default:
        return null;
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState);
  };

  const getSectionOptions = () => {
    switch (role) {
      case 'student':
        return [
          { name: 'Learning Platform', component: <LP_Landing /> },
          { name: 'Enroll for Courses', component: <Enrollment/> },
          { name: 'Time Table', component: <Timetable /> },
          { name: 'Financial Aid', component: <Form /> },
          { name: 'Track Your Application', component: <TrackYourApplication /> }
        ];
      case 'parent':
        return [
          { name: 'Learning Platform', component: <LP_Landing /> },
          { name: 'Progress Report', component: <ProgressReport /> },
          { name: 'Interact With Teacher', component: <ScheduleMeeting /> }
        ];
      case 'teacher':
        return [
          { name: 'Learning Platform', component: <TeacherLanding /> },
          { name: 'Quiz Creation', component: <CreateQuizPage /> },
          { name: 'Create Student Report', component: <TeacherInput /> },
        ];
      case 'admin':
        return [
          { name: 'View and Approve Applications', component: <ApplicationReviewPage /> },
          { name: 'Approve Funds', component: <FundsDisbursementPage /> },
          { name: 'Statistical Report', component: <Main /> },
          { name: 'Manage Users', component: <Main /> },
        ];
      default:
        return [];
    }
  };

  return (
    <div className='navbar'>
      <div className='navbar-left'>
        <img src={main_logo} alt='Main Logo' className='logo' />
        <span className="navbar-logo-text">Studyee</span>
      </div>
      <div className='navbar-center'>
        <ul className='navbar-menu'>
          <li className='navbar-item' onClick={() => setComponent(getDefaultComponent())}>Home</li>
          <li className='navbar-item' onClick={() => setComponent(<About />)}>About</li>
          <li className='navbar-item dropdown'>
            <div onMouseEnter={toggleDropdown} className='dropdown-toggle'>Features</div>
            {isDropdownOpen && (
              <div className='dropdown-menu' onMouseLeave={toggleDropdown}>
                {getSectionOptions().map((section, index) => (
                  <button
                    key={index}
                    onClick={() => setComponent(section.component)}
                    className='dropdown-item'
                  >
                    {section.name}
                  </button>
                ))}
              </div>
            )}
          </li>
          { role == "student" && <li className='navbar-item' onClick={() => navigate('/comm')}>Community</li>}
          <li className='navbar-item' onClick={() => setComponent(<ContactUs />)}>Contact</li>
        </ul>
      </div>
      <div className='navbar-right'>
        <img src={notification_icon} onClick={() => setComponent(<Notifications onReschedule={() => setComponent(<ScheduleMeeting />)} />)} alt='Notifications' className='notification-icon' />
        <img src={profile_icon} onClick={() => navigate('/profile')} alt='Profile' className='profile-icon' />
        <img src={search_icon} alt='Search' className='search-icon' />
      </div>
    </div>
  );
};

export default Navbar;
