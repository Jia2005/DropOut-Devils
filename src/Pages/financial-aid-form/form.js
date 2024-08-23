import React, { useState } from "react";
import './form.css';

function Form() {
    const [activeTab, setActiveTab] = useState("personal");
    const [formData, setFormData] = useState({
        personal: { name: '', dob: '', num: '', em: '', add: '' },
        academic: { school: '', grade: '', year: '', marks: '' },
        financial: { income: '', any: '', specify: '' },
        documents: { 'income-cert': '', 'mark-cert': '', 'aadhar-cert': '' }
    });
    const [errors, setErrors] = useState({});

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleInputChange = (e, section) => {
        setFormData({
            ...formData,
            [section]: {
                ...formData[section],
                [e.target.name]: e.target.value
            }
        });
    };

    const validateForm = () => {
        let newErrors = {};
        for (let section in formData) {
            for (let field in formData[section]) {
                if (!formData[section][field]) {
                    newErrors[`${section}-${field}`] = "This field is required";
                }
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Submitted Data:", formData);
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
                            <input type="text" name="name" placeholder="Full Name" onChange={(e) => handleInputChange(e, "personal")} />
                            {errors["personal-name"] && <span className="error">{errors["personal-name"]}</span>}
                            <label htmlFor="dob">Date of Birth: </label>
                            <input type="date" name="dob" onChange={(e) => handleInputChange(e, "personal")} />
                            {errors["personal-dob"] && <span className="error">{errors["personal-dob"]}</span>}
                            <label htmlFor="num">Contact Number: </label>
                            <input type="phone" name="num" onChange={(e) => handleInputChange(e, "personal")} />
                            {errors["personal-num"] && <span className="error">{errors["personal-num"]}</span>}
                            <label htmlFor="em">Email Address: </label>
                            <input type="email" name="em" onChange={(e) => handleInputChange(e, "personal")} />
                            {errors["personal-em"] && <span className="error">{errors["personal-em"]}</span>}
                            <label htmlFor="add">Address: </label>
                            <textarea name="add" id="add"  rows="3" onChange={(e) => handleInputChange(e, "personal")}></textarea>
                            {errors["personal-add"] && <span className="error">{errors["personal-add"]}</span>}
                        </div>
                    )}

                    {activeTab === "academic" && (
                        <div className="academic-form">
                            <label htmlFor="school">Institution Name: </label>
                            <input type="text" name="school" placeholder="School" onChange={(e) => handleInputChange(e, "academic")} />
                            {errors["academic-school"] && <span className="error">{errors["academic-school"]}</span>}
                            <label htmlFor="grade">Class/Grade Enrolled: </label>
                            <input type="text" name="grade" placeholder="Grade" onChange={(e) => handleInputChange(e, "academic")} />
                            {errors["academic-grade"] && <span className="error">{errors["academic-grade"]}</span>}
                            <label htmlFor="year">Current Academic Year: </label>
                            <input type="text" name="year" placeholder="Year" onChange={(e) => handleInputChange(e, "academic")} />
                            {errors["academic-year"] && <span className="error">{errors["academic-year"]}</span>}
                            <label htmlFor="marks">Average Marks/Percentage: </label>
                            <input type="text" name="marks" placeholder="Marks/Percentage" onChange={(e) => handleInputChange(e, "academic")} />
                            {errors["academic-marks"] && <span className="error">{errors["academic-marks"]}</span>}
                        </div>
                    )}

                    {activeTab === "financial" && (
                        <div className="financial-form">
                            <label htmlFor="income">Household Income: </label><br />
                            <select name="" id="">
                                <option value="1">Below 2 lakh</option>
                                <option value="2">2 lakhs to 5 lakhs</option>
                                <option value="5">5 lakhs to 8 lakhs</option>
                                <option value="8">Above 8 lakhs</option>
                            </select> <br />
                            {errors["financial-income"] && <span className="error">{errors["financial-income"]}</span>}
                            <label htmlFor="any">Does your child receive any other scholarships?</label><br />
                            <div className="radio-group">
                                <input type="radio" id="yes" name="any" value="yes" onChange={(e) => handleInputChange(e, "financial")} />
                                <label className="radio-label" htmlFor="yes">YES</label>
                                <input type="radio" id="no" name="any" value="no" onChange={(e) => handleInputChange(e, "financial")} />
                                <label className="radio-label" htmlFor="no">NO</label>
                            </div>{errors["financial-any"] && <span className="error">{errors["financial-any"]}</span>}
                            <label htmlFor="specify">If yes, please specify: </label>
                            <input type="text" name="specify" placeholder="Details" onChange={(e) => handleInputChange(e, "financial")} />
                            {errors["financial-specify"] && <span className="error">{errors["financial-specify"]}</span>}
                        </div>
                    )}

                    {activeTab === "documents" && (
                        <div className="documents-form">
                            <label htmlFor="income-cert">Upload Income Certificate: </label>
                            <input type="file" name="income-cert" onChange={(e) => handleInputChange(e, "documents")} />
                            {errors["documents-income-cert"] && <span className="error">{errors["documents-income-cert"]}</span>}
                            <label htmlFor="mark-cert">Upload Marksheet: </label>
                            <input type="file" name="mark-cert" onChange={(e) => handleInputChange(e, "documents")} />
                            {errors["documents-mark-cert"] && <span className="error">{errors["documents-mark-cert"]}</span>}
                            <label htmlFor="aadhar-cert">Upload Aadhar Card: </label>
                            <input type="file" name="aadhar-cert" onChange={(e) => handleInputChange(e, "documents")} />
                            {errors["documents-aadhar-cert"] && <span className="error">{errors["documents-aadhar-cert"]}</span>}

                            <button type="submit" className="submit-button">Submit</button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Form;
