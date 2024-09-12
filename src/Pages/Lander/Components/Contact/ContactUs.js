import React from 'react';
import './ContactUs.css';
import logo from '../../assets/main-logo.png'; // Assuming the logo is in the same folder
import '@fortawesome/fontawesome-free/css/all.min.css';
import linkedin from '../../../LandingPage/assets/linkedin.png';
import whatsapp from '../../../LandingPage/assets/whatsapp.png';
import insta from '../../../LandingPage/assets/insta.png';
import facebook from '../../../LandingPage/assets/facebook.png';
import twitter from '../../../LandingPage/assets/twitter.png';

const ContactUs = () => {
  return (
    <div className="contact-us-container">
      <main className="contact-us-main">
        <section className="contact-us-info">
          <h2 className="contact-us-heading" style={{fontSize:"40px"}}>Contact Us</h2>
          <div className="contact-us-details">
            <p className="contact-us-detail" style={{color:"black"}}>
              Email: <a href="mailto:support@edusathi.com" className="contact-us-link">support@edusathi.com</a>
            </p>
            <p className="contact-us-detail">
              Phone: <a href="tel:98190 27396" className="contact-us-link">+91 98190 27396</a>
            </p>
            <p className="contact-us-detail">Address: 123 Learning Lane, Education City, ED 45678</p>
          </div>
        </section>

        <section className="contact-us-form">
          <h2 className="contact-us-subheading" style={{fontSize:'30px'}}>Send Us a Message</h2>
          <form className="contact-us-form-fields">
            <label htmlFor="name" className="contact-us-form-label">Name:</label>
            <input type="text" id="name" name="name" className="contact-us-form-input" required />

            <label htmlFor="email" className="contact-us-form-label">Email:</label>
            <input type="email" id="email" name="email" className="contact-us-form-input" required />

            <label htmlFor="message" className="contact-us-form-label">Message:</label>
            <textarea id="message" name="message" className="contact-us-form-textarea" rows="4" required></textarea>

            <button type="submit" className="contact-us-form-button">Send Message</button>
          </form>
        </section>

        <section className="contact-us-additional">
          <h2 className="contact-us-subheading" style={{fontSize:'30px'}}>Company Information</h2>
          <p className="contact-us-info-text" >
            EduSathi is committed to  providing the best educational support to students and educators. We aim to make learning accessible and enjoyable through our innovative platform. For more information about our services and offerings, visit our website or contact us directly.
          </p>

          <br></br><h2 className="contact-us-subheading" style={{fontSize:'30px'}}>Our Location</h2><br></br>
          <div className="contact-us-map">
            <iframe
              title="Google Maps Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.9834630688915!2d72.83328527502712!3d19.064464682137828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c91130392c07%3A0x3c47bf391c8de931!2sThadomal%20Shahani%20Engineering%20College!5e0!3m2!1sen!2sin!4v1725177666900!5m2!1sen!2sin"
              width="600"
              height="500"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </section>

        <section className="contact-us-social">
        <div className="footer-social-links">
          <h3 className="footer-section-heading-fu">Follow Us</h3>
          <div className='footer-for-contact'>
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
        </section>
      </main>
      <footer className="contact-us-footer">
        <p>&copy; 2024 EduSathi. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ContactUs;
