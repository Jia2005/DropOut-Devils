import React from 'react';
import './RoleSwitcher.css'; // Ensure you have a CSS file for styling the role switcher

const RoleSwitcher = ({ currentRole, onRoleChange }) => {
  const roles = ['student', 'admin', 'parent', 'teacher'];

  return (
    <div className="role-switcher">
      <h2>Switch Role:</h2>
      <select
        value={currentRole}
        onChange={(e) => onRoleChange(e.target.value)}
        className="role-select"
      >
        {roles.map((role) => (
          <option key={role} value={role}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RoleSwitcher;
