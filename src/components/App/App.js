import styles from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist'
import React, { useState } from "react";

function App () {
  const [searchResults, setSearchResults] = useState([
  {
    name: 'example name 1',
    artist: 'examlple artist 1',
    album: 'example album 1',
    id: 1,
  },
  {
    name: 'example name 2',
    artist: 'examlple artist 2',
    album: 'example album 2',
    id: 2,
  },
]);
    return (
        <div>
        <h1>
          Ja<span className={styles['highlight']}>mmm</span>ing
        </h1>
        <div className={styles["App"]}>
          {/* <!-- Add a SearchBar component --> */}
          <SearchBar></SearchBar>
          <div className={styles["App-playlist"]}>
            {/* <!-- Add a SearchResults component --> */}
            <SearchResults userSearchResults={searchResults} ></SearchResults>
            {/* <!-- Add a Playlist component --> */}
            
          </div>
        </div>
      </div>
        );
}

export default App;