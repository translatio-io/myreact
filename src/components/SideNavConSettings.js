import React, { useState, useContext, useRef } from 'react';
import AuthContext from './AuthContext';

const SideNavConSettings = () => {
    const { isLoggedIn, keycloak } = useContext(AuthContext);
    const textRef = useRef(null);
    const [projects, setProjects] = useState([{"name" : "translatio1",
                                               "versions" : ["1", "2", "3"],
                                               "languages" : ["chinese", "korean"]},
                                              {"name" : "translatio2",
                                               "versions" : ["4", "5"],
                                               "languages" : ["japanese", "korean"]}
                                             ]);

    //const [versions, setVersions] = useState(["1", "2", "3"]); // Initial list of versions
    const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);

    const [newVersions, setNewVersions] = useState({});
    const [newProjectName, setNewProjectName] = useState('');

    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const allLanguages = ["English", "Spanish", "French", "German", "Chinese", "Japanese"]; 

    const handleLanguageSelection = (language) => {
        console.log("Language: " + language);
        console.log("projectIndex: " + selectedProjectIndex);
        setSelectedLanguage(language);
        const updatedProjects = [...projects];
        if (!updatedProjects[selectedProjectIndex].languages.includes(language)) {
            updatedProjects[selectedProjectIndex].languages.push(language);
            setProjects(updatedProjects);
        }

        const closeButton = document.querySelector('.btn.btn-light[data-bs-dismiss="modal"]');
        if (closeButton) {
            closeButton.click();
        } else {
            console.error('Button not found');
        }

        //setShowLanguageModal(false);
        // You can add the selected language to your project state here
    };

    const handleDeleteVersion = (projectIndex, versionIndex) => {
        const updatedProjects = [...projects];
        updatedProjects[projectIndex].versions.splice(versionIndex, 1);
        setProjects(updatedProjects);
    };

    const handleDeleteLanguage = (projectIndex, languageIndex) => {
        const updatedProjects = [...projects];
        updatedProjects[projectIndex].languages.splice(languageIndex, 1);
        setProjects(updatedProjects);
    };

    const handleAddLanguageClick = (projectIndex) => () => {
        setSelectedProjectIndex(projectIndex);
    };

    const handleAddVersion = (projectIndex) => {
        const newVersion = newVersions[projectIndex] || '';
        const updatedProjects = [...projects];
        if (newVersion.trim() !== '' && !updatedProjects[projectIndex].versions.includes(newVersion.trim())) {
            //const updatedProjects = [...projects];
            updatedProjects[projectIndex].versions.push(newVersion);
            setProjects(updatedProjects);
            setNewVersions({ ...newVersions, [projectIndex]: '' });
        }
    };
    const handleNewVersionChange = (projectIndex, value) => {
        setNewVersions({ ...newVersions, [projectIndex]: value });
    };
    /*
    const handleAddVersion = () => {
        if (newVersion.trim() !== '' && !versions.includes(newVersion.trim())) {
          setVersions([...versions, newVersion]);
          setNewVersion('');
        }
    };
    */
    const handleAddProject = () => {
        if (newProjectName.trim() !== '') {
          setProjects([...projects, { name: newProjectName, versions: [], languages: [] }]);
          setNewProjectName('');
        }
    };

    const handleRemoveProject = (index) => {
        const updatedProjects = [...projects];
        updatedProjects.splice(index, 1);
        setProjects(updatedProjects);
    };

    const [activeTab, setActiveTab] = useState("general");
    const handleTabClick = (index) => {
        console.log("tab click: " + index);
        setActiveTab(index);
        console.log("active tab: " + activeTab);
    };

    const handleCopyText = () => {
        // Create a hidden input element
        const input = document.createElement('input');
        // Set its value to the text content of the paragraph
        input.value = textRef.current.textContent;
        // Append it to the body
        document.body.appendChild(input);
        // Select the input's value
        input.select();
        // Copy the selected text to the clipboard
        document.execCommand('copy');
        // Remove the input element from the DOM
        document.body.removeChild(input);
    };
    const changeProject = (index) => {
    }

    if (keycloak === null) {
        return (
                <main>
                    <div class="container-fluid px-4">
                        <h1 class="mt-4">Please Login</h1>
                    </div>
                </main>
        );
    } else {
        console.log("settings page" + isLoggedIn + keycloak);
        const tokenParsed = keycloak.tokenParsed;
        const loginId = tokenParsed?.preferred_username;
        console.log('Login ID:', loginId);
        const fullName = tokenParsed?.name;
        console.log('Full Name:', fullName);
        const displayName = tokenParsed?.name ? tokenParsed.name : tokenParsed?.preferred_username;
    
        console.log('Offline token (refresh token):', keycloak.refreshToken);
        console.log('endpoints: ', keycloak.endpoints.token());

        //keycloak.login({
        //          scope: 'openid offline_access',
        //        });

        console.log('setting, making restapi call');
        const accessToken = keycloak.token;
        const headers = {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        };
        fetch('http://localhost:3000/secured', {
                  method: 'GET', // Specify your HTTP method
                  headers: headers,
             })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
             })
            .then(data => {
                 console.log('Response:', data);
             })
            .catch(error => {
                 console.error('Error fetching data:', error);
             });


        if (! isLoggedIn) {
            return (
                <main>
                    <div class="container-fluid px-4">
                        <h1 class="mt-4">Please Login</h1>
                    </div>
                </main>
            );
        } else {
            return (
                <main>
                    <div class="container-fluid px-4">
                        <h1 class="mt-4">Settings</h1>
                        <ol class="breadcrumb mb-4">
                            <li class="breadcrumb-item active">Settings</li>
                        </ol>
                      <hr />
                        <ul class="nav nav-tabs">
                          <li class="nav-item">
                            <a class={`nav-link ${activeTab === 'general' ? 'active' : ''}`} onClick={() => handleTabClick("general")} >General</a>
                          </li>
                          <li class="nav-item">
                            <a class={`nav-link ${activeTab === 'project' ? 'active' : ''}`} onClick={() => handleTabClick("project")}>Projects</a>
                          </li>
                          <li class="nav-item">
                            <a class={`nav-link ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => handleTabClick("stats")}>Stats</a>
                          </li>
                        </ul>

                        {activeTab === 'general' &&
                            <div>
                              <br />
                              <div class="w-50 list-group mb-5 shadow">
                                              <div class="list-group-item">
                                                  <div class="row align-items-center">
                                                      <div class="col">
                                                          <strong class="mb-0">Login</strong>
                                                      </div>
                                                      <div class="col-auto">
                                                          {displayName}
                                                      </div>
                                                  </div>
                                              </div>
                                              <div class="list-group-item">
                                                  <div class="row align-items-center">
                                                      <div class="col">
                                                          <strong class="mb-0">Auto Translation Upon Upload</strong>
                                                          <p class="text-muted mb-0">If machine translation could be applied automatically</p>
                                                      </div>
                                                      <div class="col-auto">
                                                           <div class="form-check form-switch">
                                                             <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                                                             </input>
                                                           </div>
                                                      </div>
                                                  </div>
                                              </div>
                                              <div class="list-group-item">
                                                  <div class="row align-items-center">
                                                      <div class="col">
                                                          <strong class="mb-0">Default machine translation engine</strong>
                                                      </div>
                                                      <div class="col-auto">
                                                      <div class="form-group">
                                                         <select id="inputState" class="form-control">
                                                             <option selected="">Choose...</option>
                                                             <option>Google Translate</option>
                                                             <option>ChatGPT</option>
                                                         </select>
                                                     </div>
                                                      </div>
                                                  </div>
                                              </div>

                                              <div class="list-group-item">
                                                  <div class="row align-items-center">
                                                      <div class="col">
                                                          <strong class="mb-0">Notify me about new features and updates</strong>
                                                          <p class="text-muted mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                                      </div>
                                                      <div class="col-auto">
                                                           <div class="form-check form-switch">
                                                             <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                                                             </input>
                                                           </div>
                                                      </div>
                                                  </div>
                                              </div>
                                              <div class="list-group-item">
                                                  <div class="row align-items-center">
                                                      <div class="col">
                                                          <strong class="mb-0">Lorem ipsum dolor sit amet, consectet</strong>
                                                          <p class="text-muted mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                                      </div>
                                                      <div class="col-auto">
                                                          <div class="custom-control custom-switch">
                                                              <input type="checkbox" class="custom-control-input" id="alert3" checked="" />
                                                              <span class="custom-control-label"></span>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>

                              </div>

                            <div class="w-50 shadow p-3 mb-5 bg-body rounded">
                                <label for="inputPassword5" class="form-label"><strong class="mb-0">Google Translate API Key</strong></label>
                                <input type="apikey" id="apikey" class="form-control" aria-describedby="apikey"></input>
                                <div id="passwordHelpBlock" class="form-text">
                                  Leave Your Google Translate API Key to use your account while using machine translation.
                                </div>
                            </div>

                            <div class="w-50 shadow p-3 mb-5 bg-body rounded">
                              <div className="row">
                                <div className="col">
                                  <div className="card">
                                    <div className="card-body">
                                      <h5 className="card-title"><strong class="mb-0">Client API Key</strong></h5>
                                      <p ref={textRef}>{keycloak.refreshToken}</p>
                                      <button className="btn-secondary btn-sm" onClick={handleCopyText}>copy</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div class="w-25 shadow p-3 mb-5 bg-body rounded">
                                <div class="form-check form-switch">
                                  <label class="form-check-label" for="flexSwitchCheckDefault">Lorem ipsum dolor sit amet. </label>
                                  <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                                  </input>
                                </div>
                            </div>
                            <button type="button" class="btn btn-primary">Save</button>
                            <br />
                            </div>
                        }

                        {activeTab === 'project' &&

                            <div>
                              <br />
                              {projects.map((project, projectIndex) => (
                                  <div class="w-50 shadow p-3 mb-5 bg-body rounded">
                                      <div class="card">
                                        <div class="card-header">
                                          {project.name}
                                        </div>
                                        <div class="card-body">
                                          <h5 class="card-title">Versions:</h5>
                                          <p class="card-text">
                                            <div class="pe-3">
                                                {project.versions.map((version, versionIndex) => (
                                                  <span key={versionIndex}>
                                                    {version} <button type="button" className="btn btn-light" 
                                                                      onClick={() => handleDeleteVersion(projectIndex, versionIndex)}>
                                                      <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                  </span>
                                                ))}
                                            </div>
                                          </p>
                                          <input type="text" value={newVersions[projectIndex] || ''}
                                                             onChange={(e) => handleNewVersionChange(projectIndex, e.target.value)}
                                                             className="form-control-sm me-2 col-3"
                                                             id="newVersion"
                                                             placeholder="Enter New Version" />
                                          <button onClick={() => handleAddVersion(projectIndex)} className="btn btn-light">
                                                  <i className="fa-solid fa-plus"></i>
                                          </button>
                                          <br />
                                          <br />
                                          <h5 class="card-title">Languages(First in the list is default):</h5>
                                          <p class="card-text">
                                            {project.languages.map((language, languageIndex) => (
                                              <span key={languageIndex}>
                                              {language} <button type="button" 
                                                                 onClick={() => handleDeleteLanguage(projectIndex, languageIndex)}
                                                                 class="btn btn-light"><i class="fa-solid fa-trash"></i></button>
                                              </span>
                                            ))}
                                          <button type="button"   
                                                  class="btn btn-light" 
                                                  data-bs-toggle="modal" 
                                                  onClick={() => setSelectedProjectIndex(projectIndex)}
                                                  data-bs-target="#exampleModal">
                                            <i class="fa-solid fa-plus"></i></button>
                                          </p>

                                          <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div className="modal-dialog"> <div className="modal-content"> <div className="modal-header">
                                                <h5 className="modal-title">Select Language</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                              </div>
                                              <div className="modal-body">
                                                <ul className="list-group">
                                                   {allLanguages.map((language, index) => (
                                                    <li key={index}
                                                      className="list-group-item list-group-item-action"
                                                      onClick={() => handleLanguageSelection(language)} >
                                                      {language}
                                                    </li>
                                                  ))}
                                                </ul>
                                              </div>
                                              <div className="modal-footer">
                                                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                                              </div> </div> </div> 
                                          </div>

                                          <br />
                                          <a href="#" class="btn btn-secondary">Save</a>&nbsp;
                                          <button onClick={() => handleRemoveProject(projectIndex)} class="btn btn-secondary">Delete</button>
                                        </div>
                                      </div>
                                   </div>
                              ))}

                             <div class="w-50 shadow p-3 mb-5 bg-body rounded">
                                <div class="card">
                                  <div class="card-body d-flex align-items-center">
                                    <input type="text" 
                                           class="form-control-sm me-2 col-3" 
                                           id="newProjectName" 
                                           value={newProjectName}
                                           onChange={(e) => setNewProjectName(e.target.value)}
                                           placeholder="New Project Name"></input>
                                    <button onClick={handleAddProject} class="btn btn-light"><i class="fa-solid fa-plus"></i></button>
                                  </div>
                                </div>
                             </div>


                            </div>
                        }
                        {activeTab === 'stats' &&
                            <div>
                              <br />
                              <div class="w-50 list-group mb-5 shadow">
                                              <div class="list-group-item">
                                                  <div class="row align-items-center">
                                                      <div class="col">
                                                          <strong class="mb-0">Credit Used/Total</strong>
                                                      </div>
                                                      <div class="col-auto">
                                                          1234/1234
                                                      </div>
                                                  </div>
                                              </div>
                                              <div class="list-group-item">
                                                  <div class="row align-items-center">
                                                      <div class="col">
                                                          <strong class="mb-0">Translation Word Counts</strong>
                                                      </div>
                                                      <div class="col-auto">
                                                          1234
                                                      </div>
                                                  </div>
                                              </div>

                              </div>
                            </div>

                        }
                    </div>
                </main>
           );
       }
    }
};
export default SideNavConSettings;

