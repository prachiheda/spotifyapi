


const APIController = (function() {
    
    const clientId = '5e1f734c35e6497eb9cfed64c4b18538';
    const clientSecret = '12957dfa97854c44b1c9deae2e10a037';

    // private methods
    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }
    
    // const _getGenres = async (token) => {

    //     const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
    //         method: 'GET',
    //         headers: { 'Authorization' : 'Bearer ' + token}
    //     });

    //     const data = await result.json();
    //     return data.categories.items;
    // }

    // const _getPlaylistByGenre = async (token, genreId) => {

    //     const limit = 10;
        
    //     const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
    //         method: 'GET',
    //         headers: { 'Authorization' : 'Bearer ' + token}
    //     });

    //     const data = await result.json();
    //     return data.playlists.items;
    // }

    const _getPlaylist = async (token, playlistId) => {
        
        const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        const track = data.items.track; // Accessing the first track object in the playlist
        const trackPopularity = track.popularity;
        return trackPopularity
    }

    // const _getTracks = async (token, tracksEndPoint) => {

    //     const limit = 10;

    //     const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
    //         method: 'GET',
    //         headers: { 'Authorization' : 'Bearer ' + token}
    //     });

    //     const data = await result.json();
    //     return data.items;
    // }

    // const _getTrack = async (token, trackEndPoint) => {

    //     const result = await fetch(`${trackEndPoint}`, {
    //         method: 'GET',
    //         headers: { 'Authorization' : 'Bearer ' + token}
    //     });

    //     const data = await result.json();
    //     return data;
    // }

    return {
        getToken() {
            return _getToken();
        },
        // getGenres(token) {
        //     return _getGenres(token);
        // },
        getPlaylist(token, playlistId) {
            return _getPlaylist(token, playlistId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        }
        // getTrack(token, trackEndPoint) {
        //     return _getTrack(token, trackEndPoint);
        // }
    }
})();


document.addEventListener("DOMContentLoaded", function () {
    // Get references to the input field, submit button, and result element
    const inputField = document.getElementById("input-field");
    const submitButton = document.getElementById("submit-button");
    const resultElement = document.getElementById("result");

    // Add a click event listener to the submit button
    submitButton.addEventListener("click", async function () {
        // Get the value of the input field
        const inputValue = inputField.value;

        // Call a function with the input value
        getPlaylistScore(inputValue);
    });

    // Function to process the input value
    async function getPlaylistScore(value) {
        const token = await APIController.getToken();
        const songs = await APIController.getPlaylist(token, value);
        // resultElement.innerHTML = '';
        // var totalScore = 0; 
        // var totalTracks = 0; 
        // songs.forEach(song=> {
        //     const trackPop = song.track.popularity;
        //     totalScore += trackPop;
        //     totalTracks ++; 
        // })
        // var playlistPop = totalScore/totalTracks; 
        // //const statement = `Your playlists popularity score: ${playlistPop}`;
        resultElement.textContent = songs;
        console.log(typeof songs)
    
        
        

    }
});
