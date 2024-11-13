import React, { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ReactPlayer from "react-player";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import Divider from "@mui/material/Divider"; // Import Divider component
import Xlogo from "../media/xlogo.png"; // Import X logo
import DWSomeContextLogo from "../media/somecontext.jpg"; // Import the second logo

const DWSomeContext = () => {
  const [videos, setVideos] = useState([]);
  const [openHost, setOpenHost] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `https://the-sweet-baby-gang-backend-git-main-tyler-sowers-projects.vercel.app/api/videos?timestamp=${new Date().getTime()}`
        );
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  const handleHostClick = (host) => {
    setOpenHost(openHost === host ? null : host);
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const groupedVideos = videos.reduce((acc, video) => {
    if (!acc[video.host]) {
      acc[video.host] = [];
    }
    acc[video.host].push(video);
    return acc;
  }, {});

  // Get the hosts and sort them alphabetically
  const sortedHosts = Object.keys(groupedVideos).sort();

  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f0f0" }}>
      {selectedVideo && (
        <Paper
          elevation={3}
          style={{
            maxWidth: "800px",
            margin: "0 auto 20px auto",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#ffffff",
            textAlign: "center"
          }}
        >
          <ReactPlayer
            url={selectedVideo.url}
            controls
            playing={true} // Enable autoplay
            playsinline // Prevent fullscreen on mobile
            config={{
              file: {
                attributes: {
                  playsInline: true // Prevents fullscreen on mobile
                }
              }
            }}
            width="100%"
            height="auto"
          />
          <div style={{ textAlign: "left", marginTop: "20px" }}>
            <p
              style={{
                margin: "0 0 10px 0",
                fontSize: "16px",
                display: "flex",
                alignItems: "center"
              }}
            >
              <DescriptionIcon style={{ marginRight: "5px" }} />{" "}
              <span style={{ color: "#000" }}>{selectedVideo.description}</span>
            </p>
            <p
              style={{
                margin: "0 0 10px 0",
                fontSize: "16px",
                display: "flex",
                alignItems: "center"
              }}
            >
              <PersonIcon style={{ marginRight: "5px" }} />

              <span style={{ color: "#000" }}>{selectedVideo.host}</span>
            </p>
            {selectedVideo.xusername && selectedVideo.xlink && (
              <p
                style={{
                  margin: "0",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <img
                  src={Xlogo}
                  alt="X logo"
                  style={{ width: "20px", marginRight: "5px" }}
                />{" "}
                <a
                  href={selectedVideo.xlink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#4684e8", textDecoration: "none" }}
                >
                  {selectedVideo.xusername}
                </a>
              </p>
            )}
          </div>
          <div style={{ marginBottom: "20px" }}>
            <img
              src={DWSomeContextLogo}
              alt="Out of Context Logo"
              style={{ maxWidth: "200px", height: "auto" }}
            />
          </div>
        </Paper>
      )}

      <Paper
        elevation={3}
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#ffffff"
        }}
      >
        <List component="nav" aria-labelledby="nested-list-subheader">
          {sortedHosts.map((host) => (
            <div key={host}>
              <ListItem
                button
                onClick={() => handleHostClick(host)}
                style={{
                  backgroundColor: "#f0f0f0", // Set the background color of the host item
                  fontWeight: "bold" // Make the host text bold
                }}
              >
                <ListItemText
                  primary={host}
                  primaryTypographyProps={{ style: { fontWeight: "bold" } }} // Ensure the text is bold
                />
                {openHost === host ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openHost === host} timeout="auto" unmountOnExit>
                <List
                  component="div"
                  disablePadding
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr auto 1fr", // Adjust grid for 3 items per row with dividers
                    gap: "10px",
                    alignItems: "center",
                    backgroundColor: "#d3d3d3" // Set a darker grey background for the expanded list
                  }}
                >
                  {groupedVideos[host].map((video, index) => (
                    <React.Fragment key={video._id}>
                      <ListItem
                        button
                        onClick={() => handleVideoClick(video)}
                        style={{
                          marginBottom: "5px",
                          padding: "10px", // Add padding inside the item
                          borderRadius: "4px" // Optional: round the corners
                        }}
                      >
                        <ListItemText primary={video.description} />
                      </ListItem>
                      {/* Insert a divider only if this isn't the last item in a row */}
                      {index % 3 !== 2 &&
                        index < groupedVideos[host].length - 1 && (
                          <Divider
                            orientation="vertical"
                            flexItem
                            style={{
                              height: "100%",
                              backgroundColor: "#000",
                              width: "1px"
                            }} // Adjust the thickness here
                          />
                        )}
                    </React.Fragment>
                  ))}
                </List>
              </Collapse>
            </div>
          ))}
        </List>
      </Paper>
    </div>
  );
};

export default DWSomeContext;
