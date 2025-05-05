import React from "react";
import styles from './Track.module.css';
function Track(props) {
  function renderAction() {
    if (props.isRemoval) {
      return <button className={styles['Track-action']} onClick={passTrack} >+</button>
    } else {
      return <button className={styles['Track-action']} onClick={passTrackToRemove} >-</button>
    }
  }
  function passTrack() {
    props.onAdd(props.track)
  };
  function passTrackToRemove(){
    props.onRemove(props.track)
  };
  const imageUrl = props.track.image || "https://via.placeholder.com/64";
  return (
    <div className={styles["Track"]}>
      <img src={imageUrl} className={styles.imageee}></img>
      <div className={styles["Track-information"]}>
        {/* <h3><!-- track name will go here --></h3> */}
        <h3>{props.track.name}</h3>
        {/* <p><!-- track artist will go here--> | <!-- track album will go here --></p> */}
        <p>{props.track.artist} / {props.track.album}</p>
        <p>{props.track.preview}</p>
      </div>
      {/* <button class="Track-action"><!-- + or - will go here --></button> */}
      {renderAction()}
    </div>
  );
}

export default Track;