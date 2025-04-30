import React from "react";
import styles from './Playlist.module.css'
import Tracklist from '../Tracklist/Tracklist'

function Playlist() {
  return (
    <div className="Playlist">
      <input defaultValue={"New Playlist"} />
      {/* <!-- Add a TrackList component --> */}
      <Tracklist></Tracklist>
      <button className="Playlist-save">
        SAVE TO SPOTIFY
      </button>
    </div>
  );
}

export default Playlist;