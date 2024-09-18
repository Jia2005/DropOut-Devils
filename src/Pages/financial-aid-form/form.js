import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from '../../firebase';
import './form.css';

function Form() {
  const auth = getAuth();
  const [uid, setUid] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
      personal: { name: '', dob: '', num: '', em: '', add: '' },
      academic: { school: '', grade: '', year: '', marks: '' },
      financial: { income: '', any: '', specify: '' },
      documents: { 'income-cert': null, 'mark-cert': null, 'aadhar-cert': null }
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, user => {
          if (user) {
              setUid(user.uid);
          } else {
              // Redirect to login or handle unauthenticated state
              console.log("User not logged in");
          }
      });

      return () => unsubscribe();
  }, []);
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
              if (field!=='specify' && !formData[section][field] && field !== 'income-cert' && field !== 'mark-cert' && field !== 'aadhar-cert') {
                  newErrors[`${section}-${field}`] = "This field is required";
              }
          }
      }

      if (!formData.documents['income-cert']) {
          newErrors["documents-income-cert"] = "Income Certificate is required";
      }
      if (!formData.documents['mark-cert']) {
          newErrors["documents-mark-cert"] = "Marksheet Certificate is required";
      }
      if (!formData.documents['aadhar-cert']) {
          newErrors["documents-aadhar-cert"] = "Aadhar Certificate is required";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const uploadFile = async (file, fileType) => {

      const storageRef = ref(storage, `documents/${uid}_${fileType}`);
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      if (validateForm()) {
          try {
              const fileUrls = await Promise.all(
                  Object.keys(formData.documents).map(async (fileKey) => {
                      if (formData.documents[fileKey]) {
                          return await uploadFile(formData.documents[fileKey], fileKey);
                      }
                      return '';
                  })
              );

              const [incomeCertUrl, markCertUrl, aadharCertUrl] = fileUrls;

              const docRef = await addDoc(collection(db, "financial_form"), {
                  personal: formData.personal,
                  academic: formData.academic,
                  financial: formData.financial,
                  documents: {
                      'income-cert': {
                          url: incomeCertUrl,
                          status: 'pending'
                      },
                      'mark-cert': {
                          url: markCertUrl,
                          status: 'pending'
                      },
                      'aadhar-cert': {
                          url: aadharCertUrl,
                          status: 'pending'
                      }
                  },
                  finalStatus: 'pending' 
              });

              const applicationId = docRef.id;
              alert(`Form submitted successfully! Your application ID is ${applicationId}`);

              setFormData({
                  personal: { name: '', dob: '', num: '', em: '', add: '' },
                  academic: { school: '', grade: '', year: '', marks: '' },
                  financial: { income: '', any: '', specify: '' },
                  documents: { 'income-cert': null, 'mark-cert': null, 'aadhar-cert': null }
              });
              setErrors({});
          } catch (error) {
              console.error("Error submitting form: ", error);
              if (error.code === 'network-request-failed') {
                  alert("Network error, please try again.");
              } else {
                  alert("Failed to submit form, please try again.");
              }
          } finally {
              setLoading(false);
          }
      } else {
          setLoading(false);
          alert("Please fill all required fields.");
      }
  };

  const renderFormContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="form-content">
            <label style={{fontSize:'16px', fontWeight:'bold'}}>Name:</label>
            <input type="text" name="name" placeholder="Name" value={formData.personal.name} onChange={handleInputChange} />
            <label style={{fontSize:'16px', fontWeight:'bold'}}>Date of Birth:</label>
            <input type="date" name="dob" placeholder="Date of Birth" value={formData.personal.dob} onChange={handleInputChange} />
            <label style={{fontSize:'16px', fontWeight:'bold'}}>Phone Number:</label>
            <input type="text" name="num" placeholder="Phone Number" value={formData.personal.num} onChange={handleInputChange} />
            <label style={{fontSize:'16px', fontWeight:'bold'}}>Email:</label>
            <input type="email" name="em" placeholder="Email" value={formData.personal.em} onChange={handleInputChange} />
            <label style={{fontSize:'16px', fontWeight:'bold'}}>Address:</label>
            <input type="text" name="add" placeholder="Address" value={formData.personal.add} onChange={handleInputChange} />
          </div>
        );
      case 'academic':
        return (
          <div className="form-content">
            <label style={{fontSize:'16px', fontWeight:'bold'}}>School:</label>
            <input type="text" name="school" placeholder="School" value={formData.academic.school} onChange={handleInputChange} />
            <label style={{fontSize:'16px', fontWeight:'bold'}}>Grade:</label>
            <input type="text" name="grade" placeholder="Grade" value={formData.academic.grade} onChange={handleInputChange} />
            <label style={{fontSize:'16px', fontWeight:'bold'}}>Year:</label>
            <input type="text" name="year" placeholder="Year" value={formData.academic.year} onChange={handleInputChange} />
            <label style={{fontSize:'16px', fontWeight:'bold'}}>Marks: (Previous Year)</label>
            <input type="text" name="marks" placeholder="Marks" value={formData.academic.marks} onChange={handleInputChange} />
          </div>
        );
      case 'financial':
        return (
          <div className="form-content">
            <label style={{fontSize:'16px', fontWeight:'bold'}}>Income:</label>
            <input type="text" name="income" placeholder="Income" value={formData.financial.income} onChange={handleInputChange} />
            <label style={{fontSize:'16px', fontWeight:'bold'}}>Any Financial Aid:</label>
            <input type="text" name="any" placeholder="Any Financial Aid" value={formData.financial.any} onChange={handleInputChange} />
            <label style={{fontSize:'16px', fontWeight:'bold'}}>Specify Financial Aid:</label>
            <input type="text" name="specify" placeholder="Specify Financial Aid" value={formData.financial.specify} onChange={handleInputChange} />
          </div>
        );
      case 'documents':
        return (
          <div className="form-content">
            <label style={{fontSize:'16px', fontWeight:'bold'}}>Income Certificate: (PDF format only)</label>
            <input type="file" name="income-cert" onChange={handleFileChange} />
            <label style={{fontSize:'16px', fontWeight:'bold'}}>Previous Year Marksheet: (PDF format only)</label>
            <input type="file" name="mark-cert" onChange={handleFileChange} />
            <label style={{fontSize:'16px', fontWeight:'bold'}}>Aadhar Card: (PDF format only)</label>
            <input type="file" name="aadhar-cert" onChange={handleFileChange} />
          </div>
        );
      default:
        return null;
    }
  };

  // return (
  //   <div className="form-container">
  //     <div className="tabs-finance">
  //       <button onClick={() => handleTabClick('personal')} className={activeTab === 'personal' ? 'active' : ''}>Personal Information</button>
  //       <button onClick={() => handleTabClick('academic')} className={activeTab === 'academic' ? 'active' : ''}>Academic Information</button>
  //       <button onClick={() => handleTabClick('financial')} className={activeTab === 'financial' ? 'active' : ''}>Financial Information</button>
  //       <button onClick={() => handleTabClick('documents')} className={activeTab === 'documents' ? 'active' : ''}>Documents</button>
  //     </div>
  //     <form onSubmit={handleSubmit} className="form-content">
  //       {renderFormContent()}
  //       <button type="submit" disabled={loading}>Submit</button>
  //     </form>
  //   </div>
  // );
  return (
    <div className="form-page">
        <div className="containerf">
            <div className="headings">
                <ul className="titles">
                    <li className={`tabf ${activeTab === "personal" ? "active" : ""}`} onClick={() => handleTabClick("personal")}>Personal details</li>
                    <li className={`tabf ${activeTab === "academic" ? "active" : ""}`} onClick={() => handleTabClick("academic")}>Academic details</li>
                    <li className={`tabf ${activeTab === "financial" ? "active" : ""}`} onClick={() => handleTabClick("financial")}>Financial details</li>
                    <li className={`tabf ${activeTab === "documents" ? "active" : ""}`} onClick={() => handleTabClick("documents")}>Upload Documents</li>
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
                        <label htmlFor="income">Household Income: </label>
                        <select name="income" id="income" value={formData.financial.income} onChange={(e) => handleInputChange(e, "financial")}>
                            <option value="">Select Income Range</option>
                            <option value="Below 2 lakh">Below 2 lakh</option>
                            <option value="2 lakhs to 5 lakhs">2 lakhs to 5 lakhs</option>
                            <option value="5 lakhs to 10 lakhs">5 lakhs to 10 lakhs</option>
                            <option value="Above 10 lakhs">Above 10 lakhs</option>
                        </select>
                        {errors["financial-income"] && <span className="error">{errors["financial-income"]}</span>}
                        <label htmlFor="any">Are you receiving any other scholarships?: </label>
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
                    <div className="documents-form">
                        <label htmlFor="income-cert">Income Certificate: </label>
                        <input type="file" name="income-cert" onChange={(e) => handleFileChange(e, "documents")} />
                        {errors["documents-income-cert"] && <span className="error">{errors["documents-income-cert"]}</span>}
                        <label htmlFor="mark-cert">Marksheet Certificate: </label>
                        <input type="file" name="mark-cert" onChange={(e) => handleFileChange(e, "documents")} />
                        {errors["documents-mark-cert"] && <span className="error">{errors["documents-mark-cert"]}</span>}
                        <label htmlFor="aadhar-cert">Aadhar Certificate: </label>
                        <input type="file" name="aadhar-cert" onChange={(e) => handleFileChange(e, "documents")} />
                        {errors["documents-aadhar-cert"] && <span className="error">{errors["documents-aadhar-cert"]}</span>}
                    </div>
                )}

                {activeTab === "documents" && (
                    <div style={{display: "flex", justifyContent: "center", paddingTop: "10px"}}>
                    <button className="submit-button-form-final" type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                    </div>
                )}
            </form>
        </div>
    </div>
);
};

export default Form;
