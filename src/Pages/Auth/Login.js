import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Auth.css';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { width } from '@fortawesome/free-solid-svg-icons/fa0';

function LoginPage() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      role: 'student',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      role: Yup.string().required('Role is required'),
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
    }),
    onSubmit: (values) => {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then((userCredential) => {
          navigate('/home');
        })
        .catch((error) => {
          alert('Username or password is incorrect');
        });
    },
  });

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={formik.handleSubmit}>

        <div className="form-group">
          <label>Email:</label>
          <input className='takeInput'
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
          <input className='takeInput'
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

        <button type="submit" className="btn">Login</button>
      </form>
      <br></br>    
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export default LoginPage;