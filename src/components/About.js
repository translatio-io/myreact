// components/About.js
import React from 'react';
import { useAuth } from './AuthContext';


const About = () => {
  const { isLoggedIn, login, logout } = useAuth();
  console.log("isLoggedIn=" + isLoggedIn);
  console.log("login" + login);
  return (
    <div>
      <p>About</p>
      <p>User is {isLoggedIn ? 'logged in' : 'logged out'}</p>
      <button onClick={login}>Log In</button>
      <button onClick={logout}>Log Out</button>
    </div>
  );
};

export default About;

