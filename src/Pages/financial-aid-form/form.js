import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from '../../firebase'; 
import './form.css';
import { getAuth } from "firebase/auth";

function Form() {
    const [activeTab, setActiveTab] = useState("personal");
    const [formData, setFormData] = useState({
        personal: { name: '', dob: '', num: '', em: '', add: '' },
        academic: { school: '', grade: '', year: '', marks: '' },
        financial: { income: '', any: '', specify: '' },
        documents: { 'income-cert': null, 'mark-cert': null, 'aadhar-cert': null }
    });
    const [errors, setErrors] = useState({});

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleInputChange = (e, section) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [name]: value
            }
        }));
    };

    const handleFileChange = (e, section) => {
        const { name, files } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [name]: files[0]
            }
        }));
    };

    const validateForm = () => {
        let newErrors = {};
        for (let section in formData) {
            for (let field in formData[section]) {
                if (section === 'financial' && field === 'specify' && formData.financial.any === 'yes' && !formData.financial.specify) {
                    newErrors["financial-specify"] = "This field is required when receiving other scholarships";
                }
                if (field !== 'specify' && !formData[section][field] && field !== 'income-cert' && field !== 'mark-cert' && field !== 'aadhar-cert') {
                    newErrors[`${section}-${field}`] = "This field is required";
                }
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    

    const uploadFile = async (file, fileType) => {
        const auth = getAuth();
        const uid = auth.currentUser.uid; 
        const storageRef = ref(storage, `documents/${uid}_${fileType}`);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                // Upload files and get their URLs
                const fileUrls = await Promise.all(
                    Object.keys(formData.documents).map(async (fileKey) => {
                        if (formData.documents[fileKey]) {
                            return await uploadFile(formData.documents[fileKey], fileKey);
                        }
                        return '';
                    })
                );
    
                const [incomeCertUrl, markCertUrl, aadharCertUrl] = fileUrls;
    
                // Save data to Firestore
                await addDoc(collection(db, "financial_form"), {
                    ...formData,
                    documents: {
                        'income-cert': incomeCertUrl,
                        'mark-cert': markCertUrl,
                        'aadhar-cert': aadharCertUrl
                    }
                });
    
                alert("Form submitted successfully!");
            } catch (error) {
                console.error("Error submitting form: ", error);
                alert("Failed to submit form.");
            }
        } else {
            alert("Please fill all required fields.");
        }
    };

    return (
        <div className="form-page">
            <div className="container">
                <div className="headings">
                    <ul className="titles">
                        <li className={`tab ${activeTab === "personal" ? "active" : ""}`} onClick={() => handleTabClick("personal")}>Personal details</li>
                        <li className={`tab ${activeTab === "academic" ? "active" : ""}`} onClick={() => handleTabClick("academic")}>Academic details</li>
                        <li className={`tab ${activeTab === "financial" ? "active" : ""}`} onClick={() => handleTabClick("financial")}>Financial details</li>
                        <li className={`tab ${activeTab === "documents" ? "active" : ""}`} onClick={() => handleTabClick("documents")}>Upload Documents</li>
                    </ul>
                </div>

                <form onSubmit={handleSubmit}>
                    {activeTab === "personal" && (
                        <div className="personal-form">
                            <label htmlFor="name">Full Name: </label>
                            <input type="text" name="name" value={formData.personal.name} placeholder="Full Name" onChange={(e) => handleInputChange(e, "personal")} />
                            {errors["personal-name"] && <span className="error">{errors["personal-name"]}</span>}
                            <label htmlFor="dob">Date of Birth: </label>
                            <input type="date" name="dob" value={formData.personal.dob} onChange={(e) => handleInputChange(e, "personal")} />
                            {errors["personal-dob"] && <span className="error">{errors["personal-dob"]}</span>}
                            <label htmlFor="num">Contact Number: </label>
                            <input type="tel" name="num" value={formData.personal.num} onChange={(e) => handleInputChange(e, "personal")} />
                            {errors["personal-num"] && <span className="error">{errors["personal-num"]}</span>}
                            <label htmlFor="em">Email Address: </label>
                            <input type="email" name="em" value={formData.personal.em} onChange={(e) => handleInputChange(e, "personal")} />
                            {errors["personal-em"] && <span className="error">{errors["personal-em"]}</span>}
                            <label htmlFor="add">Address: </label>
                            <textarea name="add" id="add" rows="3" value={formData.personal.add} onChange={(e) => handleInputChange(e, "personal")}></textarea>
                            {errors["personal-add"] && <span className="error">{errors["personal-add"]}</span>}
                        </div>
                    )}

                    {activeTab === "academic" && (
                        <div className="academic-form">
                            <label htmlFor="school">Institution Name: </label>
                            <input type="text" name="school" value={formData.academic.school} placeholder="School" onChange={(e) => handleInputChange(e, "academic")} />
                            {errors["academic-school"] && <span className="error">{errors["academic-school"]}</span>}
                            <label htmlFor="grade">Class/Grade Enrolled: </label>
                            <input type="text" name="grade" value={formData.academic.grade} placeholder="Grade" onChange={(e) => handleInputChange(e, "academic")} />
                            {errors["academic-grade"] && <span className="error">{errors["academic-grade"]}</span>}
                            <label htmlFor="year">Current Academic Year: </label>
                            <input type="text" name="year" value={formData.academic.year} placeholder="Year" onChange={(e) => handleInputChange(e, "academic")} />
                            {errors["academic-year"] && <span className="error">{errors["academic-year"]}</span>}
                            <label htmlFor="marks">Average Marks/Percentage: </label>
                            <input type="text" name="marks" value={formData.academic.marks} placeholder="Marks/Percentage" onChange={(e) => handleInputChange(e, "academic")} />
                            {errors["academic-marks"] && <span className="error">{errors["academic-marks"]}</span>}
                        </div>
                    )}

                    {activeTab === "financial" && (
                        <div className="financial-form">
                            <label htmlFor="income">Household Income: </label><br />
                            <select name="income" value={formData.financial.income} onChange={(e) => handleInputChange(e, "financial")}>
                                <option value="">Select Income Range</option>
                                <option value="Below 2 lakh">Below 2 lakh</option>
                                <option value="2 lakhs to 5 lakhs">2 lakhs to 5 lakhs</option>
                                <option value="5 lakhs to 10 lakhs">5 lakhs to 10 lakhs</option>
                                <option value="Above 10 lakhs">Above 10 lakhs</option>
                            </select>
                            {errors["financial-income"] && <span className="error">{errors["financial-income"]}</span>}
                            <label htmlFor="any">Are you receiving any other scholarships?: </label><br />
                            <select name="any" value={formData.financial.any} onChange={(e) => handleInputChange(e, "financial")}>
                                <option value="">Select Yes/No</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                            {errors["financial-any"] && <span className="error">{errors["financial-any"]}</span>}
                            {formData.financial.any === "yes" && (
                                <div>
                                    <label htmlFor="specify">Please specify: </label>
                                    <input type="text" name="specify" value={formData.financial.specify} onChange={(e) => handleInputChange(e, "financial")} />
                                    {errors["financial-specify"] && <span className="error">{errors["financial-specify"]}</span>}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "documents" && (
                        <div className="document-upload-form">
                            <label htmlFor="income-cert">Income Certificate: </label>
                            <input type="file" name="income-cert" onChange={(e) => handleFileChange(e, "documents")} />
                            <label htmlFor="mark-cert">Marksheet Certificate: </label>
                            <input type="file" name="mark-cert" onChange={(e) => handleFileChange(e, "documents")} />
                            <label htmlFor="aadhar-cert">Aadhar Certificate: </label>
                            <input type="file" name="aadhar-cert" onChange={(e) => handleFileChange(e, "documents")} />
                            <button type="submit" className="submit-button-form-final">Submit</button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Form;
