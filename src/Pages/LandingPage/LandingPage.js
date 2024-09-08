import React, { useRef } from 'react';
import './LandingPage.css';
import logo from './../Lander/assets/main-logo.png'
import FeatureCards from './FeatureCards';
import Footer from './Footer';
import { Link } from 'react-router-dom';

const Navbar = ({ scrollToFooter }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="eduSathi Logo" className="navbar-logo-img" />
        <span className="navbar-logo-text">EduSathi</span>
        <li className="navbar-menu-item"><a href="#features">Features</a></li>
        <li className="navbar-menu-item"><a onClick={scrollToFooter}>Contact</a></li>
      </div>
      <ul className="navbar-menu">
        <li className="navbar-menu-item reg"><Link to="/signup" style={{color:'white'}}>Register</Link></li>
      </ul>
    </nav>
  );
};

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content" style={{color: 'white'}}>
        <h1 className="hero-heading" style={{color: 'white', textShadow: '3px 3px black'}}>Grooming Futures: One Student at a Time</h1>
        <p className="hero-subheading" style={{color: 'gold', textShadow: '2px 2px black', fontSize: '30px'}}>Join us in <b>Empowering Every Learner!</b></p>
        <Link to="/signup"><button className="hero-register-button" style={{backgroundColor:'gold',color:'black', fontWeight:'bold'}}>Register Now!</button></Link>
      </div>
    </section>
  );
};

const WhyEduSathi = () => {
  return (
    <section className="why-edusathi-section">
      <div className="why-edusathi-content">
        <h2 className="why-edusathi-heading">Why <span className="highlight">EduSathi?</span></h2>
        <p className="why-edusathi-description">
          EduSathi is your companion in the journey of education. We provide
          top-notch resources, personalized learning experiences, and a
          community of like-minded individuals to help you achieve your academic
          goals. Join us today and discover a better way to learn. Our platform offers a diverse range of courses tailored to individual needs, ensuring that every learner can progress at their own pace. Whether you're a student aiming to excel in exams or a professional seeking skill development, eduSathi has something for everyone.
        </p>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  return (
    <section id="features" className="features-section">
      <h2 className="features-heading">Innovative Software Solutions</h2>
      <FeatureCards />
    </section>
  );
};

const LandingPage = () => {
  const footerRef = useRef(null);

  const scrollToFooter = () => {
    footerRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      <Navbar scrollToFooter={scrollToFooter} />
      <HeroSection />
      <WhyEduSathi />
      <FeaturesSection />
      <Footer ref={footerRef} />
    </div>
  );
};

export default LandingPage;
