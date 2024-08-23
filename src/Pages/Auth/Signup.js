import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate from react-router-dom
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Auth.css';

function SignupPage() {
  const [role, setRole] = useState('student');
  const navigate = useNavigate(); // Initializing useNavigate for redirecting

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: 'student',
      name: '',
      grade: '',
      subject: '',
      childName: '',
      adminCode: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .matches(/@gmail.com$/, 'Only Gmail addresses are allowed')
        .required('Required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/\d/, 'Password must contain at least one number')
        .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
        .required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
      name: role !== 'admin' ? Yup.string().required('Required') : Yup.string(),
      grade: role === 'student' ? Yup.string().required('Required') : Yup.string(),
      subject: role === 'teacher' ? Yup.string().required('Required') : Yup.string(),
      childName: role === 'parent' ? Yup.string().required('Required') : Yup.string(),
      adminCode: role === 'admin' ? Yup.string().required('Admin code is required') : Yup.string(),
    }),
    onSubmit: (values) => {
      console.log('Signup details:', values);
      navigate('/home'); // Redirecting to the homepage after a successful signup
    },
  });

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <form onSubmit={formik.handleSubmit}>
        {/* Email Field */}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error">{formik.errors.email}</div>
          )}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error">{formik.errors.password}</div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="error">{formik.errors.confirmPassword}</div>
          )}
        </div>

        {/* Role Selection */}
        <div className="form-group">
          <label>Role:</label>
          <select
            name="role"
            onChange={(e) => {
              setRole(e.target.value);
              formik.handleChange(e);
            }}
            value={formik.values.role}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Conditional Fields Based on Role */}
        {role === 'student' && (
          <>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="error">{formik.errors.name}</div>
              )}
            </div>
            <div className="form-group">
              <label>Grade:</label>
              <input
                type="text"
                name="grade"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.grade}
              />
              {formik.touched.grade && formik.errors.grade && (
                <div className="error">{formik.errors.grade}</div>
              )}
            </div>
          </>
        )}

        {role === 'teacher' && (
          <>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="error">{formik.errors.name}</div>
              )}
            </div>
            <div className="form-group">
              <label>Subject:</label>
              <input
                type="text"
                name="subject"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.subject}
              />
              {formik.touched.subject && formik.errors.subject && (
                <div className="error">{formik.errors.subject}</div>
              )}
            </div>
          </>
        )}

        {role === 'parent' && (
          <>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="error">{formik.errors.name}</div>
              )}
            </div>
            <div className="form-group">
              <label>Child's Name:</label>
              <input
                type="text"
                name="childName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.childName}
              />
              {formik.touched.childName && formik.errors.childName && (
                <div className="error">{formik.errors.childName}</div>
              )}
            </div>
          </>
        )}

        {role === 'admin' && (
          <div className="form-group">
            <label>Admin Code:</label>
            <input
              type="text"
              name="adminCode"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.adminCode}
            />
            {formik.touched.adminCode && formik.errors.adminCode && (
              <div className="error">{formik.errors.adminCode}</div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="btn">Signup</button>
      </form>
    </div>
  );
}

export default SignupPage;
