// components/Home.js
import React, { useContext } from 'react';
import AuthContext from './AuthContext';
import '../App.css';

const TopNavbar = () => {

    const { isLoggedIn, keycloak } = useContext(AuthContext);

    if (keycloak === null) {
        return (
        <nav class="sb-topnav navbar navbar-expand navbar-dark bg-translatio">
            <a class="navbar-brand ps-3" href="/"><img src="./Translatio13.svg" alt="Translatio" style={{ width: '150px', height: 'auto' }} /></a>
            <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i class="fas fa-bars"></i></button>
            <form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                <div class="input-group">
                    <input class="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
                    <button class="btn btn-primary" id="btnNavbarSearch" type="button"><i class="fas fa-search"></i></button>
                </div>
            </form>
                
        </nav>
      );
    } else {
        console.log("top menu" + isLoggedIn + keycloak);
        const loginUrl = keycloak.createLoginUrl();
        const logoutUrl = keycloak.createLogoutUrl();
        const tokenParsed = keycloak.tokenParsed;
        const loginId = tokenParsed?.preferred_username;
        console.log('Login ID:', loginId);
        const fullName = tokenParsed?.name;
        console.log('Full Name:', fullName);
        if (isLoggedIn) {
            return (
        <nav class="sb-topnav navbar navbar-expand navbar-dark bg-translatio">
            <a class="navbar-brand ps-3" href="/"><img src="./Translatio13.svg" alt="Translatio" style={{ width: '150px', height: 'auto' }}/></a>
            <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i class="fas fa-bars"></i></button>
            <form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                <div class="input-group">
                    <input class="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
                    <button class="btn btn-primary" id="btnNavbarSearch" type="button"><i class="fas fa-search"></i></button>
                </div>
            </form>
            <ul class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" id="navbarDropdown" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-user fa-fw"></i></a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><a class="dropdown-item" href="/Dashboard">Dashboard</a></li>
                        <li><a class="dropdown-item" href="/settings">Settings</a></li>
                        <li><hr class="dropdown-divider" /></li>
                        <li><a class="dropdown-item" href={ logoutUrl }>Logout</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
          );
        } else {
            return (
        <nav class="sb-topnav navbar navbar-expand navbar-dark bg-translatio">
            <a class="navbar-brand ps-3" href="/"><img src="./Translatio13.svg" alt="Translatio" style={{ width: '150px', height: 'auto' }}/></a>
            <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="/"><i class="fas fa-bars"></i></button>
            <form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                <div class="input-group">
                    <input class="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
                    <button class="btn btn-primary" id="btnNavbarSearch" type="button"><i class="fas fa-search"></i></button>
                </div>
            </form>
            <ul class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" id="navbarDropdown" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-user fa-fw"></i></a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><a class="dropdown-item" href={ loginUrl }>Login</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
          );
        }
    }
};
export default TopNavbar;

