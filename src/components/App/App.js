import styles from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist'
import React from "react";

function App () {
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
            <SearchResults></SearchResults>
            {/* <!-- Add a Playlist component --> */}
            <Playlist></Playlist>
          </div>
        </div>
      </div>
        );
}

export default App;