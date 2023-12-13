import React, { useState } from 'react';
import { Tabs, Tab, Paper, Typography } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import CryingBanner from "../media/cryinglist.png";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Align content to the left
    width: '100%', 
    
    
  },
  title: {
    width: '100%',
    maxWidth: '800px',
    border: '0', /* Remove any existing borders */
    borderBottom: '4px solid #cb767d',
    marginBottom: '10px',
    paddingTop: '15px',

    // backgroundColor: '#999797',
  },
  contentWrapper: {
    display: 'flex', // Make the content wrapper a flex container
    alignItems: 'flex-start', // Align content to the left
    backgroundColor: '#999797',
    //paddingLeft: '10px',
    //paddingRight: '25px',
    //paddingTop: '10px',
    
  },
  paper: {
    padding: '20px', // Add padding to create space between the content and the paper
    elevation: 10, // Set the elevation (drop shadow) level
    width: '100%', // Set the width to expand to the parent container
    boxSizing: 'border-box', // Include padding and border in width
    backgroundColor: '#999797',

  },
  tabs: {
    border: '1px solid #000',
    //backgroundColor: '#999797',
  },
  tab: {
    border: '1px solid #000',
    color: '#cb767d',
    maxWidth: '100px',
    width: 'auto',
    maxHeight: '150px',
    height: 'auto',
    fontWeight: 'bold',
    
    
    
  },
  tabContent: {
    width: 'auto',
    maxWidth: '400px',
    backgroundColor: '#999797',
    maxHeight: '475px', // Set the maximum height
    height: 'auto',
    overflowY: 'auto',
    
  },
  tabContentHeader: {
    marginBottom: '16px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    
  },
}));

function TabPanel(props) {
  const { children, value, index, classes } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} className={classes.tabContent}>
      {value === index && (
        <div>
          <Typography variant="h4" className={classes.tabContentHeader}>Context</Typography>
          {children}
        </div>
      )}
    </div>
  );
}

export default function MenCryingList() {
  const [value, setValue] = useState(0);
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <img src={CryingBanner} alt="banner for crying list" className={classes.title}/>
      <div className={classes.contentWrapper}>
        <Paper className={classes.paper}>
          <Tabs value={value} onChange={handleChange} orientation="vertical" centered>
            <Tab label={<span style={{ color: 'black', fontWeight: 'bold', fontFamily: 'Times New Roman', fontSize:'20px' }}>What is this?</span>} className={classes.tab} />
            <Tab label="Reason # 1: Loved one dies" className={classes.tab} />
            <Tab label="Reason # 2: Child born" className={classes.tab} />
            <Tab label="Reason # 3: Bride is walking down aisle" className={classes.tab} />
            <Tab label="Reason # 4: Saying goodbye to a family member before a 3 year voyage to Mars" className={classes.tab} />
            <Tab label="Reason # 5: Watching the end of the movie Rudy" className={classes.tab} />
            <Tab label="Reason # 6: Moved to tears of joy and inspiration by anything Matt says" className={classes.tab} />
            <Tab label="Reason # 7: True Patriotism" className={classes.tab} />
            <Tab label="Reason # 8: Child comes home healthy after NICU" className={classes.tab} />
          </Tabs>
        </Paper>
        <div className={classes.tabContent}>
        <TabPanel value={value} index={0} classes={classes}>
            <Typography variant="body1">
            <b> See episodes 763, 764, 769, 781 for references on the official list/rule book for reasons men are allowed to cry. <br/> <br/>On Episode 763 Matt Walsh cancelled democrat politicians specifially men for crying. Below is a quote from Matt's show on episode 764. </b> <br/><br/> My position on the subject of men crying as i mentioned yesterday i tweeted that men should not cry in public because it's dishonorable and unmanly though i allow for certain exceptions which i have outlined in further detail in the past um perhaps i should publish an official list you know with an index and a glossary and a bibliography and everything so that any man if he's considering crying can quickly consult the rule book and find out if he's if his upcoming sobbing fit meets the requirements you know is this going to be sanctioned crying or not but that's a project for another day
            </Typography>
          </TabPanel>
          <TabPanel value={value} index={1} classes={classes}>
            <Typography variant="body1">
            <b>  The first 5 list items came from episode 763 while cancelling crying politicians. A true epidemic in our country  </b> <br/><br/> I said men should not cry in public it is unmanly and dishonorable rare exceptions can be made to this rule but we make far too many exceptions and the exceptions are pretty obvious a loved one dies
            </Typography>
          </TabPanel>
          <TabPanel value={value} index={2} classes={classes}>
            <Typography variant="body1">
            <b> A dignified tear or two may be acceptable but please don't turn the faucet on okay there's no reason to go overboard don't try to prove a point </b> <br/><br/> The exceptions are pretty obvious a loved one dies your child is born.
            </Typography>
          </TabPanel>
          <TabPanel value={value} index={3} classes={classes}>
            <Typography variant="body1">
            <b>A dignified tear or two may be acceptable but please don't turn the faucet on okay there's no reason to go overboard don't try to prove a point</b> <br/><br/> The exceptions are pretty obvious a loved one dies your child is born your bride is walking down the aisle at your wedding 
            </Typography>
          </TabPanel>
          <TabPanel value={value} index={4} classes={classes}>
            <Typography variant="body1">
            <b> The first 5 list items came from episode 763 while cancelling crying politicians. A true epidemic in our country <br/> </b><br/>Other exceptions can be imagined we've talked about some of them before perhaps for example you're saying goodbye to your family before embarking on a three-year voyage to mars
            </Typography>
          </TabPanel>
          <TabPanel value={value} index={5} classes={classes}>
            <Typography variant="body1">
            <b> The first 5 list items came from episode 763 while cancelling crying politicians. A true epidemic in our country </b> <br/><br/> Other exceptions can be imagined we've talked about some of them before perhaps for example you're saying goodbye to your family before embarking on a three-year voyage to mars maybe you're watching the end of the movie rudy
            </Typography>
          </TabPanel>
          <TabPanel value={value} index={6} classes={classes}>
            <Typography variant="body1">
            <b> During the comments section </b> <br/><br/> Joshua says matt's comments on what it means to truly be a man were so beautiful that it made me cry well there you go there is another exception that certainly i think we can all agree is an exception uh if you were moved to town and i will say this in fact it's important to say this right now if you're a man listening to this show um and you're moved to tears of of of joy and inspiration by anything that i say that is perfectly okay i know that my words are that powerful and i would never judge you for it you absolute pansy
            </Typography>
          </TabPanel>
          <TabPanel value={value} index={7} classes={classes}>
            <Typography variant="body1">
            <b> During the comments section. This was in reference to Tamyra Mensah-Stock and her display of Patriotism while winning the gold medal at the Tokyo Olympics on August 3, 2021 </b> <br/><br/> Cool Papa J Magic says i know i'm not supposed to cry as a man but i teared up just a little bit to see that woman so happy to represent our beautiful country and i will allow that that i will allow will previously i said i think there are six reasons acceptable reasons for a man to cry i'll add number seven i'll give you that you're welcome
            </Typography>
          </TabPanel>
          <TabPanel value={value} index={8} classes={classes}>
            <Typography variant="body1">
            <b> During the comments section </b> <br/><br/> Graham says matt i agree with you about men crying but i have one acceptable addition to the list after an 18-day stay in nicu in which he almost passed we brought my now healthy son home to god be the glory well graham that certainly would be an exception for crying and uh congratulations to to you and to your son and to your family
            </Typography>
          </TabPanel>
        </div>
      </div>
    </div>
  );
}
