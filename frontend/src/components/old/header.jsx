import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const WebsiteHeadBanner = () => {
  return (
    <Accordion style={{ backgroundColor: "#D3D3D3", color: "black" }}>
      <AccordionSummary
        aria-controls="panel1a-content"
        id="panel1a-header"
        style={{ justifyContent: "center" }}
      >
        <Grid container alignItems="center" justifyContent="center">
          <Grid item>
            <Typography
              variant="h4"
              style={{ fontFamily: "Apple Color Emoji" }}
            >
              Upcoming Changes to the site!
            </Typography>
          </Grid>
          <Grid item>
            <ExpandMoreIcon style={{ color: "black" }} />
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails style={{ justifyContent: "center" }}>
        <Typography>
          I don't own the domain thesweetbabygang.com anymore. All I will say is
          don't worry it's in good hands. I've always wanted this project to
          grow and expand into other hosts and that's my plan for the future of
          this site. I will have it split into separate sections and I still
          plan to have a full blown section dedicated to the SBG. The only
          natural and fastest growing cult at the Daily Wire. Stay Tuned
          everyone
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default WebsiteHeadBanner;
