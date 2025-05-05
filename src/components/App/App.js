import styles from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import React, { useState, useEffect } from "react";
import { goToPage, checkForCodeAndGetToken, search as spotifySearch} from '../../util/Spotify';

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      checkForCodeAndGetToken();
    }
  }, []);

  const [searchResults, setSearchResults] = useState([
    {
      name: 'example name 1',
      artist: 'example artist 1',
      album: 'example album 1',
      id: 1,
    },
    {
      name: 'example name 2',
      artist: 'example artist 2',
      album: 'example album 2',
      id: 2,
    },
  ]);

  const [playlistName, setPlaylistName] = useState('Example Playlist Name');
  const [playlistTracks, setPlaylistTracks] = useState([
    {
      name: 'example Playlist name 1',
      artist: 'example Playlist artist 1',
      album: 'example Playlist album 1',
      id: 11,
    },
    {
      name: 'example Playlist name 2',
      artist: 'example Playlist artist 2',
      album: 'example Playlist album 2',
      id: 22,
    },
  ]);

  function addTrack(track) {
    const existingTrack = playlistTracks.find(t => t.id === track.id);
    if (!existingTrack) {
      setPlaylistTracks(prev => [...prev, track]);
    } else {
      console.log('Track already exists');
    }
  }

  function removeTrack(track) {
    setPlaylistTracks(prev => prev.filter(t => t.id !== track.id));
  }

  function updatePlaylistName(name) {
    setPlaylistName(name);
  }

  function savePlaylist() {
    const trackURIs = playlistTracks.map((t) => t.uri);
    console.log("Saved Playlist URIs:", trackURIs);
  }

  function search(term) {
    console.log("Search term:", term);
    spotifySearch(term).then(results => {
      setSearchResults(results)
    })
  }

  return (
    <div>
      <div className={styles.topMenu}>
      <button className={styles.topBtn} onClick={goToPage}>Log in with Spotify</button>
      <h1>
        Ja<span className={styles['highlight']}>mmm</span>ing
      </h1>
      <div className={styles.fakeDiv} style={{width: "200px"}}></div>
      </div>
      <div className={styles["App"]}>
        <SearchBar onSearch={search} />
        <div className={styles["App-playlist"]}>
          <SearchResults userSearchResults={searchResults} onAdd={addTrack} />
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
