import React from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../util/Spotify";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistTracks: [],
      playlistName: "New Playlist",
      justSaved: false,
      loggedIn: Spotify.isLoggedIn()
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updateTracks = this.updateTracks.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.authorize = this.authorize.bind(this);
  }

  authorize() {
    Spotify.getAccessToken();
    this.setState({ loggedIn: true });
  }
  search(searchTerm) {
    Spotify.search(searchTerm).then(tracks =>
      this.setState({
        searchResults: tracks
      })
    );
  }
  savePlaylist() {
    let tracks = this.state.playlistTracks;
    let name = this.state.playlistName;
    Spotify.savePlaylist(name, tracks);
    this.setState({ justSaved: true });
  }
  updatePlaylistName(newName) {
    this.setState({
      playlistName: newName
    });
  }
  updateTracks(newTracks) {
    this.setState({
      playlistTracks: newTracks
    });
  }
  addTrack(track) {
    this.setState({ justSaved: false });
    if (
      this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)
    ) {
      return;
    }
    let tempTracks = this.state.playlistTracks;
    tempTracks.push(track);
    this.updateTracks(tempTracks);
  }
  removeTrack(track) {
    this.setState({ justSaved: false });
    let tempTracks = this.playlistTracks;
    tempTracks = this.state.playlistTracks.filter(
      savedTrack => savedTrack.id !== track.id
    );
    this.updateTracks(tempTracks);
  }
  render() {
    return (
      <div>
        <h1>
          {" "}
          Ja <span className="highlight"> mmm </span>ing
        </h1>
        <div className="App">
          <SearchBar
            onSearch={this.search}
            loggedIn={this.state.loggedIn}
            authorize={this.authorize}
          />{" "}
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />{" "}
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onAdd={this.addTrack}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
              justSaved={this.state.justSaved}
            />{" "}
          </div>{" "}
        </div>{" "}
      </div>
    );
  }
}

export default App;
