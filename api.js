// Load the API client and auth2 library
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

// Initialize the API client library and set up sign-in state
function initClient() {
    gapi.client.init({
        apiKey: '',
        clientId: '100277052577976532062',
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
        scope: "https://www.googleapis.com/auth/drive.file"
    }).then(() => {
        // Listen for sign-in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle the initial sign-in state
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

// Update the UI based on the sign-in status
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        document.getElementById('uploadButton').onclick = uploadFile;
    } else {
        gapi.auth2.getAuthInstance().signIn();
    }
}

// Upload file to Google Drive
function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const metadata = {
            'name': file.name,
            'mimeType': file.type,
            'parents': ['1KMKG_IE4h1nRu1DEpCVr-lR4tPdYix0D'] // Optional: specify a folder ID
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', file);

        fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: new Headers({ 'Authorization': 'Bearer ' + gapi.auth.getToken().access_token }),
            body: form
        }).then((response) => {
            return response.json();
        }).then((data) => {
            document.getElementById('status').innerText = 'Upload successful: ' + data.id;
        }).catch((error) => {
            document.getElementById('status').innerText = 'Upload failed: ' + error.message;
        });
    }
}

// Load the API client and auth2 library
document.addEventListener('DOMContentLoaded', handleClientLoad);