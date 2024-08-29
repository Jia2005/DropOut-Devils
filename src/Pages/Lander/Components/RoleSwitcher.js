import React from 'react';
import './RoleSwitcher.css'; 

const RoleSwitcher = ({ currentRole, onRoleChange }) => {
  const roles = ['student', 'admin', 'parent', 'teacher'];

  return React.createElement(
    'div',
    { className: 'role-switcher' },
    React.createElement('h2', null, 'Switch Role:'),
    React.createElement(
      'select',
      {
        value: currentRole,
        onChange: (e) => onRoleChange(e.target.value),
        className: 'role-select'
      },
      roles.map(role =>
        React.createElement(
          'option',
          { key: role, value: role },
          role.charAt(0).toUpperCase() + role.slice(1)
        )
      )
    )
  );
};

export default RoleSwitcher;
