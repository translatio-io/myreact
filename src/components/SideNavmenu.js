// components/Home.js
import React, { useContext } from 'react';
import AuthContext from './AuthContext';
import '../App.css';

const SideNavmenu = () => {

    const { isLoggedIn, keycloak } = useContext(AuthContext);

    if (keycloak === null) {
        return (
            <div id="layoutSidenav_nav">
                <nav class="sb-sidenav accordion sb-sidenav-dark bg-translatio" id="sidenavAccordion">
                    <div class="sb-sidenav-menu">
                        <div class="nav">
                            <div class="sb-sidenav-menu-heading">Core</div>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
    if ( keycloak !== null ) {
        console.log("side menu" + isLoggedIn + keycloak);
        const loginUrl = keycloak.createLoginUrl();
        const logoutUrl = keycloak.createLogoutUrl();

        const tokenParsed = keycloak.tokenParsed;
        const loginId = tokenParsed?.preferred_username;
        console.log('Login ID:', loginId);
        const fullName = tokenParsed?.name;
        console.log('Full Name:', fullName);
        const displayName = tokenParsed?.name ? tokenParsed.name : tokenParsed?.preferred_username;


        if (isLoggedIn) {
            return (
            <div id="layoutSidenav_nav">
                <nav class="sb-sidenav accordion sb-sidenav-dark bg-translatio" id="sidenavAccordion">
                    <div class="sb-sidenav-menu">
                        <div class="nav">
                            <div class="sb-sidenav-menu-heading">Core</div>
                            <a class="nav-link" href="/dashboard">
                                <div class="sb-nav-link-icon"><i class="fas fa-tachometer-alt"></i></div>
                                Dashboard
                            </a>
                            <a class="nav-link" href="/settings">
                                <div class="sb-nav-link-icon"><i class="fas fa-gear"></i></div>
                                Settings
                            </a>
                            <a class="nav-link" href={ logoutUrl }>
                                <div class="sb-nav-link-icon"><i class="fas fa-right-from-bracket"></i></div>
                                Logout
                            </a>
                        </div>
                    </div>
                    <div class="sb-sidenav-footer">
                        <div class="small">Logged in as:</div>
                        { displayName }
                    </div>
                </nav>
            </div>
            );
        } else {
            return (
            <div id="layoutSidenav_nav">
                <nav class="sb-sidenav accordion sb-sidenav-dark bg-translatio" id="sidenavAccordion">
                    <div class="sb-sidenav-menu">
                        <div class="nav">
                            <div class="sb-sidenav-menu-heading">Core</div>
                            <a class="nav-link" href={ loginUrl }>
                                <div class="sb-nav-link-icon"><i class="fas fa-right-to-bracket"></i></div>
                                Login
                            </a>
                        </div>
                    </div>
                </nav>
            </div>
            );
        }
    }
};
export default SideNavmenu;

