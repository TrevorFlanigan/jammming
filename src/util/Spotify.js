let accessToken;
let expiresIn;
const clientId = "84499fa9ae194cc4a8c491974170f497";
const redirectURI = "http://trevjammming.surge.sh/";
// const redirectURI = "http://false-nose.surge.sh/";

let Spotify = {
  //retrieves the user's access token from the Spotify API
  getAccessToken() {
    console.log("got here");
    if (accessToken) {
      return accessToken;
    } else {
      //gets the access token and expiry time as objects from the spotify link
      let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
      let expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
      if (accessTokenMatch && expiresInMatch) {
        accessToken = accessTokenMatch[1];
        expiresIn = expiresInMatch[1];
        window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
        window.history.pushState("Access Token", null, "/");
        return accessToken;
      } else {
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        accessToken = null;
        expiresIn = null;
      }
    }
  },

  isLoggedIn() {
    const accessToken = Spotify.getAccessToken();
    let urlToFetch = `https://api.spotify.com/v1/me`;
    let headers = {
      Authorization: `Bearer ${accessToken}`
    };

    return fetch(urlToFetch, {
      method: "GET",
      headers: headers
    })
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.error) {
          return false;
        } else {
          return true;
        }
      });
  },

  //handles the search button pressed event
  async search(searchTerm) {
    const accessToken = Spotify.getAccessToken();
    let urlToFetch = `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`;
    let headers = {
      Authorization: `Bearer ${accessToken}`
    };
    return fetch(urlToFetch, {
      headers: headers
    })
      .then(response => response.json())
      .then(jsonResponse => {
        if (!jsonResponse) {
          return [];
        } else {
          let tracks = jsonResponse.tracks.items.map(track => {
            return {
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri
            };
          });
          return tracks;
        }
      });
  },
  //saves the stored playlist to the user's Spotify account

  savePlaylist(playlistName, tracks) {
    let trackURIs = tracks.map(track => track.uri);
    if (!playlistName || !trackURIs.length) {
      return;
    }
    //variable declaration
    let accessToken = Spotify.getAccessToken();
    let headers = {
      Authorization: `Bearer ${accessToken}`
    };
    let userID;
    let playlistID;
    let urlToFetch = "https://api.spotify.com/v1/me";

    //fetch and convert to json
    return fetch(urlToFetch, {
      headers: headers
    })
      .then(response => response.json())
      .then(jsonResponse => {
        userID = jsonResponse.id;
        urlToFetch = `https://api.spotify.com/v1/users/${userID}/playlists`;
        return fetch(urlToFetch, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            name: playlistName
          })
        });
      })
      .then(response => response.json())
      .then(jsonResponse => {
        playlistID = jsonResponse.id;
        urlToFetch = `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`;
        console.log(playlistID);
        return fetch(urlToFetch, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            uris: trackURIs
          })
        });
      });
  }
};

export default Spotify;
