import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import './Auth.css';
import { db } from '../../firebase';

const signUpUser = async (email, password) => {
  const auth = getAuth();
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return { success: true, user };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    return { success: false, errorCode, errorMessage };
  }
};

const storeUserDetails = async (uid, details) => {
  try {
    await setDoc(doc(db, 'users', uid), details);
  } catch (error) {
    console.error('Error storing user details:', error);
  }
};

function AdminSign() {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      adminCode: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .matches(/@gmail.com$/, 'Only Gmail addresses are allowed')
        .required('Required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must have at least one uppercase character')
        .matches(/[a-z]/, 'Password must have at least one lowercase character')
        .matches(/\d/, 'Password must have at least one number')
        .matches(/[@$!%*?&#]/, 'Password must have at least one special character')
        .required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
      name: Yup.string().required('Required'),
      adminCode: Yup.string().required('Admin code is required'),
    }),
    onSubmit: async (values) => {
      const { email, password, name, adminCode } = values;
      const result = await signUpUser(email, password);

      if (result.success) {
        const { uid } = result.user;

        const adminDetails = {
          type: 4,
          name,
          adminCode,
          email,
        };

        await storeUserDetails(uid, adminDetails);

        alert('Signup successful!');

      } else {
        if (result.errorCode === 'auth/email-already-in-use') {
          alert('The email address is already in use. Please use a different email.');
        } else {
          alert('Sign-up failed: ' + result.errorMessage);
        }
        console.error('Signup failed:', result.errorMessage);
      }
    },
  });

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            style={{ width:'100%' }}
            type="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="error">{formik.errors.email}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="error">{formik.errors.password}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="error">{formik.errors.confirmPassword}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label>Name:</label>
          <input
            style={{ width:'100%' }}
            type="text"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="error">{formik.errors.name}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label>Admin Code:</label>
          <input
            style={{ width:'100%' }}
            type="text"
            name="adminCode"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.adminCode}
          />
          {formik.touched.adminCode && formik.errors.adminCode ? (
            <div className="error">{formik.errors.adminCode}</div>
          ) : null}
        </div>

        <button type="submit" className="btn">Signup</button>

        <div className="login-link">
          <br />
          <p>Already have an account? <a href="/login">Log in</a></p>
        </div>
      </form>
    </div>
  );
}

export default AdminSign;
