document.addEventListener("DOMContentLoaded", function () {
    // Get references to the input field, submit button, and result element
    const authButton = document.getElementById("authorize");
    const profileButton = document.getElementById("get-profile");
    const resultElement = document.getElementById("result");

    // Add a click event listener to the submit button
    authButton.addEventListener("click", async function () {
        authorize(); 
    });

    profileButton.addEventListener("click", async function () {
        //SOME FUNC
        resultElement.textContent = `SOME OUTPUT HERE`;
        

    });
});

function authorize() {

    //generate code verifer using this function
    //code verifier is a high-entropy cryptographic 
    //random string with a length between 43 and 128 characters
    function generateRandomString(length) {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      
        for (let i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }


    //The generateCodeChallenge function returns the base64 r
    //epresentation of the digest by calling to base64encode():
    async function generateCodeChallenge(codeVerifier) {
        function base64encode(string) {
            return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
        }
      
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
      
        return base64encode(digest);
      } 


    const clientId = 'beaa990bacba48fb9f2891ceb5599c61';
    const redirectUri = 'http://localhost:8080';

function redirectToSpotifyAuthorizeEndpoint() {
    const codeVerifier = generateRandomString(64);

    generateCodeChallenge(codeVerifier).then(codeChallenge => {
        let state = generateRandomString(16);
        let scope = 'user-read-private user-read-email';
      
        localStorage.setItem('code_verifier', codeVerifier);
      
        let args = new URLSearchParams({
          response_type: 'code',
          client_id: clientId,
          scope: scope,
          redirect_uri: redirectUri,
          state: state,
          code_challenge_method: 'S256',
          code_challenge: codeChallenge
        });
      
        window.location = 'https://accounts.spotify.com/authorize?' + args;
      });
  }

  function exchangeToken(code) {
    const codeVerifier = localStorage.getItem('code_verifier');

    let body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier
    });
      
    const response = fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('HTTP status ' + response.status);
          }
          return response.json();
        })
        .then(data => {
          localStorage.setItem('access_token', data.access_token);
          console.log(data.access_token)
          resultElement.innerHTML = '';
          resultElement.textContent = `Access token:`+ localStorage.getItem('code_verifier');
        })
        .catch(error => {
          console.error('Error:', error);
        });
  }

  redirectToSpotifyAuthorizeEndpoint(); 
  const urlParams = new URLSearchParams(window.location.search);
  let urlcode = urlParams.get('code');
  exchangeToken(urlcode); 

}