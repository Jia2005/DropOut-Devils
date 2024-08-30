import React from 'react';
import './LandingPage.css';
import logoImage from "./assets/main-logo.png"; // Ensure this path points to your logo image
import learning from "./assets/learning.jpg";
import study from "./assets/study.jpg";
import education from "./assets/education-app-development.jpg";

const LandingPage = () => {
  return (
    <div className="page-container">

      <nav className="navbarLP">
        <div className="logo-container">
          <div className="logo-box">
            <img src={logoImage} alt="eduSathi Logo" className="logo-image" />
            <span className="logo-text">eduSathi</span>
          </div>
        </div>
        <a href="#register" className="btn-register">Register Now</a>
      </nav>

      <section className="main-content">
        <div className="why-edusathi">
          <h1>Why <span className="bold-text">eduSathi</span>?</h1>
          <p>
            <strong>eduSathi</strong> is your companion in the journey of education. We provide
            top-notch resources, personalized learning experiences, and a
            community of like-minded individuals to help you achieve your academic
            goals. Our platform is designed to cater to learners of all ages and
            backgrounds, offering a wide range of courses, interactive content, and
            expert guidance to enhance your learning journey. Whether you are looking
            to advance your career, prepare for exams, or simply explore new
            knowledge areas, <strong>eduSathi</strong> is here to support you every step of the way.
            Join us today and discover a better, more engaging way to learn.
          </p>
        </div>

        <div className="image-gallery">
          {/* First item - Image on left, text on right */}
          <div className="gallery-item">
            <div className="image-container">
              <img src={learning} alt="Learning with eduSathi" className="image" />
              <div className="overlay">
                <div className="overlay-text">Learning with eduSathi</div>
              </div>
            </div>
            <div className="text-container">
              <p>At eduSathi, learning is at the core of what we do. We offer a variety of resources tailored to your individual needs, ensuring that you have the tools and support necessary to succeed in your educational journey.</p>
            </div>
          </div>

          {/* Second item - Text on left, image on right */}
          <div className="gallery-item">
            <div className="text-container">
              <p>Personalized learning at eduSathi means that we cater to your unique learning style and pace. With our adaptive learning programs, you can focus on what matters most to you, enhancing your knowledge and skills effectively.</p>
            </div>
            <div className="image-container">
              <img src={study} alt="Personalized Learning" className="image" />
              <div className="overlay">
                <div className="overlay-text">Personalized Learning</div>
              </div>
            </div>
          </div>

          {/* Third item - Image on left, text on right */}
          <div className="gallery-item">
            <div className="image-container">
              <img src={education} alt="Join our Community" className="image" />
              <div className="overlay">
                <div className="overlay-text">Register Now!</div>
              </div>
            </div>
            <div className="text-container">
              <p>Join our vibrant community of learners and educators. Register now to be a part of a growing network where knowledge meets passion, and opportunities to excel are endless. Let's learn and grow together with eduSathi!</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 eduSathi. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
