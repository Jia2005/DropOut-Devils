import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import './form.css';

const Form = () => {
  const auth = getAuth();
  const [uid, setUid] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    personal: { name: '', dob: '', num: '', em: '', add: '' },
    academic: { school: '', grade: '', year: '', marks: '' },
    financial: { income: '', any: '', specify: '' },
    documents: { 'income-cert': null, 'mark-cert': null, 'aadhar-cert': null }
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUid(user.uid);
      } else {
        console.log("User not logged in");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [activeTab]: {
        ...prevData[activeTab],
        [name]: value
      }
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prevData => ({
      ...prevData,
      documents: {
        ...prevData.documents,
        [name]: files[0]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userRef = doc(getFirestore(), 'users', uid);
      await updateDoc(userRef, formData);
      alert('Form submitted successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    } finally {
      setLoading(false);
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

  return (
    <div className="form-container">
      <div className="tabs">
        <button onClick={() => handleTabClick('personal')} className={activeTab === 'personal' ? 'active' : ''}>Personal Information</button>
        <button onClick={() => handleTabClick('academic')} className={activeTab === 'academic' ? 'active' : ''}>Academic Information</button>
        <button onClick={() => handleTabClick('financial')} className={activeTab === 'financial' ? 'active' : ''}>Financial Information</button>
        <button onClick={() => handleTabClick('documents')} className={activeTab === 'documents' ? 'active' : ''}>Documents</button>
      </div>
      <form onSubmit={handleSubmit} className="form-content">
        {renderFormContent()}
        <button type="submit" disabled={loading}>Submit</button>
      </form>
    </div>
  );
};

export default Form;
