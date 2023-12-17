import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import Petpeeve from './petpeeve';
import Matt from '../media/homeimage.png';
import Matt1 from '../media/homeimage1.png';
import Cry from './cry';
import Dailywire from '../media/socials/dw.png';
import { Link } from 'react-router-dom';
import Cancelled from "../media/cancelled.jpg";
import Sbglogo from "../media/sbgblackwhite.png";
import Johnny from "../media/johnny.jpg";
import TranscriptIcon from "../media/transcripticon.png";
import WebsiteHeadBanner from './header'



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: 'grey',
  

     listItem: {
    marginBottom: theme.spacing(2), // Adjust the margin-bottom as needed
  },
  },
  paper:{
    marginTop: theme.spacing(2),
    height: '100%',
    background: '#D3D3D3'
  },
  fullWidthImage: {
    width: '100%',
    height: '100%',
    
  },
  image: {
    width: '100px', // Adjust the size as needed
    height: 'auto', // Adjust the size as needed
    marginBottom: theme.spacing(1),
    marginRight: '10px',
  },
  [`@media (max-width: ${theme.breakpoints.values.sm}px)`]: {
    box: {
      width: '100%',
      flexDirection: 'column',
    },
  },
}));

const Home = () => {
  const classes = useStyles();

  return (
    
    <Grid container spacing={2} justify="center" alignItems="center">
     
     {/* WebsiteHeadBanner component */}
     <Grid item xs={12}>
        <WebsiteHeadBanner />
      </Grid>

      {/* socials box */}
      <Grid item xs={12} sm={6} md={4} lg={3}>
      <Paper className={classes.paper} style={{ height: '100%' }}>
          <Petpeeve />
        </Paper>
      </Grid>


       {/* big image */}
       <Grid item xs={12} md={8} lg={6}>
        <Paper className={classes.paper} >
        <img src={Matt} alt="Matt Walsh" className={classes.fullWidthImage} />
        </Paper>
      </Grid>

      {/* links*/}
      <Grid item xs={12} sm={6} md={4} lg={3}>
      <Paper className={classes.paper} style={{ height: '100%' }}>
          <List>
            {/* List Item 1 */}
            <ListItem component={Link} to="/transcript" button className={classes.listItem}>
              <ListItemIcon>
                <img src={TranscriptIcon} alt="Link 1" className={classes.image} />
              </ListItemIcon>
              <ListItemText primary="Transcripts for the show will be updated weekly." />
            </ListItem>
            {/* List Item 2 */}
            <ListItem component={Link} to="/cancelled" button className={classes.listItem}>
              <ListItemIcon>
                <img src={Cancelled} alt="Link 2" className={classes.image} />
              </ListItemIcon>
              <ListItemText primary="Click here to discover everyone that's been cancelled by our humble Theorcratic Fascist Dictator" />
            </ListItem>
            <ListItem component="a" href="https://store.dailywire.com/collections/matt-walsh" target="_blank" rel='noopener noreferrer'button className={classes.listItem}>
              <ListItemIcon>
                <img src={Dailywire} alt="Link 2" className={classes.image} />
              </ListItemIcon>
              <ListItemText primary="Join the Sweet Baby Gang Today. Shop all Matt Walsh content on Dailywire+ It is a rule that you must seek Matt's promo codes if any" />
            </ListItem>
            {/* List Item 3 */}
          </List>
        </Paper>
      </Grid>
        

       
      


      {/* <Grid item xs={12} md={8} lg={6}>
        
          <Cry />
        
      </Grid> */}

       

      

      
      
    </Grid>
    
  );
};

export default Home;
