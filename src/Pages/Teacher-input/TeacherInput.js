import React, { useState, useEffect } from 'react';
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import "./TeacherInput.css";

const TeacherInput = () => {
  const [role, setRole] = useState('teacher');
  const [theme, setTheme] = useState('light');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [actionType, setActionType] = useState("add");
  const [studentData, setStudentData] = useState({
    name: "",
    class: "",
    rollNo: "",
    email: "",
    school: "",
    overallGrade: "",
    year: "",
    subjects: [
      { name: "Math", semester1: "", semester2: "" },
      { name: "English", semester1: "", semester2: "" },
      { name: "Science", semester1: "", semester2: "" },
      { name: "History", semester1: "", semester2: "" },
    ],
    behaviorRemarks: "",
    attendance: {
      totalDays: "",
      attendedDays: "",
      percentage: "",
      year: "",
      month: "",
    },
  });

  const [lookupEmail, setLookupEmail] = useState("");
  const db = getFirestore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = studentData.subjects.map((subject, i) =>
      i === index ? { ...subject, [field]: value } : subject
    );
    setStudentData({ ...studentData, subjects: updatedSubjects });
  };

  const calculateAttendancePercentage = () => {
    const { totalDays, attendedDays } = studentData.attendance;
    if (totalDays && attendedDays) {
      if (parseInt(totalDays) === 0) {
        setStudentData({
          ...studentData,
          attendance: { ...studentData.attendance, percentage: "0.00" },
        });
        return;
      }
      const percentage = ((attendedDays / totalDays) * 100).toFixed(2);
      setStudentData({
        ...studentData,
        attendance: { ...studentData.attendance, percentage },
      });
    }
  };

  useEffect(() => {
    calculateAttendancePercentage();
  }, [studentData.attendance.totalDays, studentData.attendance.attendedDays]);

  const fetchStudentData = async () => {
    const docRef = doc(db, "students", lookupEmail);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      setStudentData(docSnap.data());
    } else {
      alert(`No student found with email ${lookupEmail}`);
      setStudentData({
        name: "",
        class: "",
        rollNo: "",
        email: "",
        school: "",
        overallGrade: "",
        year: "",
        subjects: [
          { name: "Math", semester1: "", semester2: "" },
          { name: "English", semester1: "", semester2: "" },
          { name: "Science", semester1: "", semester2: "" },
          { name: "History", semester1: "", semester2: "" },
        ],
        behaviorRemarks: "",
        attendance: {
          totalDays: "",
          attendedDays: "",
          percentage: "",
          year: "",
          month: "",
        },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const studentId = `${studentData.email}`;

    try {
      if (actionType === "add") {
        await setDoc(doc(db, "students", studentId), studentData);
        alert(`Success! ${studentData.email}'s Progress Report has been saved.`);
      } else if (actionType === "update") {
        const docRef = doc(db, "students", studentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          await setDoc(doc(db, "students", studentId), studentData, { merge: true });
          alert(`Success! ${studentData.name}'s Progress Report has been updated.`);
        } else {
          alert(`Error: No student found with email ${studentData.email}. Please add the student first.`);
        }
      }
      
      setStudentData({
        name: "",
        class: "",
        rollNo: "",
        email: "",
        school: "",
        overallGrade: "",
        year: "",
        subjects: [
          { name: "Math", semester1: "", semester2: "" },
          { name: "English", semester1: "", semester2: "" },
          { name: "Science", semester1: "", semester2: "" },
          { name: "History", semester1: "", semester2: "" },
        ],
        behaviorRemarks: "",
        attendance: {
          totalDays: "",
          attendedDays: "",
          percentage: "",
          year: "",
          month: "",
        },
      });
      setLookupEmail("");
    } catch (error) {
      console.error("Error saving student data: ", error);
      alert(`Error: Failed to save student data. ${error.message}`);
    }
  };

  return (
    <div className="teacher-input">
      <h2 style={{fontSize:'40px'}}>{actionType === "add" ? "Add Student Details" : "Update Student Records"}</h2><br></br>
      <div className="action-buttons">
        <button style={{fontSize:'20px'}} onClick={() => setActionType("add")} className={actionType === "add" ? "active" : ""}>Add Student</button>
        <button style={{fontSize:'20px'}} onClick={() => setActionType("update")} className={actionType === "update" ? "active" : ""}>Update Student Records</button>
      </div>

      {actionType === "update" && (
        <div className="form-group">
          <label style={{fontSize:'16px'}}>Enter Student Email to Fetch Data:</label>
          <input
            type="email"
            value={lookupEmail}
            onChange={(e) => setLookupEmail(e.target.value)}
          /><br></br><br></br>
          <button type="button" className='button-fd' onClick={fetchStudentData}>Fetch Data</button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={studentData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Class:</label>
          <input
            type="text"
            name="class"
            value={studentData.class}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Roll No:</label>
          <input
            type="text"
            name="rollNo"
            value={studentData.rollNo}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={studentData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>School:</label>
          <input
            type="text"
            name="school"
            value={studentData.school}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Overall Grade:</label>
          <input
            type="text"
            name="overallGrade"
            value={studentData.overallGrade}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Year:</label>
          <input
            type="text"
            name="year"
            value={studentData.year}
            onChange={handleInputChange}
            required
          />
        </div>

        <h2>Subjects</h2>
        {studentData.subjects.map((subject, index) => (
          <div key={index} className="form-group">
            <label>{subject.name}:</label>
            <input
              type="number"
              placeholder="Semester 1"
              value={subject.semester1}
              onChange={(e) => handleSubjectChange(index, "semester1", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Semester 2"
              value={subject.semester2}
              onChange={(e) => handleSubjectChange(index, "semester2", e.target.value)}
              required
            />
          </div>
        ))}

        <div className="form-group">
          <label>Teacher's Remarks:</label>
          <textarea
            className='teacher-text'
            name="behaviorRemarks"
            value={studentData.behaviorRemarks}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <h2>Attendance Summary</h2>
          <label>Year:</label>
          <input
            type="text"
            name="attendanceYear"
            value={studentData.attendance.year}
            onChange={(e) =>
              setStudentData({
                ...studentData,
                attendance: { ...studentData.attendance, year: e.target.value },
              })
            }
            required
          />
          <label>Month:</label>
          <input
            type="text"
            name="month"
            value={studentData.attendance.month}
            onChange={(e) =>
              setStudentData({
                ...studentData,
                attendance: { ...studentData.attendance, month: e.target.value },
              })
            }
            required
          />
          <label>Total Days:</label>
          <input
            type="number"
            name="totalDays"
            value={studentData.attendance.totalDays}
            onChange={(e) =>
              setStudentData({
                ...studentData,
                attendance: { ...studentData.attendance, totalDays: e.target.value },
              })
            }
            required
          />
          <label>Days Attended:</label>
          <input
            type="number"
            name="attendedDays"
            value={studentData.attendance.attendedDays}
            onChange={(e) =>
              setStudentData({
                ...studentData,
                attendance: { ...studentData.attendance, attendedDays: e.target.value },
              })
            }
            required
          />
          <label>Attendance Percentage:</label>
          <input
            type="text"
            name="percentage"
            value={studentData.attendance.percentage}
            readOnly
          />
        </div>

        <button className='teacher-submit' type="submit">{actionType === "add" ? "Add Student" : "Update Student Records"}</button>
      </form>
    </div>
  );
};

export default TeacherInput;
