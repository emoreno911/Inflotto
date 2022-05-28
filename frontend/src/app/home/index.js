import React, { useEffect, useContext } from 'react';
// import { NotificationProvider } from "web3uikit";
import Layout from '../layout';
import HeroSection from './HeroSection';
import CountersSection from './CountersSection';
import HistorySection from './HistorySection';
import HelpSection from './HelpSection';

function Home() {
  
  return (
    <Layout>
      <HeroSection />
      <CountersSection />
      <HistorySection /> 
      <HelpSection />       
    </Layout>
  )
}

export default Home;
