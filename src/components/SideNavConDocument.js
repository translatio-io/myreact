import React, { useContext, useRef, useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 

const SideNavConDocument = () => {

    const { isLoggedIn, keycloak } = useContext(AuthContext);
    const textRef = useRef(null);
    const { docId } = useParams();
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [loadingMessage, setLoadingMessage] = useState("Loading...");

  
    const [selectedMTValue, setSelectedMTValue] = useState('gtranslate');
    const [mtOptions, setMTOptions] = useState([ { name: "Google Translate", id: "gtranslate" },
                                                 { name: "ChatGPT", id: "chatgpt" },
                                                 { name: "Amazon Translate", id: "amazontranslate" }
                                               ]);


    const handleMTChange = (event) => {
        console.log("MT Change: " + event.target.value);
        setSelectedMTValue(event.target.value);
    };

    const handleStartTranslation = () => {
        setLoadingMessage("Starting translation on " + title + " using machine translation.");
        console.log("start translation: " + selectedMTValue + " " + docId );
        setTimeout(function() {
            setLoadingMessage("Loading ... 1");
        }, 5000);
        setTimeout(function() {
            setLoadingMessage("Done, translated to Korean.");
        }, 10000);
        //setShowLanguageModal(false);
        // You can add the selected language to your project state here
    };


    console.log('document, making restapi call 1');

    useEffect(() => {
        if (keycloak?.authenticated) {
            fetchData();
        }
    }, [keycloak, docId]);

    const fetchData = () => {
        fetch(`http://localhost:3000/documents/${docId}`, {
            headers: {
                Authorization: `Bearer ${keycloak.token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            // Set retrieved data as the content
            console.log(" data : " + JSON.stringify(data));
            console.log(" data : " + data[0].doc_content);
            const formattedData = data[0].doc_content
              .replace(/\n/g, '<br>') // Replace newline characters with <br> tags
              .replace(/<!--/g, '&lt;!--') // Replace HTML comments with their escaped equivalents
              .replace(/-->/g, '--&gt;');

            setContent(formattedData); // Assuming data is in Quill Delta format
            setTitle(data[0].doc_title); // Assuming data is in Quill Delta format
        })
        .catch(error => {
            console.error('Error fetching document:', error);
        });
    };

    console.log('document, making restapi call 2');
    const handleChange = (value) => {
      // Handle change of Quill editor content
      setContent(value);
    };


    if (keycloak === null) {
        return (
                <main>
                    <div class="container-fluid px-4">
                        <h1 class="mt-4">Please Login</h1>
                    </div>
                </main>
        );
    } else {
        console.log("document id " + docId);
        const tokenParsed = keycloak.tokenParsed;
        const loginId = tokenParsed?.preferred_username;
        console.log('Login ID:', loginId);
        const fullName = tokenParsed?.name;

        const accessToken = keycloak.token;
        const headers = {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        };


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
                        <h1 class="mt-4">Document</h1>
                        <ol class="breadcrumb mb-4">
                            <li class="breadcrumb-item active">{title}/{docId} </li>
                        </ol>
                      <hr />

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
                      <br />

                      <div class="w-75 shadow p-3 mb-5 bg-body rounded">
                            <ReactQuill
                              theme="snow" // Specify the theme ('snow' or 'bubble')
                              dangerouslySetInnerHTML={{ __html: content }} // Set the content using dangerouslySetInnerHTML
                              value={content}
                              onChange={handleChange} />
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

                </main>
           );
       }
    }
};
export default SideNavConDocument;

