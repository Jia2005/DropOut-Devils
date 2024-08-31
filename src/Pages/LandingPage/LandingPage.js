import React from 'react';
import './LandingPage.css';
import logo from './assets/main-logo.png'; // Replace with your logo path
//import backgroundVideo from './assets/background-video.mp4'; // Replace with your video path
import backgroundImage from './assets/background-image-modified.jpg'; // Replace with your image path
import FeatureCards from './FeatureCards'; // Import FeatureCards component

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="eduSathi Logo" className="logo-img" />
        <span className="logo-text">eduSathi</span>
      </div>
      <ul className="navbar-menu">
        <li className="navbar-item"><a href="#features">FEATURES</a></li>
        <li className="navbar-item"><a href="#login-signup">LOG-IN / SIGN-UP</a></li>
      </ul>
    </nav>
  );
};

const LandingPage = () => {
  return (
    <div className="page-container">
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section with Video/Image Background */}
      <section className="hero-section">
        {/* Video Background */}
        {/*<video className="background-video" autoPlay loop muted>
          <source src={backgroundVideo} type="video/mp4" />
        </video>*/}

        {/* Fallback for Image Background */}
        <div className="background-overlay" style={{ backgroundImage: `url(${backgroundImage})` }}></div>

        {/* Content over the Background */}
        <div className="hero-content">
          <h1>Empowering Futures, One Step at a Time</h1>
          <p>Help us reach more aspiring and deserving youth!</p>
          <button className="hero-button">Register Now!</button>
        </div>
      </section>

      {/* Why eduSathi Section */}
      <section className="main-content">
        <div className="why-edusathi-container">
          <h2 className="why-edusathi-title">Why <span className="bold-text">eduSathi?</span></h2>
          <p className="why-edusathi-paragraph">
            eduSathi is your companion in the journey of education. We provide
            top-notch resources, personalized learning experiences, and a
            community of like-minded individuals to help you achieve your academic
            goals. Join us today and discover a better way to learn. Our platform offers a diverse range of courses tailored to individual needs, ensuring that every learner can progress at their own pace. Whether you're a student aiming to excel in exams or a professional seeking skill development, eduSathi has something for everyone.
          </p>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="features-section">
        <h2 className="features-title">Innovative Software Solutions</h2>
        <FeatureCards /> {/* Add FeatureCards component here */}
      </section>
    </div>
  );
};

export default LandingPage;
