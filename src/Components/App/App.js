import styles from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import React, { useState, useEffect } from "react";
import { addTracksToPlaylist, createPlaylist, getCurrentUserId, goToPage, isAccessTokenValid, checkForCodeAndGetToken, search as spotifySearch} from '../../util/Spotify';

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    console.log(isAccessTokenValid());
    if (code) {
      checkForCodeAndGetToken();
    }
  }, []);

  const [searchResults, setSearchResults] = useState([
    {},
  ]);

  const [playlistName, setPlaylistName] = useState('Example Playlist Name');
  const [playlistTracks, setPlaylistTracks] = useState([
    {},
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

  async function savePlaylist() {
    const trackURIs = playlistTracks.map((t) => t.uri);
    const validTrackURIs = trackURIs.filter(uri => uri); // убирает undefined/null
    console.log("Saved Playlist URIs:", trackURIs);
    const userId = await getCurrentUserId();
    const playlistId = await createPlaylist(userId, playlistName);
    console.log("Создан плейлист с ID:", playlistId);
    if (!playlistId) return;

    const success = await addTracksToPlaylist(playlistId, validTrackURIs);
    if (success) {
      alert("Плейлист успешно сохранён!");
      setPlaylistTracks([]); // ✅ Очистка треков
      setPlaylistName("Новый плейлист"); // ✅ Сброс названия
    }
  }

  function search(term) {
    console.log("Search term:", term);
    if (!isAccessTokenValid()) {
      window.location.reload();
    };
    spotifySearch(term).then(results => {
      setSearchResults(results)
    });
    
  }


  return (
    <div>
      <div className={styles.topMenu}>
      {!isAccessTokenValid() && (<button  className={styles.topBtn} onClick={goToPage}>Log in with Spotify</button>)}
      <h1>
        Ja<span className={styles['highlight']}>mmm</span>ing
      </h1>
      {!isAccessTokenValid() && (
  <div className={styles.fakeDiv} style={{ width: "177px" }}></div>
)}
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
