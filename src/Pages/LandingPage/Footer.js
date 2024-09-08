import React, { forwardRef } from 'react';
import './LandingPage.css';
import logo from '../Lander/assets/main-logo.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = forwardRef((props, ref) => {
  return (
    <footer ref={ref} className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <span className="footer-logo-text">eduSathi</span>
        </div>
        <div className="footer-contact-info">
          <h3 className="footer-section-heading">Contact Us</h3>
          <p className="footer-contact-detail">
            Email: <a href="mailto:support@edusathi.com" className="footer-link">support@edusathi.com</a>
          </p>
          <p className="footer-contact-detail">
            Phone: <a href="tel:+1234567890" className="footer-link">+123-456-7890</a>
          </p>
          <p className="footer-contact-detail">Address: 123 Learning Lane, Education City, ED 45678</p>
        </div>
        <div className="footer-social-links">
          <h3 className="footer-section-heading">Follow Us</h3>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
