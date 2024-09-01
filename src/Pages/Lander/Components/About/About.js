import React from "react";
import FeatureCards from "../../../LandingPage/FeatureCards";
const WhyEduSathi = () => {
  return (
    <section className="why-edusathi-section">
      <div className="why-edusathi-content">
        <h2 className="why-edusathi-heading">Why <span className="highlight">eduSathi?</span></h2>
        <p className="why-edusathi-description">
          eduSathi is your companion in the journey of education. We provide
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
const About = () => {
    return(
    <div>
    <WhyEduSathi />
    <FeaturesSection />
    </div>)
}
export default About;