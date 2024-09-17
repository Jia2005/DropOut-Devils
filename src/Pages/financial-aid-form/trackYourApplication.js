import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import './TrackYourApplication.css'; 

function TrackYourApplication() {
    const [applicationId, setApplicationId] = useState('');
    const [applicationData, setApplicationData] = useState(null);
    const [reuploadFiles, setReuploadFiles] = useState({});
    const [bankDetails, setBankDetails] = useState({
        bankName: '',
        accountNumber: '',
        ifscCode: ''
    });
    const [disbursementDate, setDisbursementDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e) => {
        setApplicationId(e.target.value);
    };

    const fetchApplicationDetails = async () => {
        if (applicationId.trim() === '') {
            setMessage('Please enter a valid application ID.');
            return;
        }
        setLoading(true);
        setMessage('');
        try {
            const docRef = doc(db, 'financial_form', applicationId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setApplicationData(data);

                const currentYear = new Date().getFullYear();
                if (data.disbursementDetails && new Date(data.disbursementDetails.date).getFullYear() === currentYear) {
                    setIsSubmitted(true);
                } else {
                    setIsSubmitted(false);
                }
            } else {
                setMessage('No application found with the given ID.');
            }
        } catch (error) {
            console.error('Error fetching application details: ', error);
            setMessage('Error fetching application details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e, certType) => {
        const { files } = e.target;
        setReuploadFiles(prevFiles => ({
            ...prevFiles,
            [certType]: files[0]
        }));
    };

    const reuploadDocument = async (certType) => {
        if (!reuploadFiles[certType]) {
            alert('Please select a file to reupload.');
            return;
        }

        setLoading(true);
        try {
            const file = reuploadFiles[certType];
            const storageRef = ref(storage, `documents/${applicationId}_${certType}`);
            await uploadBytes(storageRef, file);
            const fileUrl = await getDownloadURL(storageRef);

            const docRef = doc(db, 'financial_form', applicationId);
            await updateDoc(docRef, {
                [`documents.${certType}.url`]: fileUrl,
                [`documents.${certType}.status`]: 'pending'
            });

            alert('Document reuploaded successfully!');
            fetchApplicationDetails(); 
        } catch (error) {
            console.error('Error reuploading document: ', error);
            alert('Error reuploading document. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitBankDetails = async () => {
        if (!applicationData || applicationData.finalStatus !== 'approved') {
            setMessage('Your application must be approved to submit bank details.');
            return;
        }

        try {
            const docRef = doc(db, 'financial_form', applicationId);
            await updateDoc(docRef, {
                bankDetails: bankDetails,
                disbursementDetails: {
                    amount: applicationData.disbursementDetails?.amount || '',
                    date: disbursementDate,
                    status: 'pending'
                }
            });

            setIsSubmitted(true);
            setMessage('Bank details and disbursement date submitted successfully!');
        } catch (error) {
            console.error('Error submitting bank details: ', error);
            setMessage('Error submitting bank details. Please try again.');
        }
    };

    return (
        <div className="track-application-page">
            <div className="track-application-container">
                <h2 style={{color: "white"}}>Track Your Application</h2>
                <input
                    type="text"
                    value={applicationId}
                    onChange={handleInputChange}
                    placeholder="Enter your Application ID"
                    className="application-input"
                />
                <button onClick={fetchApplicationDetails} disabled={loading} className="track-button">
                    {loading ? 'Fetching...' : 'Track Application'}
                </button>

                {message && <p className="message">{message}</p>}

                {applicationData && (
                    <div className="application-details">
                        <h3>Application Details</h3><br />
                        <p className='track-details'><strong>Name:</strong> {applicationData.personal.name}</p>
                        <p className='track-details'><strong>Institution:</strong> {applicationData.academic.school}</p>
                        <p className='track-details'><strong>Grade:</strong> {applicationData.academic.grade}</p>
                        <p className='track-details'><strong>Year:</strong> {applicationData.academic.year}</p>
                        <p className='track-details'><strong>Final Status:</strong> {applicationData.finalStatus}</p>

                        <h4>Documents</h4>
                        <table>
                            <tr>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Document</th>
                                <th>Reupload</th>
                            </tr>
                            {Object.keys(applicationData.documents).map((docKey) => (
                            <tr>
                                <td>{docKey.replace('-', ' ').toUpperCase()}</td>
                                <td>{applicationData.documents[docKey].status}</td>
                                <td>
                                <a href={applicationData.documents[docKey].url} target="_blank" rel="noopener noreferrer" className="view-document">
                                    View Document
                                </a>
                                </td>
                                <td>
                                {applicationData.documents[docKey].status === 'reupload' && (
                                    <div className="reupload-section">
                                        <input
                                            type="file"
                                            style={{fontSize: "14px", margin: '0'}}
                                            onChange={(e) => handleFileChange(e, docKey)}
                                            className="file-input"
                                        />
                                        <button onClick={() => reuploadDocument(docKey)} disabled={loading} className="reupload-button">
                                            {loading ? 'Reuploading...' : 'Reupload Document'}
                                        </button>
                                    </div>
                                )}
                                </td>
                            </tr>
                        ))}
                        </table>
                        <br />
                        

                        {applicationData.finalStatus === 'approved' && !isSubmitted && (
                            <div className="bank-details-form">
                                <h4>Submit Bank Details</h4>
                                <input
                                    type="text"
                                    value={bankDetails.bankName}
                                    onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                                    placeholder="Bank Name"
                                />
                                <input
                                    type="text"
                                    value={bankDetails.accountNumber}
                                    onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                    placeholder="Account Number"
                                />
                                <input
                                    type="text"
                                    value={bankDetails.ifscCode}
                                    onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                                    placeholder="IFSC Code"
                                />
                                <input
                                    type="date"
                                    value={disbursementDate}
                                    onChange={(e) => setDisbursementDate(e.target.value)}
                                />
                                <button onClick={handleSubmitBankDetails} disabled={loading} className="submit-button">
                                    {loading ? 'Submitting...' : 'Submit Bank Details'}
                                </button>
                            </div>
                        )}

                        {applicationData.disbursementDetails && (
                            <div className="disbursement-tracking">
                                <h4>Disbursement Tracking</h4>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Amount</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{applicationData.disbursementDetails.amount}</td>
                                            <td>{applicationData.disbursementDetails.date}</td>
                                            <td>{applicationData.disbursementDetails.status === 'approved' ? 'Funds Disbursed' : 'Pending'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TrackYourApplication;


