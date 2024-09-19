import React from 'react'; 
import './FeatureCards.css';

const FeatureCards = () => {
  const features = [
    {
      title: 'AI-Driven Early Warning System',
      features: ['Predictive analytics', 'Real-time alerts', 'Data visualization', 'Intervention recommendations'],
    },
    {
      title: 'Community Learning Hub Platform',
      features: ['Online classes', 'Resource library', 'Virtual tutoring', 'Community forums'],
    },
    {
      title: 'Mobile Learning Application',
      features: ['Interactive content', 'Offline access', 'Progress tracking', 'Personalized learning paths'],
    },
    {
      title: 'Financial Support Management System',
      features: ['Application tracking', 'Financial aid management', 'Eligibility assessment', 'Reporting tools'],
    },
    {
      title: 'Parental Engagement Portal',
      features: ['Parent-teacher communication', 'Educational resources', 'Progress reports', 'Event notifications'],
    },
    {
      title: 'Flexible Schooling Management System',
      features: ['Enrollment management', 'Schedule tracking', 'Progress monitoring', 'Integration with existing school systems'],
    },
    // {
    //   title: 'Student Support and Engagement App',
    //   description: 'An app that provides personalized support and engagement for students at risk of dropping out. Features will include counseling support, motivational content, and tools for setting and tracking academic goals.',
    //   features: ['Counseling resources', 'Goal-setting tools', 'Motivational content', 'Engagement tracking'],
    // }
  ];

  return (
    <div className="feature-cards-container">
      {features.map((feature, index) => (
        <div className="card" key={index}>
          <h2 style={{fontSize:'25px',color:'black',fontWeight:'bold', borderBottom:'2px solid black'}}>{feature.title}</h2>
          <p style={{fontSize:'16px',color:'#2A2323'}}>{feature.description}</p>
          <ul style={{fontWeight:'bold'}}>
            {feature.features.map((feat, i) => (
              <li style={{fontSize:'16px'}} key={i}>{feat}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;