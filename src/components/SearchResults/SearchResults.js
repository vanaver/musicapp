import React from "react";
import styles from './SearchResults.module.css'
import Tracklist from '../Tracklist/Tracklist'

function SearchResults () {
    return (
        <div className={styles["SearchResults"]}>
        {/* <!-- Add a TrackList component --> */}
        <Tracklist></Tracklist>
      </div>
        );
}

export default SearchResults;