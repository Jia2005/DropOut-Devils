<<<<<<< HEAD
import React from 'react';
import './ProgressReport.css'; // Ensure you have CSS for styling the report

const ProgressReport = () => {
  return (
    <div className="progress-report">
      <div className="header">
        <div>
          <p>Name of Student: <strong>Devonte Smith</strong></p>
          <p>Section: <strong>Section 23</strong></p>
        </div>
        <div>
          <p>Grading Period: <strong>Semester 2</strong></p>
          <p>Standard:  <strong>8</strong></p>
        </div>
      </div>

      <table className="subjects-table">
        <thead>
          <tr>
            <th>SUBJECT</th>
            <th>SEMESTER 1</th>
            <th>SEMESTER 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Math</td>
            <td>76</td>
            <td>81</td>
          </tr>
          <tr>
            <td>Physical Education</td>
            <td>86</td>
            <td>84</td>
          </tr>
          <tr>
            <td>Visual Arts</td>
            <td>82</td>
            <td>89</td>
          </tr>
          <tr>
            <td>Chemistry</td>
            <td>74</td>
            <td>82</td>
          </tr>
          <tr>
            <td>Physics</td>
            <td>81</td>
            <td>78</td>
          </tr>
          <tr>
            <td>Sports Science</td>
            <td>74</td>
            <td>78</td>
          </tr>
          <tr>
            <td>Medieval History</td>
            <td>82</td>
            <td>87</td>
          </tr>
        </tbody>
      </table>

      
      <table className="subjects-table">
        <thead>
          <tr>
            <th>ATTENDANCE</th>
            <th>This month</th>
            <th>Previous month</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Days of school</td>
            <td>23</td>
            <td>24</td>
          </tr>
          <tr>
            <td>Days attended</td>
            <td>16</td>
            <td>12</td>
          </tr>
          <tr>
            <td>Days absent</td>
            <td>12</td>
            <td>10</td>
          </tr>
          
        </tbody>
      </table>
      <div className="overall-grade">
        <h3>OVERALL GRADE</h3>
        <p>85.5</p>
        <p>Previous year's grade: 82.4</p>
      </div>

      <div className="notes">
        <h3>Notes:</h3>
        <p>
          Devonte is a bright and engaged student. He learns things very quickly, has a great work ethic, and
          approaches problems in a creative way. He is a great communicator as well. However, he needs to balance his
          interests in order to better apply himself evenly across all his subjects. As he gets interested in one topic,
          he tends to neglect others. While he is still a high performer, if he can manage his focus, his potential is great.
        </p>
      </div>

      <div className="grading-system">
        <h3>Grading system:</h3>
        <p>A+: 95-100 | A: 91-94 | A-: 85-90</p>
        <p>B+: 81-84 | B: 77-80 | B-: 74-79</p>
        <p>C+: 70-73 | C: 66-69 | C-: 60-65</p>
        <p>D: 51-59</p>
        <p>F: &lt;50</p>
=======
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
>>>>>>> 852204d24ca1c1a6d31bb98654164afd86bb3b38
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default ProgressReport;
=======
export default ProgressReport;
>>>>>>> 852204d24ca1c1a6d31bb98654164afd86bb3b38
