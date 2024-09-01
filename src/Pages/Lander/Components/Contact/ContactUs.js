import React from 'react';
import './ContactUs.css';
import logo from '../../assets/main-logo.png'; // Assuming the logo is in the same folder
import '@fortawesome/fontawesome-free/css/all.min.css';

const ContactUs = () => {
  return (
    <div className="contact-us-container">
      <header className="contact-us-header">
        <div className="contact-us-logo">
          <img src={logo} alt="eduSathi Logo" className="contact-us-logo-img" />
          <span className="contact-us-logo-text">EduSathi</span>
        </div>
      </header>
      <main className="contact-us-main">
        <section className="contact-us-info">
          <h2 className="contact-us-heading" style={{fontSize:"40px"}}>Contact Us</h2>
          <div className="contact-us-details">
            <p className="contact-us-detail" style={{color:"black"}}>
              Email: <a href="mailto:support@edusathi.com" className="contact-us-link">support@edusathi.com</a>
            </p>
            <p className="contact-us-detail">
              Phone: <a href="tel:+1234567890" className="contact-us-link">+123-456-7890</a>
            </p>
            <p className="contact-us-detail">Address: 123 Learning Lane, Education City, ED 45678</p>
          </div>
        </section>

        <section className="contact-us-form">
          <h2 className="contact-us-subheading">Send Us a Message</h2>
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
          <h2 className="contact-us-subheading">Company Information</h2>
          <p className="contact-us-info-text" >
            EduSathi is committed to  providing the best educational support to students and educators. We aim to make learning accessible and enjoyable through our innovative platform. For more information about our services and offerings, visit our website or contact us directly.
          </p>

          <h2 className="contact-us-subheading">Our Location</h2>
          <div className="contact-us-map">
            <iframe
              title="Google Maps Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.9834630688915!2d72.83328527502712!3d19.064464682137828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c91130392c07%3A0x3c47bf391c8de931!2sThadomal%20Shahani%20Engineering%20College!5e0!3m2!1sen!2sin!4v1725177666900!5m2!1sen!2sin"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </section>

        <section className="contact-us-social">
          <h2 className="contact-us-social-heading">Follow Us</h2>
          <div className="contact-us-social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="contact-us-social-link">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="contact-us-social-link">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="contact-us-social-link">
              <i className="fab fa-linkedin-in"></i>
            </a>
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
