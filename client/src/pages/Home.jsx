import React from 'react';
import HeroBanner from "../components/HeroBanner";
import ServicesGrid from "../components/ServicesGrid";
import StatsSection from "../components/StatsSection";
import Navbar from '../components/Navbar.jsx';
import EventsShowcase from '../components/EventShowcase.jsx';
import Footer from '../components/Footer.jsx';

const Home = () => {
    return (
        <div>
            <HeroBanner />
            <ServicesGrid />
            <EventsShowcase />
            <StatsSection />
        </div>
    )
}

export default Home
