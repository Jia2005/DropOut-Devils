import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../../../firebase';
import './ScheduleMeeting.css';

const ScheduleMeeting = () => {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [Email, setParentEmail] = useState('');
  const [childEmail, setChildEmail] = useState('');

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const usersQuery = query(collection(db, 'users'), where('email', '==', user.email), where('type', '==', 3));
          const querySnapshot = await getDocs(usersQuery);
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setChildEmail(userData.childEmail || '');
            setParentEmail(user.email || '');
          } else {
            alert("User information could not be retrieved.");
          }
        } else {
          alert("No user is currently signed in.");
        }
      } catch (error) {
        console.error("Error retrieving emails: ", error);
      }
    };

    fetchEmails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be signed in to schedule a meeting.");
        return;
      }
  
      console.log('User:', user.email);
      console.log('Teacher Email:', teacherEmail);
  
      // Check if teacher exists
      const usersQuery = query(collection(db, 'users'), where('email', '==', teacherEmail), where('type', '==', 2));
      const querySnapshot = await getDocs(usersQuery);
  
      if (querySnapshot.empty) {
        alert("Teacher not found or the provided email does not belong to a teacher.");
        return;
      }
  
      // Create meeting document
      const meetingData = {
        date,
        timeSlot,
        teacherEmail,
        Email: user.email,
        childEmail,
        requestAccepted: false,
        meetingDone: false,
        meetingRemarks: '',
      };
  
      console.log('Meeting Data:', meetingData);
      const docRef = await addDoc(collection(db, 'meetings'), meetingData);
      console.log('Meeting Document ID:', docRef.id);
  
      // Create notification document
      const notificationData = {
        teacherEmail,
        Email: user.email,
        message: `New meeting request for ${date} during ${timeSlot} from ${user.email}.`,
        read: false,
        timestamp: new Date(),
        meetingId: docRef.id,
        type: 'meeting_request',
      };
  
      console.log('Notification Data:', notificationData);
      await addDoc(collection(db, 'notifications'), notificationData);
  
      console.log("Meeting request and notification created successfully");
      alert(`You will hear shortly about your request for a meeting on ${date} during ${timeSlot}`);
  
      setDate('');
      setTimeSlot('');
      setTeacherEmail('');
    } catch (error) {
      console.error("Error scheduling the meeting: ", error);
      alert("There was an error scheduling your meeting. Please try again.");
    }
  };
  
  return (
    <div className="schedule-meeting-container">
      <h2>Schedule a Meeting</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">Preferred Date:</label>
          <input
            className='date'
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="timeSlot">Preferred Time Slot:</label>
          <select
            id="timeSlot"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            required
          >
            <option value="" disabled>Select a time slot</option>
            <option value="9:00-11:00">9:00-11:00</option>
            <option value="12:00-15:00">12:00-15:00</option>
            <option value="16:00-19:00">16:00-19:00</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="teacherEmail">Teacher's Email:</label>
          <input
            type="email"
            id="teacherEmail"
            value={teacherEmail}
            onChange={(e) => setTeacherEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className='meeting'>Request for a Meeting</button>
      </form>
    </div>
  );
};

export default ScheduleMeeting;