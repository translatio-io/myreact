// components/Home.js
import React from 'react';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import { Link } from 'react-router-dom';


const SideNavConDash = () => {
  return (
                <main>
                    <div class="container-fluid px-4">
                        <h1 class="mt-4">Dashboard</h1>
                        <ol class="breadcrumb mb-4">
                            <li class="breadcrumb-item active">Dashboard</li>
                        </ol>

                        <div class="row">
                            <div class="col-xl-3 col-md-6">
                                <select class="form-select form-select-sm" aria-label=".form-select-sm example">
                                  <option selected>Project</option>
                                  <option value="1">Translatio</option>
                                  <option value="2">Translatio-staging</option>
                                  <option value="3">localhost</option>
                                </select>
                            </div>
                            <div class="col-xl-3 col-md-6">
                                <select class="form-select form-select-sm" aria-label=".form-select-sm example">
                                  <option selected>Version</option>
                                  <option value="1">1</option>
                                  <option value="3">3</option>
                                </select>
                            </div>
                            <div class="col-xl-3 col-md-6">
                                <select class="form-select form-select-sm" aria-label=".form-select-sm example">
                                  <option selected>Language</option>
                                  <option value="2">Chinese-Simplified</option>
                                  <option value="3">Portuguese</option>
                                </select>
                            </div>
                        </div>

                      <hr />

                        <div class="card mb-4">
                            <div class="card-header">
                                <i class="fas fa-table me-1"></i>
                                Documents
                            </div>
                            <div class="card-body">
                                <table id="datatablesSimple">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Position</th>
                                            <th>Office</th>
                                            <th>Age</th>
                                            <th>Start date</th>
                                            <th>Salary</th>
                                        </tr>
                                    </thead>
                                    <tfoot>
                                        <tr>
                                            <th>Name</th>
                                            <th>Position</th>
                                            <th>Office</th>
                                            <th>Age</th>
                                            <th>Start date</th>
                                            <th>Salary</th>
                                        </tr>
                                    </tfoot>
                                    <tbody>
                                        <tr>
                                            <td>Tiger Nixon</td>
                                            <td>System Architect</td>
                                            <td>Edinburgh</td>
                                            <td>61</td>
                                            <td>2011/04/25</td>
                                            <td>$320,800</td>
                                        </tr>
                                        <tr>
                                            <td>Garrett Winters</td>
                                            <td>Accountant</td>
                                            <td>Tokyo</td>
                                            <td>63</td>
                                            <td>2011/07/25</td>
                                            <td>$170,750</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    shao
                      <nav>
                        <ul>
                          <li>
                            <Link to="/">Home</Link>
                          </li>
                          <li>
                            <Link to="/about">About</Link>
                          </li>
                          <li>
                            <Link to="/contact">Contact</Link>
                          </li>
                        </ul>
                      </nav>

                      <hr />

                    </div>
                </main>


  );
};
export default SideNavConDash;

