import React, { useState, useContext, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AuthContext from './AuthContext';
import API_URLS from '../config';


const SideNavConSettings = () => {

    const { isLoggedIn, keycloak } = useContext(AuthContext);
    const textRef = useRef(null);
    const [projects, setProjects] = useState([{"proj_name" : "translatio1",
                                               "versions" : ["1", "2", "3"],
                                               "languages" : ["chinese", "korean"]},
                                              {"proj_name" : "translatio2",
                                               "versions" : ["4", "5"],
                                               "languages" : ["japanese", "korean"]}
                                             ]);

    const [project_versions, setProjectVersions] = useState([]);
    const [project_languages, setProjectLanguages] = useState([]);

    useEffect(() => {
        console.log("useeffect projects");
        if (projects) {
            if (keycloak?.authenticated) {
                console.log('useEffect authed');
                const tokenParsed = keycloak.tokenParsed;
                const loginId = tokenParsed?.preferred_username;
                console.log('Login ID:', loginId);
                const fullName = tokenParsed?.name;
                console.log('Full Name:', fullName);
                const displayName = tokenParsed?.name ? tokenParsed.name : tokenParsed?.preferred_username;
                setDisplayName(displayName);

                const accessToken = keycloak.token;
                const headers = {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                  'X-Auth-User': loginId,
                  'X-Auth-Token': loginId,
                };
                 fetch(API_URLS.host + '/versions', {
                           method: 'GET',
                           headers: headers, })
                     .then(response => {
                         if (!response.ok) {
                             throw new Error('Network response was not ok'); }
                         return response.json(); })
                     .then(data => {
                          console.log('Getting all versions');
                          console.log("versions=",JSON.stringify(data, null, 2));
                          setProjectVersions(data);
                      })
                     .catch(error => {
                          console.error('Error fetching data:', error);
                     });

                 fetch(API_URLS.host + '/project/languages', {
                           method: 'GET',
                           headers: headers, })
                     .then(response => {
                         if (!response.ok) {
                             throw new Error('Network response was not ok'); }
                         return response.json(); })
                     .then(data => {
                          console.log('Getting all project languages');
                          console.log("versions=",JSON.stringify(data, null, 2));
                          setProjectLanguages(data);
                      })
                     .catch(error => {
                          console.error('Error fetching data:', error);
                     });

            }
        }
    }, [projects, keycloak]); 

    //const [versions, setVersions] = useState(["1", "2", "3"]); // Initial list of versions
    const [displayName, setDisplayName] = useState("");

    const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
    const [newVersions, setNewVersions] = useState({});
    const [newProjectName, setNewProjectName] = useState('');
    const [httpHeaders, setHttpHeaders] = useState('');

    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [allLanguages, setallLanguages] = useState(["English", "Spanish", "French", "German", "Chinese", "Japanese"]);

    const [yesConfirmCallback, setYesConfirmCallback] = useState(null);
    const [confirmMessage, setconfirmMessage] = useState("");
    const [infoMessage, setInfoMessage] = useState("");
    const [params, setParams] = useState([]);


    const handleLanguageSelection = (language) => {
        console.log("Language: " + language);
        console.log("projectIndex: " + selectedProjectIndex);
        const projectName = projects[selectedProjectIndex].proj_name;
//SHAO,
        const updatedProjectLanguages = [...project_languages];
        if (!updatedProjectLanguages.some(language => language.proj_name === projectName && language.localeId === language)) {
            updatedProjectLanguages.push({'proj_name': projectName, 'localeId': language});
        }
        setProjectLanguages(updatedProjectLanguages);


        fetch(API_URLS.host + '/rest/project/' + projectName + '/version/ignoreversion/locales', {
              method: 'PUT',
              headers: httpHeaders,
              body: JSON.stringify({ "data": [language] })

             })
            .then(response => {
                console.log("New language Status Code:", response.status);
                if (response.ok) {
                    console.log("response ok");
                } else {
                    console.log("response not ok");
                    //throw new Error('Network response was not ok');
                }
                return Promise.all([response.json(), response.status]);
            })
            .then(([data, http_code]) => { // Destructure the array into data and http_code
                console.log("=================");
                console.log("==code " + http_code);
                console.log(JSON.stringify(data));
                setInfoMessage(http_code + " " + JSON.stringify(data));

            })
            .catch(error => {
                setconfirmMessage("Error: "+ error);
                 console.log('Error fetching data:', error);
             });


        //project_languages
        //setShowLanguageModal(false);
        // You can add the selected language to your project state here
    };

const handleNewActiviationKey = (projectIndex) => {
    console.log("new activate key ", projects[projectIndex].proj_name);
    console.log("new activate uuid ", btoa(JSON.stringify(({
        s: "localhost:3000",
        p: projects[projectIndex].proj_name,
        a: uuidv4().replace(/-/g, '').substring(0, 8)
    }))));

   let updatedProjects = [...projects];
   updatedProjects[projectIndex].proj_api = btoa(JSON.stringify(({
        s: "localhost:3000",
        p: projects[projectIndex].proj_name,
        a: uuidv4().replace(/-/g, '').substring(0, 8)
    })));
    setProjects(updatedProjects);

};


    const handleDeleteVersion = (projectIndex, versionIndex) => {

        const updatedProjectVersions = [...project_versions];
        updatedProjectVersions.splice(versionIndex, 1);
        setProjectVersions(updatedProjectVersions);
        fetch(API_URLS.host + '/rest/project/' + project_versions[versionIndex].proj_name + '/version/' + project_versions[versionIndex].ver_name, {
                  method: 'DELETE',
                  headers: httpHeaders
             })
            .then(response => {
                console.log("Delete Version Status Code:", response.status);
                if (response.ok) {
                    console.log("response ok");
                } else {
                    console.log("response not ok");
                    //throw new Error('Network response was not ok');
                }
                return Promise.all([response.json(), response.status]);
            })
            .then(([data, http_code]) => { // Destructure the array into data and http_code
                console.log("=================");
                console.log("==code " + http_code);
                console.log(JSON.stringify(data));
                setInfoMessage(http_code + " " + JSON.stringify(data));

            })
            .catch(error => {
                setconfirmMessage("Error: "+ error);
                 console.log('Error fetching data:', error);
             });


    };

    const handleDeleteLanguage = (projectIndex, languageIndex) => {

        const updatedProjectLanguages = [...project_languages];
        updatedProjectLanguages.splice(languageIndex, 1);
        setProjectLanguages(updatedProjectLanguages);
        const projectName = projects[projectIndex].proj_name;
        const languageName = project_languages[languageIndex].localeId;
console.log("delete languages ", projectName, languageName);
        fetch(API_URLS.host + '/rest/project/' + projectName + '/version/ignoreversion/locales', {
              method: 'DELETE',
              headers: httpHeaders,
              body: JSON.stringify({ "data": languageName })
             })

            .then(response => {
                console.log("Delete Language Status Code:", response.status);
                if (response.ok) {
                    console.log("response ok");
                } else {
                    console.log("response not ok");
                    //throw new Error('Network response was not ok');
                }
                return Promise.all([response.json(), response.status]);
            })
            .then(([data, http_code]) => { // Destructure the array into data and http_code
                console.log("=================");
                console.log("==code " + http_code);
                console.log(JSON.stringify(data));
                setInfoMessage(http_code + " " + JSON.stringify(data));

            })
            .catch(error => {
                setconfirmMessage("Error: "+ error);
                 console.log('Error fetching data:', error);
             });


    };

    const handleAddLanguageClick = (projectIndex) => () => {
        setSelectedProjectIndex(projectIndex);
    };

    const handleAddVersion = (projectIndex) => {
        const newVersion = newVersions[projectIndex] || '';
        const projectName = projects[projectIndex].proj_name;
        if (newVersion.trim() !== '') {
            const updatedProjectVersions = [...project_versions];
            if (!updatedProjectVersions.some(version => version.proj_name === projectName && version.ver_name === newVersion.trim())) {
                updatedProjectVersions.push({'proj_name': projectName, 'ver_name': newVersion.trim()});
            }
            setProjectVersions(updatedProjectVersions);
   
            fetch(API_URLS.host + '/rest/project/' + projectName + '/version/' + newVersion, {
                  method: 'PUT',
                  headers: httpHeaders
                 })
                .then(response => {
                    console.log("New Version Status Code:", response.status);
                    if (response.ok) {
                        console.log("response ok");
                    } else {
                        console.log("response not ok");
                        //throw new Error('Network response was not ok');
                    }
                    return Promise.all([response.json(), response.status]);
                })
                .then(([data, http_code]) => { // Destructure the array into data and http_code
                    console.log("=================");
                    console.log("==code " + http_code);
                    console.log(JSON.stringify(data));
                    setInfoMessage(http_code + " " + JSON.stringify(data));
    
                })
                .catch(error => {
                    setconfirmMessage("Error: "+ error);
                     console.log('Error fetching data:', error);
                 });
        } else {
            setInfoMessage("Please Enter a Version number");

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

    const handleToConfirmSaveProject = () => {
        setconfirmMessage("Save project " + newProjectName);
        setYesConfirmCallback(() => handleSaveProject);
        //setParams([index]);
    }

    const handleSaveProject = () => {
        console.log("handle save Project" + newProjectName)
        if (newProjectName.trim() !== '') {
          setProjects([...projects, { proj_name: newProjectName, versions: [], languages: [] }]);
          setNewProjectName('');
        }
        fetch(API_URLS.host + '/rest/projects/p/' + newProjectName, {
                  method: 'PUT',
                  headers: httpHeaders
             })
            .then(response => {
                console.log("Status Code:", response.status);
                if (response.ok) {
                    console.log("response ok");
                } else {
                    console.log("response not ok");
                    //throw new Error('Network response was not ok');
                }
                return Promise.all([response.json(), response.status]);
            })
            .then(([data, http_code]) => { // Destructure the array into data and http_code
                console.log("=================");
                console.log("==code " + http_code);
                console.log(JSON.stringify(data));
                setconfirmMessage(http_code + " " + JSON.stringify(data));
            })
            .catch(error => {
                setconfirmMessage("Error: "+ error);
                 console.log('Error fetching data:', error);
             });
    };


    const handleToConfirmRemoveProject = (index) => {
        setconfirmMessage("Delete project " + projects[index].proj_name);
        setYesConfirmCallback(() => handleRemoveProject);
        setParams([index]);
    };

    const handleRemoveProject = (index) => {
        console.log("handle remove Project" + index)
        const headers = {
          //Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Auth-User': 'translatio',
          'X-Auth-Token': 'translatio',
        };

        fetch(API_URLS.host + '/rest/projects/p/' + projects[index].proj_name, {
                  method: 'DELETE',
                  headers: headers
             })
            .then(response => {
                console.log("Status Code:", response.status);
                if (response.ok) {
                    console.log("response ok");
                    const updatedProjects = [...projects];
                    updatedProjects.splice(index, 1);
                    setProjects(updatedProjects);
                } else {
                    console.log("response not ok");
                    //throw new Error('Network response was not ok');
                }
                return Promise.all([response.json(), response.status]);
            })
            .then(([data, http_code]) => { // Destructure the array into data and http_code
                console.log("=================");
                console.log("==code " + http_code);
                console.log(JSON.stringify(data));
                setconfirmMessage(http_code + " " + JSON.stringify(data));
            })
            .catch(error => {
                setconfirmMessage("Error: "+ error);
                 console.log('Error fetching data:', error);
             });
    };

    const [activeTab, setActiveTab] = useState("general");
    const handleTabClick = (index) => {
        console.log("tab click: " + index);
        setActiveTab(index);
        console.log("active tab: " + activeTab);
    };

    const copyActivationToClipboard = (text) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

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
    };

    const handleConfirmYes = () => {
        console.log("confime yes");
        if (yesConfirmCallback) {
            yesConfirmCallback(...params);
        }
    };

    useEffect(() => {

        if (keycloak?.authenticated) {
            console.log('useEffect authed');
            const tokenParsed = keycloak.tokenParsed;
            const loginId = tokenParsed?.preferred_username;
            console.log('Login ID:', loginId);
            const fullName = tokenParsed?.name;
            console.log('Full Name:', fullName);
            const displayName = tokenParsed?.name ? tokenParsed.name : tokenParsed?.preferred_username;
            setDisplayName(displayName); 

            //console.log('Offline token (refresh token):', keycloak.refreshToken);
            //console.log('endpoints: ', keycloak.endpoints.token());

            //keycloak.login({
                //          scope: 'openid offline_access',
            //        });

            const accessToken = keycloak.token;
            const headers = {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'X-Auth-User': loginId,
              'X-Auth-Token': loginId,
            };

            setHttpHeaders(headers);
    
            fetch(API_URLS.host + '/locales', {
                      method: 'GET', // Specify your HTTP method
                     // headers: headers, 
                 })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); })
                .then(data => {
                     console.log('Getting locales');
                     setallLanguages(data) })
                .catch(error => {
                     console.error('Error fetching data:', error); });

            fetch(API_URLS.host + '/projects', {
                      method: 'GET',
                      headers: headers, })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok'); }
                    return response.json(); 
                })
                .then(data => {
                     setProjects(data);
                     console.log('setting projects data done',JSON.stringify(projects, null, 2));
                })
                .catch(error => {
                     console.error('Error fetching data:', error); });
        }

    }, [keycloak]); 

    if (keycloak === null) {
        return (
                <main>
                    <div class="container-fluid px-4">
                        <h1 class="mt-4">Please Login</h1>
                    </div>
                </main>
        );
    } else {

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
                                                      </div>
                                                      <div class="col-auto">
                                                           <div class="form-check form-switch">
                                                             <input class="form-check-input" type="checkbox" role="switch" id="notifyme">
                                                             </input>
                                                           </div>
                                                      </div>
                                                  </div>
                                              </div>

                             <div class="list-group-item">
                                <label for="inputPassword5" class="form-label"><strong class="mb-0">Google Translate API Key</strong></label>
                                <input type="apikey" id="apikey" class="form-control" aria-describedby="apikey"></input>
                                <div id="passwordHelpBlock" class="form-text">
                                  Leave Your Google Translate API Key to use your account while using machine translation.
                                </div>
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
                                          {project.proj_name}
                                        </div>
                                        <div class="card-body">
                                          <h5 class="card-title">Translation Languages:</h5>
                                          <p class="card-text">

                                                {project_languages  && project_languages.map((language, languageIndex) => (
                                                 (language.proj_name === project.proj_name) &&
                                                  <span key={languageIndex}>
                                                    {language.localeId}
                                                    <button type="button"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#infoModal"
                                                            className="btn btn-light mx-1"
                                                            onClick={() => handleDeleteLanguage(projectIndex, languageIndex)}>
                                                      <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                  </span>
                                                ))}

                                          <button type="button"   
                                                  class="btn btn-light" 
                                                  data-bs-toggle="modal" 
                                                  onClick={() => setSelectedProjectIndex(projectIndex)}
                                                  data-bs-target="#exampleModal">
                                            <i class="fa-solid fa-plus"></i></button>
                                          </p>

                                          <h5 class="card-title">Project Activation Code</h5>
                                                <div className="col d-inline border">
                                                  {project.proj_api}
                                                </div>
                                                <div className="col-auto">
                                                  <button type="button" 
                                                          onClick={() => handleNewActiviationKey(projectIndex)}
                                                          className="btn btn-light btn-sm" aria-label="generateNew">Generate New</button>  
                                                  <button type="button"
                                                          onClick={() => copyActivationToClipboard(project.proj_api)}
                                                          className="btn btn-light btn-sm mx-1">Copy</button>
                                                </div>

                                          <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div className="modal-dialog"> <div className="modal-content"> <div className="modal-header">
                                                <h5 className="modal-title">Select Language</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                              </div>
                                              <div className="modal-body">
                                                <ul className="list-group">
                                                   {allLanguages.map((language, index) => (
                                                    <li key={index}
                                                      data-bs-dismiss="modal"
                                                      className="list-group-item list-group-item-action"
                                                      onClick={() => handleLanguageSelection(language.localeId)} >
                                                      {language.displayName} {language.localeId}
                                                    </li>
                                                  ))}
                                                </ul>
                                              </div>
                                              <div className="modal-footer">
                                                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                                              </div> </div> </div> 
                                          </div>

                                          <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmLabel" aria-hidden="true">
                                            <div class="modal-dialog">
                                              <div class="modal-content">
                                                <div class="modal-body">
                                                  {confirmMessage}
                                                </div>
                                                <div class="modal-footer">
                                                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                  <button type="button" 
                                                          class="btn btn-primary" 
                                                          data-bs-dismiss="modal"
                                                          onClick={() => handleConfirmYes()}>Confirm</button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>


                                          <div class="modal fade" id="infoModal" tabindex="-1" aria-labelledby="infoLabel" aria-hidden="true">
                                            <div class="modal-dialog">
                                              <div class="modal-content">
                                                <div class="modal-body">
                                                  {infoMessage}
                                                </div>
                                                <div class="modal-footer">
                                                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">OK</button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>


                                          <br />
                                          <button 
                                                  onClick={() => handleToConfirmRemoveProject(projectIndex)} 
                                                  data-bs-toggle="modal" data-bs-target="#confirmModal"
                                                  class="btn btn-secondary">Delete</button>
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
                                    <button class="btn btn-light"
                                            data-bs-toggle="modal" 
                                            data-bs-target="#confirmModal"
                                            onClick={() => handleToConfirmSaveProject()}>
                                            <i class="fa-solid fa-plus"></i></button>

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

