import React, { useRef } from 'react';
import './LandingPage.css';
import logo from './../Lander/assets/main-logo.png'
import FeatureCards from './FeatureCards';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import landing from '../LandingPage/assets/landing.png'; // Adjust path as necessary


const Navbar = ({ scrollToFooter }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="EduSathi Logo" className="navbar-logo-img" />
        <span className="navbar-logo-text">EduSathi</span>
        <li className="navbar-menu-item"><a href="#features">Features</a></li>
        <li className="navbar-menu-item" style={{marginLeft:"0"}}><a onClick={scrollToFooter}>Contact</a></li>
      </div>
      <ul className="navbar-menu">
        <li className="navbar-menu-item reg"><Link to="/signup" style={{color:'white'}}>Register</Link></li>
      </ul>
    </nav>
  );
};

const HeroSection = () => {
  return (
    <section 
      className="hero-section"
      style={{
        background: `url(${landing}) center/cover no-repeat`, // Using the imported image
        color: 'white', // Add text color contrast if needed
      }}
    >
      <div className="hero-content">
        <h1 className="hero-heading" style={{color: 'white', textShadow: '3px 3px black'}}>
          Grooming Futures: One Student at a Time
        </h1>
        <p className="hero-subheading" style={{color: 'gold', textShadow: '2px 2px black', fontSize: '30px'}}>
          Join us in <b>Empowering Every Learner!</b>
        </p>
        <Link to="/signup">
          <button className="hero-register-button" style={{backgroundColor:'5DA9E9', color:'black', fontWeight:'bold'}}>
            Register Now!
          </button>
        </Link>
      </div>
    </section>
  );
};


const WhyEduSathi = () => {
  return (
    <section className="why-EduSathi-section">
      <div className="why-EduSathi-content">
        <h2 className="why-EduSathi-heading" style={{borderBottom:"none"}}>Why <span className="highlight">EduSathi?</span></h2>
        <p className="why-EduSathi-description">
          EduSathi is your companion in the journey of education. We provide
          top-notch resources, personalized learning experiences, and a
          community of like-minded individuals to help you achieve your academic
          goals. Join us today and discover a better way to learn. Our platform offers a diverse range of courses tailored to individual needs, ensuring that every learner can progress at their own pace. Whether you're a student aiming to excel in exams or a professional seeking skill development, EduSathi has something for everyone.
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
