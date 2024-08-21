import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import Paper from "@mui/material/Paper";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import OOC from "../media/outofcontext.jpg"; // Import the logo

const VideoPlayer = () => {
  const [video, setVideo] = useState(null);
  const [autoplay, setAutoplay] = useState(true); // State for autoplay

  const fetchVideo = async () => {
    try {
      const response = await axios.get(
        `https://the-sweet-baby-gang-backend-git-main-tyler-sowers-projects.vercel.app/api/videos?timestamp=${new Date().getTime()}`
      );
      const videos = response.data;

      // Pick a random video from the list
      const randomVideo = videos[Math.floor(Math.random() * videos.length)];
      setVideo(randomVideo);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, []);

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <Paper
      elevation={3}
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        textAlign: "center" // Center align content
      }}
    >
      {/* Video Player Section */}
      <div style={{ marginBottom: "20px" }}>
        <ReactPlayer
          url={video.url}
          controls
          playing={autoplay} // Enable autoplay
          playsinline // Prevent fullscreen on mobile
          config={{
            file: {
              attributes: {
                playsInline: true
              }
            }
          }}
          width="100%"
          height="auto"
          style={{ backgroundColor: "#000" }}
        />
      </div>

      {/* Information and Next Video Button Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "20px"
        }}
      >
        {/* Text Section (Some Context, Host, X Links) */}
        <div style={{ textAlign: "left" }}>
          {/* <p style={{ margin: "0 0 10px 0", fontSize: "16px" }}>
            <strong style={{ color: "#000000" }}>Some Context:</strong>{" "}
            <span style={{ color: "#000" }}>{video.description}</span>
          </p> */}
          <p style={{ margin: "0 0 10px 0", fontSize: "16px" }}>
            <strong style={{ color: "#000000" }}>Host:</strong>{" "}
            <span style={{ color: "#000" }}>{video.host}</span>
          </p>
          {/* {video.xusername && video.xlink && (
            <p style={{ margin: "0", fontSize: "16px" }}>
              <strong style={{ color: "#000000" }}>X:</strong>{" "}
              <a
                href={video.xlink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#4684e8", textDecoration: "none" }}
              >
                {video.xusername}
              </a>
            </p>
          )} */}
        </div>

        {/* Next Video Button */}
        <button
          onClick={fetchVideo}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#b3b7bd", // Pink color with 70% opacity
            color: "black",
            border: "none",
            borderRadius: "5px",
            marginLeft: "20px"
          }}
        >
          Next
        </button>
      </div>
      {/* Logo Section */}
      <div style={{ marginBottom: "20px" }}>
        <img
          src={OOC}
          alt="Out of Context Logo"
          style={{ maxWidth: "200px", height: "auto" }}
        />
      </div>
    </Paper>
  );
};

export default VideoPlayer;
