import React, { useContext, useRef, useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import API_URLS from '../config';


const SideNavConDocument = () => {

    const { isLoggedIn, keycloak } = useContext(AuthContext);
    const [isMarkupVisible, setIsMarkupVisible] = useState(false);
    const textRef = useRef(null);
    const { docId } = useParams();
    const [content, setContent] = useState('');
    const [contentRaw, setContentRaw] = useState('');
    const [markupArray, setMarkupArray] = useState([]);
    const [contentNoMarkup, setContentNoMarkup] = useState('');
    const [title, setTitle] = useState('');
    const [loadingMessage, setLoadingMessage] = useState("Loading...");

    function toFile(htmlContent) {
      const escapedHTML = htmlContent
        .replace(/<br>/g, '\n') // Replace <br> tags with newline characters
        .replace(/&lt;!--/g, '<!--') // Replace escaped HTML comments with their original equivalents
        .replace(/--&gt;/g, '-->'); 
      return escapedHTML;
    }

    function toHtml(storageContent) {
      const originalHTML = storageContent
        .replace(/\n/g, '<br>') // Replace newline characters with <br> tags
        .replace(/<!--/g, '&lt;!--') // Replace HTML comments with their escaped equivalents
        .replace(/-->/g, '--&gt;');
      return originalHTML;
    }
  
    const [selectedMTValue, setSelectedMTValue] = useState('gtranslate');
    const [mtOptions, setMTOptions] = useState([ { name: "Google Translate", id: "gtranslate" },
                                                 { name: "ChatGPT", id: "chatgpt" },
                                                 { name: "Amazon Translate", id: "amazontranslate" }
                                               ]);


    const handleMTChange = (event) => {
        console.log("MT Change: " + event.target.value);
        setSelectedMTValue(event.target.value);
    };

    const handleSaveClick = () => {
        console.log("Save button",JSON.stringify({ "data": toFile(content)}));
        fetch(API_URLS.host + '/documents/' + docId, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${keycloak.token}`,
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({ data: toFile(content) })

        })
        .then(response => {
            if (response.ok) {
                console.log("response ok");
            } else {
                console.log("response not ok");
                //throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            console.error('Error fetching document:', error);
        });

    }

    const handleMarkupVisbleClick = () => {
        setIsMarkupVisible(!isMarkupVisible); // Toggle the visibility status
        if (isMarkupVisible) {
            let contentBuffer = "";
            contentBuffer = toFile(content);
            if (markupArray.length > 0) {
                markupArray.forEach((match, index) => {
                    contentBuffer = contentBuffer.replace(`<!-- TMY_TAG_${index} -->`, match);
                });
                setContent(toHtml(contentBuffer));
            }
        } else {
            setContentRaw(content);
            let contentBuffer = "";
            const fusionPattern = /\[[^\]]+\]/g;
            let index = -1;
            let fusionMatches = [];
            contentBuffer = content.replace(fusionPattern, function(match) {
                index = index + 1;
                fusionMatches[index] = match;
                return `<!-- TMY_TAG_${index} -->`;
            });
            contentBuffer = toHtml(contentBuffer);
            setContent(contentBuffer);

            setContentNoMarkup(contentBuffer);
            setMarkupArray(fusionMatches);
            setContentRaw(content);


        }
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
            const formattedData = toHtml(data[0].doc_content);
            setContent(formattedData);
            setTitle(data[0].doc_title);
        })
        .catch(error => {
            console.error('Error fetching document:', error);
        });
    };

    console.log('document, making restapi call 2');
    const handleChange = (value) => {
      // Handle change of Quill editor content
      console.log("handle Change: ");
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

                          <div class="d-flex bd-highlight mb-1">
                            <div class="p-2 bd-highlight">
                               <button
                                  type="button"
                                  className={`btn btn-light btn-sm ${isMarkupVisible ? 'active' : ''}`}
                                  onClick={handleMarkupVisbleClick}
                                  data-bs-toggle="button"
                                  aria-pressed={isMarkupVisible ? 'true' : 'false'}
                                >
                                  {isMarkupVisible ? 'Hide Markup' : 'Hide Markup'}
                                </button>
                            </div>
                            <div class="ms-auto p-2 bd-highlight">
                                  <button type="button" 
                                          onClick={handleSaveClick}
                                          className="btn btn-primary">Save</button>
                          
                            </div>
                          </div>

                            <ReactQuill
                               theme="snow"
                               value={content}
                               modules={{
                                 toolbar: [
                                   [{ 'header': [1, 2, 3, false] }],
                                   ['clean']
                                 ]
                               }}
                               onChange={handleChange}
                            />

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

