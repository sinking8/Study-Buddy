import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import axios from "axios"; // Import axios
import './song.scss';

const Song = () => {
  const [musicList, setMusicList] = useState([]);
  const [index, setIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [pause, setPause] = useState(false);

  const playerRef = useRef(null);
  const timelineRef = useRef(null);
  const playheadRef = useRef(null);
  const hoverPlayheadRef = useRef(null);

  useEffect(() => {
    // Fetch music data from API
    const fetchMusic = async () => {
      try {
        let session_id = localStorage.getItem("session_id");
        const response = await axios.get('YOUR_API_ENDPOINT',); // Replace with your API endpoint
        setMusicList(response.data); // Assuming the response data is an array of music objects
      } catch (error) {
        console.error("Error fetching music data", error);
      }
    };

    fetchMusic();
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    if(player!=null){
    player.addEventListener("timeupdate", timeUpdate, false);
    player.addEventListener("ended", nextSong, false);
    timelineRef.current.addEventListener("click", changeCurrentTime, false);
    timelineRef.current.addEventListener("mousemove", hoverTimeLine, false);
    timelineRef.current.addEventListener("mouseout", resetTimeLine, false);
    }

    return () => {
      player.removeEventListener("timeupdate", timeUpdate);
      player.removeEventListener("ended", nextSong);
      timelineRef.current.removeEventListener("click", changeCurrentTime);
      timelineRef.current.removeEventListener("mousemove", hoverTimeLine);
      timelineRef.current.removeEventListener("mouseout", resetTimeLine);
    };
  }, [index]);

  const changeCurrentTime = (e) => {
    const duration = playerRef.current.duration;
    const playheadWidth = timelineRef.current.offsetWidth;
    const offsetWidth = timelineRef.current.offsetLeft;
    const userClickWidth = e.clientX - offsetWidth;

    const userClickWidthInPercent = (userClickWidth * 100) / playheadWidth;
    playheadRef.current.style.width = userClickWidthInPercent + "%";
    playerRef.current.currentTime = (duration * userClickWidthInPercent) / 100;
  };

  const hoverTimeLine = (e) => {
    const duration = playerRef.current.duration;
    const playheadWidth = timelineRef.current.offsetWidth;
    const offsetWidth = timelineRef.current.offsetLeft;
    const userClickWidth = e.clientX - offsetWidth;
    const userClickWidthInPercent = (userClickWidth * 100) / playheadWidth;

    if (userClickWidthInPercent <= 100) {
      hoverPlayheadRef.current.style.width = userClickWidthInPercent + "%";
    }

    const time = (duration * userClickWidthInPercent) / 100;
    if (time >= 0 && time <= duration) {
      hoverPlayheadRef.current.dataset.content = formatTime(time);
    }
  };

  const resetTimeLine = () => {
    hoverPlayheadRef.current.style.width = 0;
  };

  const timeUpdate = () => {
    const duration = playerRef.current.duration;
    const timelineWidth =
      timelineRef.current.offsetWidth - playheadRef.current.offsetWidth;
    const playPercent = 100 * (playerRef.current.currentTime / duration);
    playheadRef.current.style.width = playPercent + "%";
    const currentTime = formatTime(parseInt(playerRef.current.currentTime));
    setCurrentTime(currentTime);
  };

  const formatTime = (currentTime) => {
    const minutes = Math.floor(currentTime / 60);
    let seconds = Math.floor(currentTime % 60);
    seconds = seconds >= 10 ? seconds : "0" + (seconds % 60);
    return minutes + ":" + seconds;
  };

  const updatePlayer = () => {
    const currentSong = musicList[index];
    playerRef.current.load();
  };

  const nextSong = () => {
    setIndex((prevIndex) => (prevIndex + 1) % musicList.length);
    updatePlayer();
    if (pause) {
      playerRef.current.play();
    }
  };

  const prevSong = () => {
    setIndex((prevIndex) => (prevIndex + musicList.length - 1) % musicList.length);
    updatePlayer();
    if (pause) {
      playerRef.current.play();
    }
  };

  const playOrPause = () => {
    if (!pause) {
      playerRef.current.play();
    } else {
      playerRef.current.pause();
    }
    setPause(!pause);
  };

  const clickAudio = (key) => {
    setIndex(key);
    updatePlayer();
    if (pause) {
      playerRef.current.play();
    }
  };

  const currentSong = musicList[index];

  return (
    <div className="card">
      {(musicList.length == 0)?(<h2>No Records</h2>):
      (<div className="current-song">
        <audio ref={playerRef!=null?"":playerRef}>
          <source src={currentSong.audio} type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>
        <div className="img-wrap">
          <img src={currentSong.img} alt={currentSong.name} />
        </div>
        <span className="song-name">{currentSong.name}</span>
        <span className="song-author">{currentSong.author}</span>

        <div className="time">
          <div className="current-time">{currentTime}</div>
          <div className="end-time">{currentSong.duration}</div>
        </div>

        <div ref={timelineRef} id="timeline">
          <div ref={playheadRef} id="playhead"></div>
          <div
            ref={hoverPlayheadRef}
            className="hover-playhead"
            data-content="0:00"
          ></div>
        </div>

        <div className="controls">
          <button onClick={prevSong} className="prev prev-next current-btn">
            <i className="fas fa-backward"></i>
          </button>

          <button onClick={playOrPause} className="play current-btn">
            {!pause ? (
              <i className="fas fa-play"></i>
            ) : (
              <i className="fas fa-pause"></i>
            )}
          </button>
          <button onClick={nextSong} className="next prev-next current-btn">
            <i className="fas fa-forward"></i>
          </button>
        </div>
      </div>)
      }


      {/* Check if the music list is empty */}
      {musicList.length === 0 ? (
        <></>
      ) : (
        <div className="play-list">
          {musicList.map((music, key) => (
            <div
              key={key}
              onClick={() => clickAudio(key)}
              className={
                "track " +
                (index === key && !pause ? "current-audio" : "") +
                (index === key && pause ? "play-now" : "")
              }
            >
              <img className="track-img" src={music.img} alt={music.name} />
              <div className="track-discr">
                <span className="track-name">{music.name}</span>
                <span className="track-author">{music.author}</span>
              </div>
              <span className="track-duration">
                {index === key ? currentTime : music.duration}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Song;
