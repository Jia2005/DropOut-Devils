import React, { useEffect, useState } from 'react';  
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';  
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';  
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  
import { faUserCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';   
import './Profile.css';  
import { Link } from 'react-router-dom';
import LP_Landing from '../Learning_Platform/LP_Landing';
import Form from '../financial-aid-form/form';
import TrackYourApplication from '../financial-aid-form/trackYourApplication';
import CreateQuizPage from '../Quiz/Createquiz';
import TeacherLanding from '../Learning_Platform/TeacherSection/TeacherLanding';
import ProgressReport from '../Lander/Components/ProgressReport/ProgressReport';
import ScheduleMeeting from '../Lander/Components/ScheduleMeeting/ScheduleMeeting';
import ApplicationReviewPage from '../financial-aid-form/ApplicationReviewPage';
import FundsDisbursementPage from '../financial-aid-form/FundsDisbursement';
import TeacherInput from '../Teacher-input/TeacherInput';
import Enrollment from '../Enrollment/Enrollment'

const UserProfile = ({setComponent}) => {  
  const auth = getAuth();  
  const db = getFirestore();  
  const storage = getStorage();  

  const [user, setUser] = useState(null);  
  const [profilePic, setProfilePic] = useState('');  
  const [name, setName] = useState('');  
  const [age, setAge] = useState('');  
  const [email, setEmail] = useState('');  
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('');  
  const [role, setRole] = useState('');  
  const [file, setFile] = useState(null);  
  const [isEditing, setIsEditing] = useState(false); 
  const [selectedComponent, setSelectedComponent] = useState('Home');

  const handleMenuClick = (componentName) => {
    setSelectedComponent(componentName);
  };

  const renderSelectedComponent = (component) => {
    switch (component) {
      case 'Main_Home':
      case 'LP_Landing':
        return <LP_Landing />;
      case 'Financial Aid':
        return <Form/>
      case 'TrackYourApplication':
        return <TrackYourApplication />;
      case 'CreateQuizPage':
        return <CreateQuizPage />;
      case 'TeacherLanding':
        return <TeacherLanding />;
      case 'TeacherInput':
        return <TeacherInput/>;
      case 'ProgressReport':
        return <ProgressReport />;
      case 'ScheduleMeeting':
        return <ScheduleMeeting />;
      case 'ApplicationReviewPage':
        return <ApplicationReviewPage />;
      case 'FundsDisbursementPage':
        return <FundsDisbursementPage />;
      case 'Enrollment':
        return <Enrollment />;
      default:
        return <div>Home</div>;

    }
  };

  const renderSidebarMenu = () => {
    const menuItems = {
      Student: [
        { text: 'Home', component: 'Main_Home' },
        { text: 'Learning Platform', component: 'LP_Landing' },
        { text: 'Financial Aid', component: 'Financial Aid' }, // Form component heres
        { text: 'Track Your Application', component: 'TrackYourApplication' },
        { text: 'Enrollment into course', component: 'Enrollment' },
        { text: 'Change Password', component: '' },
      ],
      Teacher: [
        { text: 'Home', component: 'TeacherLanding' },
        { text: 'Learning Platform', component: 'TeacherLanding' },
        { text: 'Quiz Creation', component: 'CreateQuizPage' },
        { text: 'Create Student Report', component: 'TeacherInput' },
        { text: 'Change Password', component: '' },
      ],
      Parent: [
        { text: 'Home', component: 'Main_Home' },
        { text: 'Learning Platform', component: 'LP_Landing' },
        { text: 'Progress Report', component: 'ProgressReport' },
        { text: 'Interact with Teacher', component: 'ScheduleMeeting' },
        { text: 'Change Password', component: '' },
      ],
      Admin: [
        { text: 'Home', component: 'ApplicationReviewPage' },
        { text: 'View and Approve Applications', component: 'ApplicationReviewPage' },
        { text: 'Approve Funds', component: 'FundsDisbursementPage' },
        { text: 'Statistical Report', component: '' },
        { text: 'Manage Users', component: '' },
        { text: 'Change Password', component: '' },
      ]
    };
  
    return (
      <ul>
        {menuItems[role]?.map((item, index) => (
          <li key={index} className="center profile-li" onClick={() => setComponent(renderSelectedComponent(item.component))}>
            <Link to="/home">{item.text}</Link>
          </li>
        )) || <li className="center">Home</li>}
      </ul>
    );
  };

  useEffect(() => {  
    const unsubscribe = onAuthStateChanged(auth, async (user) => {  
      if (user) {  
        const userRef = doc(db, 'users', user.uid);  
        const userDoc = await getDoc(userRef);  

        if (userDoc.exists()) {  
          const userData = userDoc.data();  
          setUser(user);  
          setName(userData.name);  
          setAge(userData.age);  
          setEmail(userData.email);  
          setPhone(userData.phone);  
          setCourse(userData.EnrolledCourse);
          
          // Set role based on the type  
          setRole(mapRole(userData.type));  

          if (userData.profilePic) {  
            const profilePicUrl = await getDownloadURL(ref(storage,`profile_pictures/${user.uid}`));  
            setProfilePic(profilePicUrl);  
          }  
        }  
      }  
    });  

    return () => unsubscribe();  
  }, [auth, db, storage]);  

  const mapRole = (roleNumber) => {  
    switch (roleNumber) {  
      case 1: return 'Student';  
      case 2: return 'Teacher';  
      case 3: return 'Parent';  
      case 4: return 'Admin';  
      default: return 'Unknown';  
    }  
  };  

  const handleSignOut = () => {
    signOut(auth).then(() => {
      window.location.href = '/login';
    }).catch((error) => {
      alert('There are some server issues');
    });
  };

  const handleFileChange = (e) => {  
    setFile(e.target.files[0]);  
  };  

  const handleUpload = async () => {  
    if (file) {  
      const storageRef = ref(storage, `profile_pictures/${user.uid}`);  
      await uploadBytes(storageRef, file);  
      const profilePicUrl = await getDownloadURL(storageRef);  
      setProfilePic(profilePicUrl);  
      const userRef = doc(db, 'users', user.uid);  
      await updateDoc(userRef, { profilePic: profilePicUrl });  
    }  
  };  

  const handleDeleteProfilePic = async () => {  
    if (profilePic) {  
      const storageRef = ref(storage, `profile_pictures/${user.uid}`);  
      await deleteObject(storageRef);  
      setProfilePic('');  

      const userRef = doc(db, 'users', user.uid);  
      await updateDoc(userRef, { profilePic: '' });  
    }  
  };  

  const handleEdit = () => {  
    setIsEditing(true);  
  };  

  const handleSave = async () => {  
    const userRef = doc(db, 'users', user.uid);  
    await updateDoc(userRef, {  
      name,  
      age,  
      email,  
      phone,
      course,
    });  
    setIsEditing(false);  
  };  

  return (
    <div className="profile-container">
      <div className="sidebar this">
        <div>
          <div className="profile-pic">
            {profilePic ? (
              <>
                <img src={profilePic} alt="Profile" className="circular-pic" />
                <button className="delete-pic-btn" onClick={handleDeleteProfilePic}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </>
            ) : (
              <FontAwesomeIcon icon={faUserCircle} size="9x" />
            )}
          </div>
          <div className="profile-name">
            {name}
          </div>
          <hr className="sidebar-divider" />
          <div className="sidebar-menu">
            {renderSidebarMenu()}
          </div>
          <div className='log'>
          <button className="logout-button" onClick={handleSignOut}>Logout</button></div>
        </div>
      </div>
      <div className="profile-details">
        <div className="detail-block-container">
          <h2>Profile Details</h2>
          <div className="detail-block">
            <p><strong>Name:</strong> {isEditing ? <input type="text" value={name} onChange={(e) => setName(e.target.value)} /> : name}</p>
          </div>
          <div className="detail-block">
            <p><strong>Age:</strong> {isEditing ? <input type="number" value={age} onChange={(e) => setAge(e.target.value)} /> : age}</p>
          </div>
          <div className="detail-block">
            <p><strong>Email:</strong> {isEditing ? <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /> : email}</p>
          </div>
          <div className="detail-block">
            <p><strong>Phone No.:</strong> {isEditing ? <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /> : phone}</p>
          </div>
          <div className="detail-block">
            <p><strong>Role:</strong> {role} </p>
          </div>
          <div className="detail-block">
            <p><strong>Enrolled Course:</strong> {isEditing ? <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} /> : course}</p>
          </div>
          <div className='upload-image'>
            <input type="file" onChange={handleFileChange} />
          </div><br></br>
          <button className='upload-image-btn' onClick={handleUpload}>Upload Profile Picture</button>
          <div className="profile-action-buttons">
            <button className="edit-button" onClick={handleEdit} style={{position: 'relative', bottom: '-20px'}}>Edit Profile</button>
            <button className="save-button" onClick={handleSave} style={{position: 'relative', bottom: '-20px', float: 'right'}}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;