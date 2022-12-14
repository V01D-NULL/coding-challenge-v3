"use strict";

const popup = { 
    'div': document.getElementById("popup"),
    'html': document.getElementById("popup").innerHTML
};

const overlay = document.getElementById("overlay");
const resultsDiv = document.getElementById('repository-results');

function EnablePopup(enable=true) {
    popup['div'].style.display = enable ? 'block' : 'none';
    overlay.style.display = enable ? 'block' : 'none';
    
    // Reset the div to it's original state
    if (!enable)
        ResetPopup();
}

function ResetPopup() {
    popup['div'].innerHTML = popup['html'];
}

// Hook into the submit event of the repo-search-form, then request and load
// information from the remote api.
document.getElementById('view-repo-form').addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    viewRepositories(username);
});

// In a professional setting, `resultsDiv.innerHTML` would be cached
// and a refresh would use some sort of client prediction to reduce the
// number of calls going out to the API, thus saving bandwidth.
//
// However, considering the limited usage and usefulness of this program I decided not to implement it.
const refreshRepositories = (username) => viewRepositories(username);
function viewRepositories(username) {
    // Wait for the promise...
    const jsonDataPromise = apiRequest(`/api/repositories?username=${username}`);
    jsonDataPromise.then(data => {
        resultsDiv.style.visibility = 'visible';
        resultsDiv.innerHTML = '';
        
        // Iterate over each repository
        data.forEach(element => {
                const jsonObj = JsonToObject(element);

                // Request the "like status" of every repository
                apiRequest(`/api/rate?name=${username}_${jsonObj.name}`).then(rating => {

                resultsDiv.innerHTML +=
                    `
                        <hr>
                        <b>${jsonObj.name}</b>
                        <br>
                        <p>
                        ${
                            !jsonObj.description ? 'No description provided' : jsonObj.description
                        }
                        <br>
                        <button onclick="enableCommentBox('${username}', '${jsonObj.name}')">Leave a comment</button>
                        <button onclick="viewComments('${username}', '${jsonObj.name}')">View comments</button>
                        <button onclick="apiRateRepository('${username}', '${jsonObj.name}', '${"range-slider_"+jsonObj.name}')">Rate</button>
                        
                        <div>
                        Slider range: [1-5]
                        <br>
                        <input type="range" min="1" max="5" value="2.7" id="${"range-slider_"+jsonObj.name}">
                        </div>

                        Average rating: ${rating.average}
                        <br>
                        </p>
                        `;
                });
            });
        });
}

// Create a little pop-up window and display all comments for a given repo
const refreshComments = (username, repo) => viewComments(username, repo);
function viewComments(username, repo) {
    const jsonDataPromise = apiRequest(`/api/comment?name=${username}_${repo}`);	
    
    jsonDataPromise.then(data => {
        EnablePopup();
        popup['div'].innerHTML = 
            `
                <span id="close-popup" onclick="EnablePopup(false)">&times;</span>
                <h2>Comments</h2>
            `;

        data.forEach(element => {
            const jsonObj = JsonToObject(element);
            popup['div'].innerHTML += 
                `
                    <hr>
                    <b>Repository: ${jsonObj.name} </b>
                    <br>
                    ${jsonObj.comment}
                    <br>
                    <button onclick="apiDeleteComment('${jsonObj.name}', '${jsonObj.id}')">Delete</button>
                    <button onclick="apiEditComment('${jsonObj.name}', '${jsonObj.id}')">Edit</button>
                `;
        });
    });
}

function enableCommentBox(username, repo) {
    EnablePopup();
    popup['div'].children.namedItem('submit-comment').addEventListener("click", event => apiSubmitComment(username, repo));
}

const disableCommentBox = () => EnablePopup(false);