import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import './ApplicationReviewPage.css'; // Assuming the CSS file is named ApplicationReviewPage.css

function ApplicationReviewPage() {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filter, setFilter] = useState("all");
  const db = getFirestore();

  useEffect(() => {
    const fetchApplications = async () => {
      const querySnapshot = await getDocs(collection(db, "financial_form"));
      const apps = querySnapshot.docs.map(doc => ({
        id: doc.id, 
        ...doc.data(),
        status: 'pending' 
      }));
      setApplications(apps);
    };

    fetchApplications();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    const applicationRef = doc(db, "financial_form", id);
    await updateDoc(applicationRef, { status: newStatus });
    setApplications(applications.map(app => app.id === id ? { ...app, status: newStatus } : app));
  };

  const handleApplicationClick = (app) => {
    setSelectedApplication(app);
  };

  const handleDocumentStatusChange = async (docName, newStatus) => {
    const updatedDocs = { ...selectedApplication.documents, [docName]: newStatus };
    const applicationRef = doc(db, "financial_form", selectedApplication.id);
    await updateDoc(applicationRef, { documents: updatedDocs });
    setSelectedApplication({ ...selectedApplication, documents: updatedDocs });
  };

  const filteredApplications = applications.filter(app => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  return (
    <div className="application-review-page">
      {!selectedApplication && (
        <>
          <h2>Review Applications</h2>
          <div className="filter-container">
            <label>Filter by Status: </label>
            <select onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <table className="application-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>School</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map(app => (
                <tr key={app.id}>
                  <td><button onClick={() => handleApplicationClick(app)}>{app.personal.name}</button></td>
                  <td>{app.academic.school}</td>
                  <td>{app.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {selectedApplication && (
        <div className="application-details">
          <button className="back-button" onClick={() => setSelectedApplication(null)}>Back to Applications</button>
          <h3>Application Details for {selectedApplication.personal.name}</h3>
          <div className="details-section">
            <h4>Personal Details</h4>
            <p>Date of Birth: {selectedApplication.personal.dob}</p>
            <p>Contact: {selectedApplication.personal.num}</p>
            <p>Email: {selectedApplication.personal.em}</p>
            <p>Address: {selectedApplication.personal.add}</p>
          </div>
          <div className="details-section">
            <h4>Academic Details</h4>
            <p>School: {selectedApplication.academic.school}</p>
            <p>Grade: {selectedApplication.academic.grade}</p>
            <p>Year: {selectedApplication.academic.year}</p>
            <p>Marks: {selectedApplication.academic.marks}</p>
          </div>
          <div className="details-section">
            <h4>Financial Details</h4>
            <p>Household Income: {selectedApplication.financial.income}</p>
            <p>Other Scholarships: {selectedApplication.financial.any}</p>
            {selectedApplication.financial.any === "yes" && (
              <p>Details: {selectedApplication.financial.specify}</p>
            )}
          </div>
          <div className="details-section">
            <h4>Documents</h4>
            <ul>
              {Object.keys(selectedApplication.documents).map(docName => (
                <li key={docName}>
                  <a href={selectedApplication.documents[docName]} target="_blank" rel="noopener noreferrer">
                    {docName} - Status: {selectedApplication.documents[docName] ? 'Uploaded' : 'Not Uploaded'}
                  </a>
                  <button onClick={() => handleDocumentStatusChange(docName, 'verified')}>Verify</button>
                  <button onClick={() => handleDocumentStatusChange(docName, 'pending')}>Pending</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="final-status">
            <button onClick={() => handleStatusUpdate(selectedApplication.id, 'verified')}>Final Approve</button>
            <button onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}>Final Reject</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationReviewPage;

