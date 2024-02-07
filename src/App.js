import React from 'react';
import TopNavbar from './components/TopNavbar';
import SideNavmenu from './components/SideNavmenu';
import SideNavConDash from './components/SideNavConDash';
import SideNavConSettings from './components/SideNavConSettings';
import Footer from './components/Footer';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./Keycloak"
import PrivateRoute from "./helpers/PrivateRoute";

const App = () => {
  return (
        <div>
           <ReactKeycloakProvider authClient={keycloak}>
            <TopNavbar />
            <div id="layoutSidenav">
                <SideNavmenu />
                <div id="layoutSidenav_content">
                    <Routes>
                        <Route path="/" element={<SideNavConDash />} />
                        <Route path="/settings" element={<PrivateRoute>
                                                             <SideNavConSettings />
                                                         </PrivateRoute>} />
                        <Route path="/dashboard" element={<SideNavConDash />} />
                    </Routes>
                    <Footer />
                </div>
            </div>
            </ReactKeycloakProvider>
        </div>
  );
};

export default App;

