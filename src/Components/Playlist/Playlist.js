import React from "react";
import styles from './Playlist.module.css'
import Tracklist from '../Tracklist/Tracklist'

function Playlist(props) {
  function handleNameChange({target}) {
    props.onNameChange(target.value)
  }
  return (
    <div className={styles["Playlist"]}>
      <input defaultValue={"New Playlist"} onChange={handleNameChange} />
      {/* <!-- Add a TrackList component --> */}
      <div className={styles["SearchResults"]}>
      <Tracklist userSearchResults={props.playlistTracks} onRemove={props.onRemove} isRemoval={false} ></Tracklist>
      </div>
      <button className={styles["Playlist-save"]} onClick={props.onSave} >
        SAVE TO SPOTIFY
      </button>
    </div>
  );
}

export default Playlist;