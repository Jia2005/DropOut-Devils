import React from 'react';
import './FeatureCards.css';

const FeatureCards = () => {
  const features = [
    {
      title: 'AI-Driven Early Warning System',
      description: 'An AI-powered software platform that analyzes student data (attendance, grades, behaviour) to predict which students are at risk of dropping out. The system will provide alerts to educators and administrators, enabling timely interventions.',
      features: ['Predictive analytics', 'Real-time alerts', 'Data visualization', 'Intervention recommendations'],
    },
    {
      title: 'Community Learning Hub Platform',
      description: 'An online platform that supports community learning hubs in rural and underserved areas. This platform will offer digital resources, tutoring sessions, and virtual mentoring, providing additional educational support to students.',
      features: ['Online classes', 'Resource library', 'Virtual tutoring', 'Community forums'],
    },
    {
      title: 'Mobile Learning Application',
      description: 'A mobile application that delivers personalized learning experiences, including interactive lessons, quizzes, and educational games. The app will provide resources for students who have limited access to traditional education.',
      features: ['Interactive content', 'Offline access', 'Progress tracking', 'Personalized learning paths'],
    },
    {
      title: 'Financial Support Management System',
      description: 'A software system to manage scholarship and financial aid applications. The platform will streamline the application process, track disbursements, and provide information on available financial support to reduce economic barriers.',
      features: ['Application tracking', 'Financial aid management', 'Eligibility assessment', 'Reporting tools'],
    },
    {
      title: 'Parental Engagement Portal',
      description: 'A web-based portal to engage and educate parents about their child\'s education. The portal will include resources on supporting learning at home, tracking student progress, and receiving updates from teachers.',
      features: ['Parent-teacher communication', 'Educational resources', 'Progress reports', 'Event notifications'],
    },
    {
      title: 'Flexible Schooling Management System',
      description: 'A software system to manage flexible schooling options, such as evening classes and part-time programs. The system will allow students to enroll, track their progress, and manage their schedules.',
      features: ['Enrollment management', 'Schedule tracking', 'Progress monitoring', 'Integration with existing school systems'],
    },
    {
      title: 'Student Support and Engagement App',
      description: 'An app that provides personalized support and engagement for students at risk of dropping out. Features will include counseling support, motivational content, and tools for setting and tracking academic goals.',
      features: ['Counseling resources', 'Goal-setting tools', 'Motivational content', 'Engagement tracking'],
    }
  ];

  return (
    <div className="feature-cards-container">
      {features.map((feature, index) => (
        <div className="card" key={index}>
          <h2 style={{fontSize:'25px',color:'navy',fontWeight:'bold'}}>{feature.title}</h2>
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
