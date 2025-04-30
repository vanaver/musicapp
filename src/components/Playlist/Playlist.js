import React from "react";
import styles from './Playlist.module.css'
import Tracklist from '../Tracklist/Tracklist'

function Playlist(props) {
  return (
    <div className={styles["Playlist"]}>
      <input defaultValue={"New Playlist"} />
      {/* <!-- Add a TrackList component --> */}
      <Tracklist userSearchResults={props.playlistTracks} ></Tracklist>
      <button className={styles["Playlist-save"]}>
        SAVE TO SPOTIFY
      </button>
    </div>
  );
}

export default Playlist;