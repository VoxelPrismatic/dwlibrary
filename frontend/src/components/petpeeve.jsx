import React from "react";
import { List, ListItem, ListItemText, Typography, Box } from "@mui/material";
import Dailywire from "../media/socials/dw.png";
import X from "../media/socials/x.png";
import Facebook from "../media/socials/facebook.png";
import Instagram from "../media/socials/instagram.png";
import Youtube from "../media/socials/youtube.png";
import Rumble from "../media/socials/rumble.png";

const Petpeeve = () => {
  const listItemStyle = {
    display: "flex",
    alignItems: "center",
    padding: "8px" // Add padding to the list items
  };

  const imageStyle = {
    marginRight: "8px" // Add margin to the right of the images
  };

  return (
    <Box>
      <List>
        <Typography variant="h5" gutterBottom>
          Follow Matt Walsh
        </Typography>
        <ListItem
          component="a"
          href="https://www.dailywire.com/show/the-matt-walsh-show"
          target="_blank"
          rel="noopener noreferrer"
          style={listItemStyle}
        >
          <img
            src={Dailywire}
            alt="Dailywire+"
            width="24"
            height="24"
            style={imageStyle}
          />
          <ListItemText primary="Dailywire+" />
        </ListItem>
        <ListItem
          component="a"
          href="https://twitter.com/MattWalshBlog"
          target="_blank"
          rel="noopener noreferrer"
          style={listItemStyle}
        >
          <img src={X} alt="X" width="24" height="24" style={imageStyle} />
          <ListItemText primary="X" />
        </ListItem>
        <ListItem
          component="a"
          href="https://www.facebook.com/MattWalshBlog"
          target="_blank"
          rel="noopener noreferrer"
          style={listItemStyle}
        >
          <img
            src={Facebook}
            alt="Facebook"
            width="24"
            height="24"
            style={imageStyle}
          />
          <ListItemText primary="Facebook" />
        </ListItem>
        <ListItem
          component="a"
          href="https://www.instagram.com/mattwalshblog/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
          style={listItemStyle}
        >
          <img
            src={Instagram}
            alt="Instagram"
            width="24"
            height="24"
            style={imageStyle}
          />
          <ListItemText primary="Instagram" />
        </ListItem>
        <ListItem
          component="a"
          href="https://www.youtube.com/@MattWalsh"
          target="_blank"
          rel="noopener noreferrer"
          style={listItemStyle}
        >
          <img
            src={Youtube}
            alt="Youtube"
            width="24"
            height="24"
            style={imageStyle}
          />
          <ListItemText primary="Youtube" />
        </ListItem>
        <ListItem
          component="a"
          href="https://rumble.com/c/MattWalsh"
          target="_blank"
          rel="noopener noreferrer"
          style={listItemStyle}
        >
          <img
            src={Rumble}
            alt="Rumble"
            width="24"
            height="24"
            style={imageStyle}
          />
          <ListItemText primary="Rumble" />
        </ListItem>
        <ListItem
          component="a"
          href="https://twitter.com/SBGHistorian"
          target="_blank"
          rel="noopener noreferrer"
          style={listItemStyle}
        >
          <img src={X} alt="X" width="24" height="24" style={imageStyle} />
          <ListItemText primary="Follow SBGHistorian for Updates" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Petpeeve;
