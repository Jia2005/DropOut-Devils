import React, { useState } from 'react';
import Navbar from './Components/Navbar/Navbar';
import RoleSwitcher from './Components/RoleSwitcher';
import ProgressReport from './Components/ProgressReport/ProgressReport';
import ScheduleMeeting from './Components/ScheduleMeeting/ScheduleMeeting';
import './lander.css';

const Lander = () => {
  const [role, setRole] = useState('student');
  const [selectedFeature, setSelectedFeature] = useState(''); 
  const handleFeatureSelect = (feature) => {
    setSelectedFeature(feature);
  };

  return (
    <div className={`container2 ${role === 'parent' ? 'parent-role' : ''}`}>
      <Navbar role={role} onFeatureSelect={handleFeatureSelect} /> {}
      <RoleSwitcher currentRole={role} onRoleChange={setRole} />

      {role === 'parent' && selectedFeature === 'Schedule Meeting' ? (
        <ScheduleMeeting />
      ) : role === 'parent' ? (
        <ProgressReport /> 
      ) : null}
    </div>
  );
};

export default Lander;
