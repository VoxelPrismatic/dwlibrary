import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Typography, Box, Grid, Paper } from '@material-ui/core';
import Cancelled from "../media/cancelled.jpg";
import Sbglogo from "../media/sbgblackwhite.png";
import Johnny from "../media/johnny.jpg";
import Matt from "../media/homeimage.png";
import TranscriptIcon from "../media/transcripticon.png";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  heading: {
    marginBottom: theme.spacing(2),
  },
  box: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  image: {
    width: '40%',
    height: 'auto',
    marginBottom: theme.spacing(1),
  },
  topTypography: {
    textAlign: 'center',
    wordWrap: 'break-word',
  },
  fullWidthImage: {
    width: '100%', // Set the width to 100% to spread the image to the screen width
    height: 'auto',
    marginBottom: theme.spacing(1),
  },
  // Styles for mobile view
  [`@media (max-width: ${theme.breakpoints.values.sm}px)`]: {
    box: {
      width: '80%', // Reduce the width of the box for mobile view
    },
    image: {
      width: '60%', // Adjust the size of the image for mobile view
    },
  },
}));

const Home = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box textAlign="center" mb={4}>
        <img src={Matt} alt="Matt Walsh" className={classes.fullWidthImage} />
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <Paper elevation={3} className={classes.box} component={Link} to="/transcript">
            <img src={TranscriptIcon} alt="transcripts" className={classes.image} />
            <Typography variant="h6">Transcripts</Typography>
            <Typography variant="body2">
              Search through anything Matt Walsh has said on his daily show.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Paper elevation={3} className={classes.box} component={Link} to="/cancelled">
            <img src={Cancelled} alt="cancelled" className={classes.image} />
            <Typography variant="h6">Daily Cancellation</Typography>
            <Typography variant="body2">
              Discover all the poor souls that have been cancelled from society
            </Typography>
          </Paper>
        </Grid>

        {/*added spacing between grid items*/}
        <Grid item xs={12} style={{ marginBottom: '16px' }} />

        <Grid item xs={12} sm={6} md={6}>
          <Paper elevation={3} className={classes.box} component={Link} to="/about">
            <img src={Sbglogo} alt="Reason For Men To Cry" className={classes.image} />
            <Typography variant="h6">What is the Sweet Baby Gang?</Typography>
            <Typography variant="body2">
              Unfortunately this site would be canceled if I were to give that answer, but find out
              more about our humble theocratic fascist leader
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Paper elevation={3} className={classes.box}>
            <img src={Johnny} alt="Book Recommendations" className={classes.image} />
            <Typography variant="h6">Matt's Book Recommendations</Typography>
            <Typography variant="body2">
              This list comprises of anytime Matt has mentioned a good book that he has read
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
