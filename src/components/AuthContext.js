import React, { createContext, useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [keycloak, setKeycloak] = useState(null);

    useEffect(() => {

        const keycloak = new Keycloak({
            url: "http://localhost:8080",
            realm: "translatio",
            clientId: "translatio",
        });
        keycloak.init({ onLoad: 'check-sso',
                        scope: 'openid offline_access',
                        checkLoginIframe: false})
                .then((authenticated) => {
                    console.log(authenticated ? 'User is authenticated' : 'User is not authenticated');
                    const loginUrl = keycloak.createLoginUrl();
                    const logoutUrl = keycloak.createLogoutUrl();
                    //console.log('Login URL:', loginUrl);
                    //console.log('Logout URL:', logoutUrl);
                    setIsLoggedIn(keycloak.authenticated);
                    setKeycloak(keycloak);
                })
                .catch(error => console.error('Keycloak initialization failed:', error));

    },[]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, keycloak }}>
          {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

