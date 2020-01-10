import React from "react";
import "./Playlist.css";
import TrackList from "../TrackList/TrackList";

class Playlist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mostCurrentPlaylist: []
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.save = this.save.bind(this);
  }
  handleNameChange(event) {
    this.props.onNameChange(event.target.value);
  }
  save() {
    if (!this.props.justSaved) {
      this.props.onSave();
      this.setState({
        mostCurrentPlaylist: this.props.playlistTracks
      });
    }
  }
  render() {
    let saveButton;
    if (!this.props.justSaved) {
      saveButton = (
        <button className="Playlist-save" onClick={this.save}>
          SAVE TO SPOTIFY
        </button>
      );
    } else {
      saveButton = (
        <button className="Playlist-save-disabled" disabled onClick={this.save}>
          SAVED!
        </button>
      );
    }
    return (
      <div className="Playlist">
        <input defaultValue={"New Playlist"} onChange={this.handleNameChange} />{" "}
        <TrackList
          tracks={this.props.playlistTracks}
          onRemove={this.props.onRemove}
          isRemoval={true}
        />{" "}
        {saveButton}
      </div>
    );
  }
}

export default Playlist;
