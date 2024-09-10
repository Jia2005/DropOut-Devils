import React, { forwardRef } from 'react';
import './LandingPage.css';
import logo from '../Lander/assets/main-logo.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import linkedin from '../LandingPage/assets/linkedin.png';
import whatsapp from '../LandingPage/assets/whatsapp.png';
import insta from '../LandingPage/assets/insta.png';
import facebook from '../LandingPage/assets/facebook.png';
import twitter from '../LandingPage/assets/twitter.png'

const Footer = forwardRef((props, ref) => {
  return (
    <footer ref={ref} className="footer">
      <div className="footer-content">
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
            <img src={facebook} alt="Facebook" className="footer-social-icon" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
            <img src={twitter} alt="Twitter" className="footer-social-icon" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
            <img src={linkedin} alt="LinkedIn" className="footer-social-icon" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
            <img src={insta} alt="Instagram" className="footer-social-icon" />
          </a>
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="footer-social-link">
            <img src={whatsapp} alt="WhatsApp" className="footer-social-icon" />
          </a>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
