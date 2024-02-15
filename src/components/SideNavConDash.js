import React, { useContext, useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import API_URLS from '../config';

const SideNavConDash = () => {

    const { isLoggedIn, keycloak } = useContext(AuthContext);
    const [documents, setDocuments] = useState([]);
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [mtOptions, setMTOptions] = useState([ { name: "Google Translate", id: "gtranslate" },
                                                 { name: "ChatGPT", id: "chatgpt" },
                                                 { name: "Amazon Translate", id: "amazontranslate" }
                                               ]);
    const [loadingMessage, setLoadingMessage] = useState("Loading...");

    const [selectedMTValue, setSelectedMTValue] = useState('gtranslate');
    const handleMTChange = (event) => {
        console.log("MT Change: " + event.target.value);
        setSelectedMTValue(event.target.value);
    };

    const handleStartTranslation = () => {
        setLoadingMessage("Starting translation[" + selectedDocuments +"]");
        setTimeout(function() {
            setLoadingMessage("working ... [" + selectedDocuments +"]");
        }, 5000);
        setTimeout(function() {
            setLoadingMessage("Done, translated to Korean.[" + selectedDocuments +"]");
        }, 10000);
        //setShowLanguageModal(false);
        // You can add the selected language to your project state here
//SHAO 
/*
        fetch(API_URLS.host + '/translations', {
              method: 'PUT',
              headers: httpHeaders,
              body: JSON.stringify({ "project": [language],
                                     "version":  })
                                     "targetLanguage":  })
                                     "document":  })

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
*/


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
        setSelectedDocuments(isChecked ? documents.map(doc => doc.doc_id) : []);
    };

    useEffect(() => {
        if (keycloak?.authenticated) {
            fetch(API_URLS.host + '/documents', {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`
                }
            })
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
        console.log("settings page" + isLoggedIn + keycloak);
        const tokenParsed = keycloak.tokenParsed;
        const loginId = tokenParsed?.preferred_username;
        console.log('Login ID:', loginId);
        const fullName = tokenParsed?.name;
        console.log('Full Name:', fullName);

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
                        </div>
                        <br />
                        <div class="row">
                            <div class="col-xl-3 col-md-6">
                                <h6>Languages:</h6>
                            </div>
                        </div>


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
                                            .filter(doument => doument.orig_doc_id === null)
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
                             <br />
                             {!loadingMessage.startsWith("Done") && (
                                 <div>
                                 <div class="spinner-border text-primary" role="status"></div>
                                 <br />
                                 </div>
                             )}
                             {loadingMessage}
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

