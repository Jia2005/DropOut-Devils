import React, { useState } from "react";
import './TrackYourApplication.css';
function TrackYourApplication() {
    const [applicationId, setApplicationId] = useState("");
    const [applicationStatus, setApplicationStatus] = useState(null);
    const handleSearch = () => {
        setApplicationStatus({
            status: "Under Review",
            submissionDate: "2024-08-01",
            estimatedProcessingTime: "2 weeks",
            documents: [
                { name: "Income Certificate", status: "Verified" },
                { name: "Marksheet", status: "Pending" },
                { name: "Aadhar Card", status: "Verified" }
            ],
            alerts: ["Additional information required for Marksheet."]
        });
    };
    return (
        <div className="track-container">
            <div className="search-section">
                <h1>Track Your Application</h1>
                <input
                    type="text"
                    placeholder="Enter Application ID"
                    value={applicationId}
                    onChange={(e) => setApplicationId(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {applicationStatus && (
                <div className="status-section">
                    <h2>Application Status</h2>
                    <p><strong>Current Status:</strong> {applicationStatus.status}</p>
                    <p><strong>Submission Date:</strong> {applicationStatus.submissionDate}</p>
                    <p><strong>Estimated Processing Time:</strong> {applicationStatus.estimatedProcessingTime}</p>

                    <div className="status-timeline">
                        <h3>Status Timeline</h3>
                        {/* Add your timeline logic here */}
                    </div>

                    <div className="documents-section">
                        <h3>Documents Submitted</h3>
                        <ul>
                            {applicationStatus.documents.map((doc, index) => (
                                <li key={index}>
                                    {doc.name}: <span className={doc.status.replace(" ", "-").toLowerCase()}>{doc.status}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="alerts-section">
                        <h3>Important Alerts</h3>
                        <ul>
                            {applicationStatus.alerts.map((alert, index) => (
                                <li key={index}>{alert}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="support-section">
                        <h3>Contact Support</h3>
                        <p>If you have any questions, please contact us at help@reach.com.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TrackYourApplication;
