import React from "react";
import "./SearchBar.css";
class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.authorize = this.authorize.bind(this);
  }

  handleTermChange(event) {
    this.setState({
      searchTerm: event.target.value
    });
  }
  search() {
    if (this.state && this.state.searchTerm) {
      this.props.onSearch(this.state.searchTerm);
    }
  }
  authorize() {
    this.props.authorize();
  }

  handleEnter() {
    const listener = event => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        this.search();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }

  render() {
    let searchButton;

    searchButton = (
      <button className="SearchButton" onClick={this.search}>
        {" "}
        SEARCH{" "}
      </button>
    );

    return (
      <div className="SearchBar">
        <input
          placeholder="Enter A Song, Album, or Artist"
          onChange={this.handleTermChange}
          onKeyDown={this.handleEnter}
        />{" "}
        {searchButton}
      </div>
    );
  }
}
export default SearchBar;
