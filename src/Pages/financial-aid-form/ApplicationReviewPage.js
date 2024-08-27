import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import "./ApplicationReviewPage.css";

function ApplicationReviewPage() {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        const fetchApplications = async () => {
            const querySnapshot = await getDocs(collection(db, "financial_form"));
            const apps = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setApplications(apps);
            setFilteredApplications(apps);
        };

        fetchApplications();
    }, []);

    const handleStatusFilterChange = (e) => {
        const selectedStatus = e.target.value;
        setStatusFilter(selectedStatus);

        if (selectedStatus === "all") {
            setFilteredApplications(applications);
        } else {
            setFilteredApplications(applications.filter((app) => app.finalStatus === selectedStatus));
        }
    };

    const handleViewApplication = (application) => {
        setSelectedApplication(application);
    };

    const handleDocumentStatusChange = async (docName, status) => {
        if (selectedApplication) {
            const updatedDocuments = {
                ...selectedApplication.documents,
                [docName]: {
                    ...selectedApplication.documents[docName],
                    status: status,
                },
            };

            const updatedApplication = {
                ...selectedApplication,
                documents: updatedDocuments,
            };

            await updateDoc(doc(db, "financial_form", selectedApplication.id), updatedApplication);

            setSelectedApplication(updatedApplication);
            setApplications(applications.map((app) => (app.id === updatedApplication.id ? updatedApplication : app)));
            setFilteredApplications(filteredApplications.map((app) => (app.id === updatedApplication.id ? updatedApplication : app)));
        }
    };

    const handleFinalStatusChange = async (status) => {
        if (selectedApplication) {
            const updatedApplication = {
                ...selectedApplication,
                finalStatus: status,
            };

            await updateDoc(doc(db, "financial_form", selectedApplication.id), updatedApplication);

            setSelectedApplication(updatedApplication);
            setApplications(applications.map((app) => (app.id === updatedApplication.id ? updatedApplication : app)));
            setFilteredApplications(filteredApplications.map((app) => (app.id === updatedApplication.id ? updatedApplication : app)));
        }
    };

    return (
        <div className="application-review-page">
            {selectedApplication ? (
                <div className="application-details-container">
                    <button className="back-button" onClick={() => setSelectedApplication(null)}>
                        Back to Applications
                    </button>
                    <div className="application-details">
                        <h2>Application Details for {selectedApplication.personal.name}</h2>
                        <p><strong>Institution:</strong> {selectedApplication.academic.school}</p>
                        <p><strong>Grade:</strong> {selectedApplication.academic.grade}</p>
                        <p><strong>Year:</strong> {selectedApplication.academic.year}</p>
                        <p><strong>Income:</strong> {selectedApplication.financial.income}</p>
                        <h3>Documents</h3>
                        {Object.keys(selectedApplication.documents).map((docName) => (
                            <div key={docName} className="document-item">
                                <a href={selectedApplication.documents[docName].url} target="_blank" rel="noopener noreferrer">
                                    {docName}
                                </a>
                                <select
                                    className="status-dropdown"
                                    value={selectedApplication.documents[docName].status}
                                    onChange={(e) => handleDocumentStatusChange(docName, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="verified">Verify</option>
                                    <option value="reupload">Reupload</option>
                                </select>
                            </div>
                        ))}
                        <div className="status-buttons">
                            <button
                                className="final-status-button approve"
                                onClick={() => handleFinalStatusChange("approved")}
                                disabled={selectedApplication.finalStatus === "approved"}
                            >
                                Final Approve
                            </button>
                            <button
                                className="final-status-button reject"
                                onClick={() => handleFinalStatusChange("rejected")}
                                disabled={selectedApplication.finalStatus === "rejected"}
                            >
                                Final Reject
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="applications-list">
                    <h2>Applications</h2>
                    <label>
                        Filter by Status:
                        <select value={statusFilter} onChange={handleStatusFilterChange}>
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </label>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Institution</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApplications.map((application) => (
                                <tr key={application.id}>
                                    <td>{application.personal.name}</td>
                                    <td>{application.academic.school}</td>
                                    <td>{application.finalStatus}</td>
                                    <td>
                                        <button className="view-button" onClick={() => handleViewApplication(application)}>
                                            View Application
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ApplicationReviewPage;
