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
  const [playlistName, setPlaylistName] = useState('Example Playlist Name');
  const [playlistTracks, setPlaylistTracks] = useState([
    {
      name: 'example Playlist name 1',
      artist: 'examlple Playlist artist 1',
      album: 'example Playlist album 1',
      id: 11,
    },
    {
      name: 'example Playlist name 2',
      artist: 'examlple Playlist artist 2',
      album: 'example Playlist album 2',
      id: 22,
    },
  ]);

  function addTrack (track) {
    const existingTrack = playlistTracks.find(t => t.id === track.id);
    const newTrack = playlistTracks.concat(track);
    if (existingTrack) {
      console.log('Track already exists')
    } else {
      setPlaylistTracks(newTrack);
    }
  };
  function removeTrack (track) {
    const existingTrack = playlistTracks.filter((t) => t.id !== track.id);
    setPlaylistTracks(existingTrack);
  };
  function updatePlaylistName(name) {
    setPlaylistName(name)
  };
  function savePlaylist() {
    const trackURIs = playlistTracks.map((t) => t.uri)
  };
  function search(term) {
    console.log(term)
  }

    return (
        <div>
        <h1>
          Ja<span className={styles['highlight']}>mmm</span>ing
        </h1>
        <div className={styles["App"]}>
          {/* <!-- Add a SearchBar component --> */}
          <SearchBar onSearch={search} />
          <div className={styles["App-playlist"]}>
            {/* <!-- Add a SearchResults component --> */}
            <SearchResults userSearchResults={searchResults} onAdd={addTrack} ></SearchResults>
            {/* <!-- Add a Playlist component --> */}
            <Playlist 
              playlistName={playlistName} 
              playlistTracks={playlistTracks} 
              onRemove={removeTrack}
              onNameChange={updatePlaylistName} 
              onSave={savePlaylist}
            />
          </div>
        </div>
      </div>
        );
}

export default App;