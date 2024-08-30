import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import "./FundsDisbursement.css";

function FundsDisbursementPage() {
    const [disbursements, setDisbursements] = useState([]);
    const [selectedDisbursement, setSelectedDisbursement] = useState(null);
    const [message, setMessage] = useState('');

    const fetchPendingDisbursements = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'financial_form'));
            const pendingDisbursements = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(docData => docData.disbursementDetails.status === 'pending');
                
            setDisbursements(pendingDisbursements);
        } catch (error) {
            console.error('Error fetching disbursements: ', error);
            setMessage('Error fetching disbursements. Please try again.');
        }
    };

    useEffect(() => {
        fetchPendingDisbursements();
    }, []);

    const handleViewDisbursement = async (id) => {
        try {
            const docRef = doc(db, 'financial_form', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setSelectedDisbursement({ id: docSnap.id, ...docSnap.data() });
            } else {
                setMessage('No disbursement found with the given ID.');
            }
        } catch (error) {
            console.error('Error fetching disbursement details: ', error);
            setMessage('Error fetching disbursement details. Please try again.');
        }
    };

    const handleApproveDisbursement = async () => {
        if (!selectedDisbursement) {
            setMessage('No disbursement selected.');
            return;
        }

        try {
            const docRef = doc(db, 'financial_form', selectedDisbursement.id);
            await updateDoc(docRef, {
                'disbursementDetails.status': 'approved'
            });

            setMessage('Disbursement approved!');
            setSelectedDisbursement(null);
            fetchPendingDisbursements();
        } catch (error) {
            console.error('Error approving disbursement: ', error);
            setMessage('Error approving disbursement. Please try again.');
        }
    };

    const handleRejectDisbursement = async () => {
        if (!selectedDisbursement) {
            setMessage('No disbursement selected.');
            return;
        }

        try {
            const docRef = doc(db, 'financial_form', selectedDisbursement.id);
            await updateDoc(docRef, {
                'disbursementDetails.status': 'rejected'
            });

            setMessage('Disbursement rejected.');
            setSelectedDisbursement(null);
            fetchPendingDisbursements();
        } catch (error) {
            console.error('Error rejecting disbursement: ', error);
            setMessage('Error rejecting disbursement. Please try again.');
        }
    };

    return (
        <div className="funds-disbursement-page">
            <div className="container">
                <h2>Funds Disbursement</h2>

                {message && <p className="message">{message}</p>}

                {!selectedDisbursement ? (
                    <div>
                        <h3>Pending Disbursements</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Application ID</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {disbursements.map(disbursement => (
                                    <tr key={disbursement.id}>
                                        <td>{disbursement.id}</td>
                                        <td>{disbursement.disbursementDetails?.amount || 'N/A'}</td>
                                        <td>{disbursement.disbursementDetails?.date || 'N/A'}</td>
                                        <td>
                                            <button onClick={() => handleViewDisbursement(disbursement.id)}>View Disbursement</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="review-details">
                        <h3 className="here">Review Funds and Bank Details</h3>
                        <p><strong>Application ID:</strong> {selectedDisbursement.id}</p>
                        <p><strong>Amount:</strong> {selectedDisbursement.disbursementDetails?.amount || 'N/A'}</p>
                        <p><strong>Date:</strong> {selectedDisbursement.disbursementDetails?.date || 'N/A'}</p>
                        <p><strong>Bank Name:</strong> {selectedDisbursement.bankDetails?.bankName || 'N/A'}</p>
                        <p><strong>Account Number:</strong> {selectedDisbursement.bankDetails?.accountNumber || 'N/A'}</p>
                        <p><strong>IFSC Code:</strong> {selectedDisbursement.bankDetails?.ifscCode || 'N/A'}</p>
                        <button onClick={handleApproveDisbursement} className="button">Approve Disbursement</button>
                        <button onClick={handleRejectDisbursement}>Reject Disbursement</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FundsDisbursementPage;
