import React, { useContext, useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import API_URLS from '../config';

const SideNavConDash = () => {

    const { isLoggedIn, keycloak } = useContext(AuthContext);
    const [httpHeaders, setHttpHeaders] = useState('');
    const [currProject, setCurrProject] = useState('');
    const [projects, setProjects] = useState([]);
    const [project_versions, setProjectVersions] = useState([]);
    const [user_languages, setUserLanguages] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [loadingMessage, setLoadingMessage] = useState("Loading...");
    const [spinnerActive, setSpinnerActive] = useState(false);

    const [mtOptions, setMTOptions] = useState([ { name: "Google Translate", id: "gtranslate" },
                                                 { name: "ChatGPT", id: "chatgpt" },
                                                 { name: "Amazon Translate", id: "amazontranslate" }
                                               ]);
    const [selectedMTValue, setSelectedMTValue] = useState('gtranslate');
    const [selectedLanguageValue, setSelectedLanguageValue] = useState("");

    const handleMTChange = (event) => {
        console.log("MT Change: " + event.target.value);
        setSelectedMTValue(event.target.value);
    };

    const handleChangeProject = (event) => {
        console.log("change project:", event.target.value);
        setCurrProject(event.target.value);
    };

    const handleStartTranslation = () => {
        setSpinnerActive(true);
        let dialogMessage = "Number of documents to be processed: " + selectedDocuments.length + "\n" +
                            "Target language: " + selectedLanguageValue + "\n" +
                            "Engine: " + selectedMTValue + "\n";
        setLoadingMessage(dialogMessage);
        console.log("dialogMessage: ", dialogMessage);
        const promises = selectedDocuments.map(element => {
            const index = documents.findIndex(document => document.doc_id === element);
            const document = documents[index];
            console.log("Processing ... ", document.doc_title);
            console.log("Processing ... ", document.ver_name);
            console.log("Processing ... ", document.proj_name);
            //const dialogMessage = `Translating ${document.doc_title} to: ${selectedLanguageValue}\nProject: ${document.proj_name} version: ${document.ver_name}\n`;
        
            //setLoadingMessage(prevMessage => prevMessage + dialogMessage);
        
            return fetch(API_URLS.host + '/translations', {
                method: 'PUT',
                headers: httpHeaders,
                body: JSON.stringify({
                    project: document.proj_name,
                    engine: selectedMTValue,
                    targetLanguage: selectedLanguageValue,
                    document: document.doc_title
                })
            })
            .then(response => {
                console.log("Doing translation:", response.status);
                if (response.ok) {
                    console.log("Response ok after calling for translation");
                }
                if (!response.ok) {
                    console.log("Response not ok");
                    // You may handle non-ok responses differently here
                }
                return Promise.all([response.json(), response.status]);
            })
            .then(([data, http_code]) => {
                console.log("=================");
                console.log("Code " + http_code);
                console.log(JSON.stringify(data));
    //console.log("dialogMessage: ", dialogMessage);
                dialogMessage = dialogMessage +  http_code + " " + JSON.stringify(data) + "\n";
    //console.log("dialogMessage: ", dialogMessage);
                setLoadingMessage(dialogMessage);
            })
            .catch(error => {
                const errorMessage = `Error: ${error}\n`;
                setLoadingMessage(prevMessage => prevMessage + errorMessage);
                console.log('Error fetching data:', error);
            });
        });
        
        Promise.all(promises)
            .then(() => {
                //setLoadingMessage(prevMessage => prevMessage + "\nFinished All");
            })
            .catch(error => {
                console.log('Error handling requests:', error);
                dialogMessage = dialogMessage + "Error: " + error + "\n";
                setLoadingMessage(dialogMessage);
                console.log('Error fetching data:', error);
                throw error;
            })
            .finally(() => {
                setSpinnerActive(false);
            });


        //dialogMessage = dialogMessage + "\nDone";
        //setLoadingMessage(dialogMessage);

    };


    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const handleDocumentSelect = (doc_id) => {
        if (selectedDocuments.includes(doc_id)) {
            setSelectedDocuments(selectedDocuments.filter(id => id !== doc_id));
        } else {
            setSelectedDocuments([...selectedDocuments, doc_id]);
        }
    };

    const handleChooseAll = (event) => {
        const isChecked = event.target.checked;
        setSelectAllChecked(isChecked);
        //setSelectedDocuments(isChecked ? documents.map(doc => doc.doc_id) : []);
        setSelectedDocuments(isChecked ? documents.filter(doc => doc.orig_doc_id === null).map(doc => doc.doc_id) : []);

    };

    useEffect(() => {

        if (keycloak?.authenticated) {
            const accessToken = keycloak.token;
            const tokenParsed = keycloak.tokenParsed;
            const loginId = tokenParsed?.preferred_username;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                //'X-Auth-User': loginId,
                //'X-Auth-Token': loginId,
            };
            setHttpHeaders(headers);

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
                     if (data.length > 0) {
                         setCurrProject(data[0].proj_name);
                     }
                     console.log('setting projects data done',JSON.stringify(projects, null, 2));
                })
                .catch(error => {
                     console.error('Error fetching data:', error); });
            /***
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
            */
            fetch(API_URLS.host + '/user/languages', {
                           method: 'GET',
                           headers: headers, })
                     .then(response => {
                         if (!response.ok) {
                             throw new Error('Network response was not ok'); }
                         return response.json(); })
                     .then(data => {
                          console.log('Getting user languages');
                          console.log("versions=",JSON.stringify(data, null, 2));
                          setUserLanguages(data);
                          if (data.length > 0) {
                              setSelectedLanguageValue(data[0].localeId)
                          }
                      })
                     .catch(error => {
                          console.error('Error fetching data:', error);
                     });
            fetch(API_URLS.host + '/documents', {
                           method: 'GET',
                           headers: headers, })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch documents');
                    }
                    return response.json();
                })
                .then(data => {
                    setDocuments(data);
                })
                .catch(error => {
                    console.error('Error fetching documents:', error);
                });
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
        const tokenParsed = keycloak.tokenParsed;
        const loginId = tokenParsed?.preferred_username;
        console.log('Login ID:', loginId);
        //const fullName = tokenParsed?.name;
        //console.log('Full Name:', fullName);

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
                        <h1 class="mt-4">Dashboard</h1>
                        <ol class="breadcrumb mb-4">
                            <li class="breadcrumb-item active">Dashboard</li>
                        </ol>

                        <div class="row">
                            <div class="col-xl-3 col-md-6 d-flex align-items-center">
                                <span class="me-2">Project:</span>
                                <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={handleChangeProject} value={currProject}>
                                    <option disabled selected>Choose Project ...</option>
                                    {projects.map((project, projectIndex) => (
                                        <option key={project.proj_name} value={project.proj_name}>{project.proj_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <br />
                        <div class="row">
                            <div class="col-auto">
                                <h6>Target Languages:</h6>

                                    {user_languages
                                      .filter(language => language.proj_name === currProject) // Filter languages based on the condition
                                      .map((language, index) => (
                                        <div className="form-check d-inline-block" key={index}>
                                          <input
                                            className="form-check-input"
                                            type="radio"
                                            name="languageRadios"
                                            id={`language${index}`}
                                            value={language.localeId}
                                            checked={selectedLanguageValue === language.localeId}
                                            onChange={() => { setSelectedLanguageValue(language.localeId) }}
                                          />
                                          <label className="form-check-label pe-3" htmlFor={`language${index}`}>
                                            <i className="bi bi-heart"></i>{language.localeId}
                                          </label>
                                        </div>
                                    ))}

                            </div>
                        </div>
                        <br />

                      <div className="row">
                        <div className="col-auto">
                            {mtOptions.map((option, index) => (
                                <div className="form-check d-inline-block" key={index}>
                                  <input className="form-check-input"
                                       type="radio"
                                       name="exampleRadios"
                                       id={`mtoption${index}`} // Use unique IDs for each radio button
                                       value={option.id}
                                       checked={selectedMTValue === option.id} // Check if selectedMTValue matches the option's ID
                                       onChange={handleMTChange} />
                                  <label className="form-check-label pe-3" htmlFor={`mtoption${index}`}>
                                      <i className="bi bi-heart"></i>{option.name}
                                  </label>
                                </div>
                            ))}
                        <button type="button"
                               class="btn btn-primary btn-sm"
                               data-bs-toggle="modal"
                               onClick={() => handleStartTranslation()}
                               data-bs-target="#applyTranslationModal">Machine Translate
                         </button>

                        </div>
                      </div>




                      <hr />

                        <div class="card mb-4">
                            <div class="card-header">
                                <i class="fas fa-table me-1"></i>
                                Documents
                            </div>
                            <div class="card-body">
                                <table class="table table-stripped">
                                    <thead>
                                        <tr>
                                            <th><input type="checkbox" 
                                                       onChange={handleChooseAll}
                                                       checked={selectAllChecked}
                                                       /></th>
                                            <th>Title</th>
                                            <th>Name</th>
                                            <th>Translations</th>
                                        </tr>
                                    </thead>
                                    <tfoot>
                                        <tr>
                                            <th><input type="checkbox" 
                                                       onChange={handleChooseAll}
                                                       checked={selectAllChecked}
                                                       /></th>
                                            <th>Title</th>
                                            <th>Name</th>
                                            <th>Translations</th>
                                        </tr>
                                    </tfoot>

                                    <tbody>
                                        {documents
                                            .filter(document => document.orig_doc_id === null && document.proj_name === currProject)
                                            .map(document => (
                                            <tr key={document.doc_id}>
                                              <td><input type="checkbox" 
                                                         checked={selectedDocuments.includes(document.doc_id)}
                                                         onChange={() => handleDocumentSelect(document.doc_id)} /></td>
                                              <td><div><a class="nounderline" href={`/document/${document.doc_id}`}>{document.doc_title}</a>
                                                  </div>
                                              </td>
                                              <td>{document.doc_name}</td>
                                              <td>                   
                                                  {documents
                                                      .filter(translation => translation.orig_doc_id === document.doc_id)
                                                      .map(translation => (
                                                          <div key={translation.translation_id}>
                                                               <a class="nounderline" href={`/document/${translation.doc_id}`}>{translation.doc_language}</a>
                                                          </div>
                                                      ))
                                                  }

                                              </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>


                      <div class="modal fade" id="applyTranslationModal" tabindex="-1" aria-labelledby="applyTranslationLabel" aria-hidden="true">
                        <div className="modal-dialog modal-lg"> <div className="modal-content"> <div className="modal-header">
                            <h5 className="modal-title">Applying Translation</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div className="modal-body">
                             {spinnerActive && <div className="spinner-border text-primary" role="status"></div>}
                             <br />
                             {loadingMessage.split('\n').map((message, index) => (
                             <div key={index}>{message}</div>
                             ))}
                          </div>
                          <div className="modal-footer">
                            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                          </div> </div> </div>
                      </div>

                    </div>
                </main>

            );
        }
    }
};
export default SideNavConDash;

