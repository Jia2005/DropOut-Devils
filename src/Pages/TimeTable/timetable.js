import React, { useState, useEffect } from 'react';
import './timetable.css';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const Timetable = () => {
  const [enrolledCourse, setEnrolledCourse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollmentData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const userId = user.email;
          const userDocRef = doc(db, 'students', userId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setEnrolledCourse(userDoc.data().enrolledCourse);
          }
        }
      } catch (error) {
        console.error("Error fetching user enrollment data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Full-Time Timetable
  const fullTimeTimetable = (
    <table className="timetable">
      <thead>
        <tr>
          <th>Day</th>
          <th>7:00 AM - 8:00 AM</th>
          <th>8:00 AM - 9:00 AM</th>
          <th>9:00 AM - 10:00 AM</th>
          <th>10:00 AM - 11:00 AM</th>
          <th>11:00 AM - 12:00 PM</th>
          <th>12:00 PM - 1:00 PM</th>
        </tr>
      </thead>
      <tbody>
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
          <tr key={day}>
            <td>{day}</td>
            <td>Math</td>
            <td>Physics</td>
            <td>Chemistry</td>
            <td>Computer Science</td>
            <td>English</td>
            <td>Biology</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Part-Time Timetable
  const partTimeTimetable = (
    <table className="timetable">
      <thead>
        <tr>
          <th>Day</th>
          <th>7:00 AM - 7:30 AM</th>
          <th>7:30 AM - 8:00 AM</th>
          <th>8:00 AM - 8:30 AM</th>
          <th>8:30 AM - 9:00 AM</th>
          <th>9:00 AM - 9:30 AM</th>
          <th>9:30 AM - 10:00 AM</th>
        </tr>
      </thead>
      <tbody>
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
          <tr key={day}>
            <td>{day}</td>
            <td>Physics</td>
            <td>Chemistry</td>
            <td>Computer Science</td>
            <td>Math</td>
            <td>Biology</td>
            <td>English</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Evening Classes Timetable
  const eveningClassesTimetable = (
    <table className="timetable">
      <thead>
        <tr>
          <th>Day</th>
          <th>6:00 PM - 6:40 PM</th>
          <th>6:40 PM - 7:20 PM</th>
          <th>7:20 PM - 8:00 PM</th>
          <th>8:00 PM - 8:40 PM</th>
          <th>8:40 PM - 9:20 PM</th>
          <th>9:20 PM - 10:00 PM</th>
        </tr>
      </thead>
      <tbody>
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
          <tr key={day}>
            <td>{day}</td>
            <td>Math</td>
            <td>Physics</td>
            <td>Chemistry</td>
            <td>Computer Science</td>
            <td>Biology</td>
            <td>English</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Determine which timetable to render
  let timetable;
  if (enrolledCourse === 'full-time') {
    timetable = fullTimeTimetable;
  } else if (enrolledCourse === 'part-time') {
    timetable = partTimeTimetable;
  } else if (enrolledCourse === 'evening-classes') {
    timetable = eveningClassesTimetable;
  } else {
    timetable = <p>You are not enrolled in any course.</p>;
  }

  return (
    <div className="timetable-container">
      <h1 className="timetable-title">Your Course Timetable</h1>
      {timetable}
    </div>
  );
};

export default Timetable;