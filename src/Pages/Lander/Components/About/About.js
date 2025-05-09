import React from "react";
import FeatureCards from "../../../LandingPage/FeatureCards";
import './About.css';

const FeaturesSection = () => {
  return (
    <section id="features" className="features-section">
      <h2 className="features-heading">Innovative Software Solutions</h2>
      <FeatureCards />
    </section>
  );
};
const WhyEduSathi = () => {
  return (
    <section className="why-EduSathi-section">
      <div className="why-EduSathi-content">
      <h2 className="why-EduSathi-heading">Why <span className="highlight"> Studyee?</span></h2>
        <p className="why-EduSathi-description">
          Studyee is your companion in the journey of education. We provide
          top-notch resources, personalized learning experiences, and a
          community of like-minded individuals to help you achieve your academic
          goals. Join us today and discover a better way to learn. Our platform offers a diverse range of courses tailored to individual needs, ensuring that every learner can progress at their own pace. Whether you're a student aiming to excel in exams or a professional seeking skill development, EduSathi has something for everyone.
        </p>
      </div>
    </section>
  );
};

const About = () => {
    return(
    <div>
    <WhyEduSathi />
    <FeaturesSection />
    </div>)
}
export default About;