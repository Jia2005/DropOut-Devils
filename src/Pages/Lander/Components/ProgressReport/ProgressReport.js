import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import './ProgressReport.css';

const ProgressReport = () => {
  const [role, setRole] = useState('parent');
  const [theme, setTheme] = useState('light');
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const db = getFirestore(); 
  const auth = getAuth(); 

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const user = auth.currentUser; 
        if (user) {
          const userUID = user.uid; 

          const userDocRef = doc(db, "users", userUID);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userEmail = userDocSnap.data().childEmail; 

            const studentDocRef = doc(db, "students", userEmail);
            const studentDocSnap = await getDoc(studentDocRef);

            if (studentDocSnap.exists()) {
              setStudentData(studentDocSnap.data()); 
            } else {
              setError("No student data found.");
            }
          } else {
            setError("No user data found.");
          }
        } else {
          setError("User not logged in.");
        }
      } catch (error) {
        setError("Error fetching student data.");
      } finally {
        setLoading(false); 
      }
    };

    fetchStudentData(); 
  }, [auth, db]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>{error}</div>; 
  }

  if (!studentData) {
    return <div>No data found for this student.</div>; 
  }

  const attendancePercentage = studentData.attendance.percentage;

  const pieData = {
    labels: ['Attended', 'Absent'],
    datasets: [
      {
        data: [attendancePercentage, 100 - attendancePercentage],
        backgroundColor: ['#28a745', '#dc3545'],
        borderColor: ['#fff', '#fff'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="progress-report">
      <br></br>
      <h2 style={{fontSize:'40px'}}>Progress Report for {studentData.name}</h2>
      <p><strong>Name:</strong> {studentData.name}</p>
      <p><strong>Class:</strong> {studentData.class}</p>
      <p><strong>Roll No:</strong> {studentData.rollNo}</p>
      <p><strong>Email:</strong> {studentData.email}</p>
      <p><strong>School:</strong> {studentData.school}</p>
      <p><strong>Overall Grade:</strong> {studentData.overallGrade}</p>

      <h2>Subjects</h2>
      <div className="subjects-container">
      {studentData.subjects.map((subject, index) => (
        <div key={index} className="subject-card">
          <h3>{subject.name}</h3>
          <p><strong>Semester 1:</strong> {subject.semester1}</p>
          <p><strong>Semester 2:</strong> {subject.semester2}</p>
        </div>
      ))}
    </div>
      
    
      <div className="attendance-summary">
        <h2>Attendance Summary</h2>
          <div className='attendance-row'>
            <div className="attendance-summary-container">
              <p><strong>Year:</strong> {studentData.attendance.year}</p>
              <p><strong>Month:</strong> {studentData.attendance.month}</p>
              <p><strong>Total Days:</strong> {studentData.attendance.totalDays}</p>
              <p><strong>Attended Days:</strong> {studentData.attendance.attendedDays}</p>
              <p><strong>Attendance Percentage:</strong> {studentData.attendance.percentage}%</p>
            </div>

        <div className="chart-container">
          <Pie data={pieData} />
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProgressReport;
