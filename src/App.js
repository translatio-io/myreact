import React from 'react';
import TopNavbar from './components/TopNavbar';
import SideNavmenu from './components/SideNavmenu';
import SideNavConDash from './components/SideNavConDash';
import SideNavConSettings from './components/SideNavConSettings';
import SideNavConDocument from './components/SideNavConDocument';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';

const App = () => {

    return (
        <div>
            <TopNavbar />
            <div id="layoutSidenav">
                <SideNavmenu />
                <div id="layoutSidenav_content">
                    <Routes>
                        <Route path="/" element={<SideNavConDash />} />
                        <Route path="/settings" element={ <SideNavConSettings /> } />
                        <Route path="/dashboard" element={<SideNavConDash />} />
                        <Route path="/document/:docId" element={<SideNavConDocument />} />
                    </Routes>
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default App;

