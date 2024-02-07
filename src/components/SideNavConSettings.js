// components/Home.js
import React from 'react';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import { Link } from 'react-router-dom';


const SideNavConSettings = () => {
  return (
                <main>
                    <div class="container-fluid px-4">
                        <h1 class="mt-4">Settings</h1>
                        <ol class="breadcrumb mb-4">
                            <li class="breadcrumb-item active">Settings</li>
                        </ol>

                      <hr />

                    </div>
                </main>


  );
};
export default SideNavConSettings;

