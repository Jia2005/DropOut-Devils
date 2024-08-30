import React, { useState } from 'react';
import Navbar from "../Navbar/Navbar";
import "./ProgressReport.css";

const ProgressReport = () => {
    const [role, setRole] = useState('student');
    const [theme, setTheme] = useState('light');
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => {
      setDropdownOpen(!isDropdownOpen);
    }
  const studentData = {
    name: "John Doe",
    class: "10th Grade",
    rollNo: "23",
    school: "Green Valley High School",
    overallGrade: "A",
    subjects: [
      { name: "Math", semester1: 85, semester2: 88 },
      { name: "English", semester1: 78, semester2: 80 },
      { name: "Science", semester1: 82, semester2: 85 },
      { name: "History", semester1: 75, semester2: 79 },
    ],
    behaviorRemarks: "John is a well-behaved and responsible student.",
    attendance: {
      totalDays: 180,
      attendedDays: 170,
      percentage: "94.4%",
    },
  };

  return (
    <div className="progress-report">
        <Navbar theme={theme} setTheme={setTheme} role={role} />
      <h1>Student Progress Report</h1>
      <div className="student-details">
        <p><strong>Name:</strong> {studentData.name}</p>
        <p><strong>Class:</strong> {studentData.class}</p>
        <p><strong>Roll No:</strong> {studentData.rollNo}</p>
        <p><strong>School:</strong> {studentData.school}</p>
        <p><strong>Overall Grade:</strong> {studentData.overallGrade}</p>
      </div>

      <div className="marks-section">
        <h2>Marks Summary</h2>
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Semester 1</th>
              <th>Semester 2</th>
            </tr>
          </thead>
          <tbody>
            {studentData.subjects.map((subject, index) => (
              <tr key={index}>
                <td>{subject.name}</td>
                <td>{subject.semester1}</td>
                <td>{subject.semester2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="remarks-section">
        <h2>Teacher's Remarks</h2>
        <p>{studentData.behaviorRemarks}</p>
      </div>

      <div className="attendance-section">
        <h2>Attendance Summary</h2>
        <p><strong>Total Days:</strong> {studentData.attendance.totalDays}</p>
        <p><strong>Days Attended:</strong> {studentData.attendance.attendedDays}</p>
        <p><strong>Attendance Percentage:</strong> {studentData.attendance.percentage}</p>
      </div>
    </div>
  );
};

export default ProgressReport;
