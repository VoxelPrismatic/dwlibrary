import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import MKShow from "../media/mkshowcard.png";
import MWShow from "../media/mwshowcard.png";

const useStyles = makeStyles({
  root: {
    display: "flex",
    overflow: "hidden",
    width: "100%", // Adjust this value as needed
    justifyContent: "center",
    flexWrap: "wrap"
  },
  imageCard: {
    width: "40%", // Adjust this value as needed
    margin: "20px",
    "@media (max-width: 600px)": {
      width: "100%"
    }
  },
  cardMedia: {
    height: "auto", // Adjust this value as needed for desktop view
    "@media (max-width: 600px)": {
      height: "auto" // Set height to auto for mobile view
    }
  },
  buttonGroup: {
    marginTop: "20px"
  }
});

const ImageCard = ({ imageUrl, title, description, links }) => {
  const classes = useStyles();

  return (
    <Card className={classes.imageCard}>
      <CardActionArea>
        <CardMedia
          className={classes.cardMedia} // Apply the class for card media
          component="img"
          alt={title}
          image={imageUrl}
          title={title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <div className={classes.buttonGroup}>
        <List component="nav" aria-label="secondary mailbox folders">
          {links.map((link, index) => (
            <ListItem key={index} button component={Link} to={link.url}>
              <ListItemText primary={link.text} />
            </ListItem>
          ))}
        </List>
      </div>
    </Card>
  );
};

const App = () => {
  const classes = useStyles();

  // Define array of links for each ImageCard
  const image1Links = [
    { text: "Transcripts for The Matt Walsh Show", url: "/transcript" },
    { text: "Daily Cancellations for The Matt Walsh Show", url: "/cancelled" },
    { text: "The Sweet Baby Library", url: "/library" }
  ];

  const image2Links = [
    {
      text: "Transcripts for The Michael Knowles Show Coming Soon!",
      url: "/knowles/transcript"
    }
  ];

  return (
    <div className={classes.root}>
      <ImageCard
        imageUrl={MWShow}
        title="The Matt Walsh Show"
        description="Transcripts and cancellations for the show will be updated weekly."
        links={image1Links}
      />
      <ImageCard
        imageUrl={MKShow}
        title="The Michael Knowles Show"
        description="Transcripts for the show will be updated weekly."
        links={image2Links}
      />
      {/* Add more ImageCard components as needed */}
    </div>
  );
};

export default App;
