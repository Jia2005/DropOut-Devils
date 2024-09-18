import React, { useState, useEffect } from 'react';
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import "./TeacherInput.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const TeacherInput = () => {
  const [role, setRole] = useState('teacher');
  const [theme, setTheme] = useState('light');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [actionType, setActionType] = useState("add");
  const [lookupEmail, setLookupEmail] = useState("");
  const db = getFirestore();

  const initialStudentData = {
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
    behavioralIncidents: [],
    behavioralIncidentsCount: 0,
    extracurricularActivity: 0,
    attendance: {
      totalDays: "",
      attendedDays: "",
      percentage: "",
      year: "",
      month: "",
    },
  };

  const [studentData, setStudentData] = useState(initialStudentData);

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

  const addBehavioralIncident = () => {
    setStudentData(prevState => {
      const newIncidents = [...prevState.behavioralIncidents, { description: "" }];
      return {
        ...prevState,
        behavioralIncidents: newIncidents,
        behavioralIncidentsCount: newIncidents.length, 
      };
    });
  };
  
  const removeBehavioralIncident = (index) => {
    setStudentData(prevState => {
      const updatedIncidents = prevState.behavioralIncidents.filter((_, i) => i !== index);
      return {
        ...prevState,
        behavioralIncidents: updatedIncidents,
        behavioralIncidentsCount: updatedIncidents.length,  
      };
    });
  };
  
  

  const handleIncidentChange = (index, value) => {
    const updatedIncidents = studentData.behavioralIncidents.map((incident, i) =>
      i === index ? { ...incident, description: value } : incident
    );
    setStudentData({ ...studentData, behavioralIncidents: updatedIncidents });
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
      const fetchedData = docSnap.data();
      setStudentData({
        ...initialStudentData,
        ...fetchedData,
        subjects: fetchedData.subjects || initialStudentData.subjects,
        behavioralIncidentsCount: fetchedData.behavioralIncidents?.length || 0,
      });
    } else {
      alert(`No student found with email ${lookupEmail}`);
      setStudentData(initialStudentData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const studentId = `${studentData.email}`;
  
    try {
      const dataToSave = {
        ...studentData,
        behavioralIncidentsCount: studentData.behavioralIncidentsCount, 
      };
  
      if (actionType === "add") {
        await setDoc(doc(db, "students", studentId), dataToSave);
        alert(`Success! ${studentData.email}'s Progress Report has been saved.`);
      } else if (actionType === "update") {
        const docRef = doc(db, "students", studentId);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          await setDoc(doc(db, "students", studentId), dataToSave, { merge: true });
          alert(`Success! ${studentData.name}'s Progress Report has been updated.`);
        } else {
          alert(`Error: No student found with email ${studentData.email}. Please add the student first.`);
        }
      }
      
      setStudentData(initialStudentData);
      setLookupEmail("");
    } catch (error) {
      console.error("Error saving student data: ", error);
      alert(`Error: Failed to save student data. ${error.message}`);
    }
  };  

  return (
    <div className="teacher-input-bg">
      <div className="teacher-input">
        <h2 style={{ fontSize: '40px' }}>
          {actionType === "add" ? "Add Student Details" : "Update Student Records"}
        </h2>
        <br />
        <div className="action-buttons">
          <button style={{ fontSize: '20px', fontWeight:'bold', color:'white' }} onClick={() => setActionType("add")} className={actionType === "add" ? "active" : ""}>
            Add Student
          </button>
          <button style={{ fontSize: '20px', fontWeight:'bold', color:'white' }} onClick={() => setActionType("update")} className={actionType === "update" ? "active" : ""}>
            Update Student Records
          </button>
        </div>

        {actionType === "update" && (
          <div className="form-group">
            <label style={{ fontSize: '16px',color:"black", fontWeight:'bold' }}>Enter Student Email to Fetch Data:</label>
            <input
              type="email"
              value={lookupEmail}
              onChange={(e) => setLookupEmail(e.target.value)}
            />
            <br />
            <br />
            <button type="button" className='button-fd' onClick={fetchStudentData} style={{color:'white'}}>Fetch Data</button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{color:'black', fontWeight:'bold'}}>Name:</label>
            <input
              type="text"
              name="name"
              value={studentData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label style={{color:'black', fontWeight:'bold'}}>Class:</label>
            <input
              type="text"
              name="class"
              value={studentData.class}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label style={{color:'black', fontWeight:'bold'}}>Roll No:</label>
            <input
              type="text"
              name="rollNo"
              value={studentData.rollNo}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label style={{color:'black', fontWeight:'bold'}}>Email:</label>
            <input
              type="email"
              name="email"
              value={studentData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label style={{color:'black', fontWeight:'bold'}}>School:</label>
            <input
              type="text"
              name="school"
              value={studentData.school}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label style={{color:'black', fontWeight:'bold'}}>Overall Grade:</label>
            <input
              type="text"
              name="overallGrade"
              value={studentData.overallGrade}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label style={{color:'black', fontWeight:'bold'}}>Year:</label>
            <input
              type="text"
              name="year"
              value={studentData.year}
              onChange={handleInputChange}
              required
            />
          </div>

          {studentData.subjects.map((subject, index) => (
            <div key={index} className="form-group">
              <label style={{color:'black', fontWeight:'bold'}}>{subject.name} Semester 1:</label>
              <input
                type="text"
                value={subject.semester1}
                onChange={(e) => handleSubjectChange(index, "semester1", e.target.value)}
                required
              /><br></br><br></br>
              <label style={{color:'black', fontWeight:'bold'}}>{subject.name} Semester 2:</label>
              <input
                type="text"
                value={subject.semester2}
                onChange={(e) => handleSubjectChange(index, "semester2", e.target.value)}
                required
              />
            </div>
          ))}

          <div className="form-group">
            <label style={{color:'black', fontWeight:'bold'}}>Behavioral Incidents:</label>
            {studentData.behavioralIncidents.map((incident, index) => (
              
              <div key={index} className="incident-group">
                <div className='Dono'>
                <input
                  type="text"
                  placeholder="Incident description"
                  value={incident.description}
                  onChange={(e) => handleIncidentChange(index, e.target.value)}
                />
                <button
                  style={{backgroundColor:'transparent'}}
                  type="button"
                  className="delete-icon"
                  onClick={() => removeBehavioralIncident(index)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div></div>
            ))}
            <button style={{backgroundColor:'navy', color:'white', fontWeight:'bold', borderRadius:'10px'}} type="button" onClick={addBehavioralIncident}>Add Incident</button>
          </div>

          <div className="form-group">
            <label style={{color:'black', fontWeight:'bold'}}>Extracurricular Activity:</label>
            <div className="radio-group">
              <label style={{color:'black', fontWeight:'bold'}}>
                <input
                  type="radio"
                  name="extracurricularActivity"
                  value="1"
                  checked={studentData.extracurricularActivity === 1}
                  onChange={(e) => setStudentData({ ...studentData, extracurricularActivity: parseInt(e.target.value) })}
                />
                Yes
              </label>
              <label style={{color:'black', fontWeight:'bold'}}>
                <input
                  type="radio"
                  name="extracurricularActivity"
                  value="0"
                  checked={studentData.extracurricularActivity === 0}
                  onChange={(e) => setStudentData({ ...studentData, extracurricularActivity: parseInt(e.target.value) })}
                />
                No
              </label>
            </div>
          </div>

          <div className="form-group">
            <label style={{color:'black', fontWeight:'bold'}}>Total Days:</label>
            <input
              type="number"
              name="totalDays"
              value={studentData.attendance.totalDays}
              onChange={(e) => setStudentData({ ...studentData, attendance: { ...studentData.attendance, totalDays: e.target.value } })}
            />
          </div>

          <div className="form-group">
            <label style={{color:'black', fontWeight:'bold'}}>Attended Days:</label>
            <input
              type="number"
              name="attendedDays"
              value={studentData.attendance.attendedDays}
              onChange={(e) => setStudentData({ ...studentData, attendance: { ...studentData.attendance, attendedDays: e.target.value } })}
            />
          </div>

          <div className="form-group">
            <label style={{color:'black', fontWeight:'bold'}}>Attendance Percentage:</label>
            <input
              type="text"
              name="percentage"
              value={studentData.attendance.percentage}
              readOnly
            />
          </div>

          <div className="form-group">
            <label style={{color:'black', fontWeight:'bold'}}>Attendance Year:</label>
            <input
              type="text"
              name="year"
              value={studentData.attendance.year}
              onChange={(e) => setStudentData({ ...studentData, attendance: { ...studentData.attendance, year: e.target.value } })}
            />
          </div>

          <div className="form-group">
            <label style={{color:'black', fontWeight:'bold'}}>Attendance Month:</label>
            <input
              type="text"
              name="month"
              value={studentData.attendance.month}
              onChange={(e) => setStudentData({ ...studentData, attendance: { ...studentData.attendance, month: e.target.value } })}
            />
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default TeacherInput;