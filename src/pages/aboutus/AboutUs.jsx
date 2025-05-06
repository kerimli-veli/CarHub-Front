import React from 'react';
import AboutUsText from './components/AboutUsText';
import Header from '../landing/components/Header';
import Footer from '../landing/components/Footer';
import BusinessExperience from './components/BusinessExperience';

const AboutUs = () => {
  return (
    <div>

        <Header/>
      <AboutUsText />
      <BusinessExperience />
      <Footer/>
    </div>
  );
};

export default AboutUs;
