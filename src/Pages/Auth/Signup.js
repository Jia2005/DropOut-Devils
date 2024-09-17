import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import './Auth.css';
import { db } from '../../firebase';
import { useNavigate, Link } from 'react-router-dom';
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
const storeUserDetails = async (uid, role, details) => {
  const roleType = {
    student: 1,
    teacher: 2,
    parent: 3,
  };
  const type = roleType[role];
  try {
    await setDoc(doc(db, 'users', uid), { type, ...details });
  } catch (error) {
    console.error('Error storing user details:', error);
  }
};
const checkChildEmailExists = async (childEmail) => {
  const userRef = doc(db, 'users', childEmail);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() && userDoc.data().type === 1; 
};
function SignupPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: 'student',
      name: '',
      grade: '',
      subject: '',
      childEmail: '',
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
      name: role !== 'admin' ? Yup.string().required('Required') : Yup.string(),
      grade: role === 'student' ? Yup.string().required('Required') : Yup.string(),
      subject: role === 'teacher' ? Yup.string().required('Required') : Yup.string(),
      childEmail: role === 'parent' ? Yup.string().email('Invalid email address').required('Required') : Yup.string(),
    }),
    onSubmit: async (values) => {
      const { email, password, childEmail, name, grade, subject } = values;
      const result = await signUpUser(email, password);

      if (result.success) {
        const { uid } = result.user;

        if (values.role === 'parent' && childEmail) {
          const childExists = await checkChildEmailExists(childEmail);

          if (childExists) {
            alert('Student not registered with this email.');
            return;
          }
        }
        const roleDetails = {
          student: { type: 1, name: values.name, grade: values.grade, email: values.email },
          teacher: { type: 2, name: values.name, subject: values.subject, email: values.email },
          parent: { type: 3, name: values.name, childEmail: values.childEmail, email: values.email }
        };
        const details = roleDetails[values.role];
        await storeUserDetails(uid, values.role, details);
        const auth = getAuth();
        signInWithEmailAndPassword(auth, values.email, values.password)
        .then(() => {
          navigate('/home');
        })
        .catch(() => {
          alert('Username or password is incorrect');
        });
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
    <div className="login-signup-bg">
          <div className="auth-container">
      <h2 className="signup">Signup</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input className='input-hander'
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
          <input className='input-hander'
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
          <input className='input-hander'
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
        <div className="form-group input-hander">
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
          </select>
        </div>
        {role === 'student' && (
          <>
            <div className="form-group">
              <label>Name:</label>
              <input className='input-hander'
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
              <label>Grade:</label>
              <input className='input-hander'
                style={{ width:'100%' }}
                type="text"
                name="grade"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.grade}
              />
              {formik.touched.grade && formik.errors.grade ? (
                <div className="error">{formik.errors.grade}</div>
              ) : null}
            </div>
          </>
        )}
        {role === 'teacher' && (
          <>
            <div className="form-group">
              <label>Name:</label>
              <input className='input-hander'
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
              <label>Subject:</label>
              <input className='input-hander'
                style={{ width:'100%' }}
                type="text"
                name="subject"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.subject}
              />
              {formik.touched.subject && formik.errors.subject ? (
                <div className="error">{formik.errors.subject}</div>
              ) : null}
            </div>
          </>
        )}
        {role === 'parent' && (
          <>
            <div className="form-group">
              <label>Name:</label>
              <input className='input-hander'
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
              <label>Child's Email:</label>
              <input className='input-hander'
                style={{ width:'100%' }}
                type="email"
                name="childEmail"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.childEmail}
              />
              {formik.touched.childEmail && formik.errors.childEmail ? (
                <div className="error">{formik.errors.childEmail}</div>
              ) : null}
            </div>
          </>
        )}
        <button type="submit" className="btn">Signup</button>

        <div className="login-link already-acc">
          <br></br>
          <p>Already have an account? <a href="/login" style={{color:"#0039f1", textDecoration:"underline", fontWeight:"100"}}>LogIn</a></p>
        </div>
      </form>
    </div>
    </div>
  
  );
}
export default SignupPage;