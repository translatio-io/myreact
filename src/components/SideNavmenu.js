// components/Home.js
import React from 'react';
import { useKeycloak } from "@react-keycloak/web";


const SideNavmenu = () => {
  const { keycloak, initialized } = useKeycloak();
  //const loginUrl = keycloak.createLoginUrl();

  return (

            <div id="layoutSidenav_nav">
                <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                    <div class="sb-sidenav-menu">
                        <div class="nav">
                            <div class="sb-sidenav-menu-heading">Core</div>
                            <a class="nav-link" href="dashboard">
                                <div class="sb-nav-link-icon"><i class="fas fa-tachometer-alt"></i></div>
                                Dashboard
                            </a>
                            <a class="nav-link" href="settings">
                                <div class="sb-nav-link-icon"><i class="fas fa-gear"></i></div>
                                Settings
                            </a>
                            <a class="nav-link" href="tables.html">
                                <div class="sb-nav-link-icon"><i class="fas fa-right-from-bracket"></i></div>
                                Logout
                            </a>

                            {!keycloak.authenticated && (
                                <a class="nav-link" href="abc">
                                <div class="sb-nav-link-icon"><i class="fas fa-right-to-bracket"></i></div>
                                Login
                                </a>
                             )}

                            <a class="nav-link" href="tables.html">
                                <div class="sb-nav-link-icon"><i class="fas fa-id-card"></i></div>
                                Register
                            </a>
                <div>
               <div className="hover:text-gray-200">
                 {!keycloak.authenticated && (
                   <button
                     type="button"
                     className="text-blue-800"
                     onClick={() => keycloak.login()}
                   >
                     Login
                   </button>
                 )}

                 {!!keycloak.authenticated && (
                   <button
                     type="button"
                     className="text-blue-800"
                     onClick={() => keycloak.logout()}
                   >
                     Logout ({keycloak.tokenParsed.preferred_username})
                   </button>
                 )}
               </div>

                            </div>
                        </div>
                    </div>
                    <div class="sb-sidenav-footer">
                        <div class="small">Logged in as:</div>
                        Start Bootstrap
                    </div>
                </nav>
            </div>

  );
};
export default SideNavmenu;

