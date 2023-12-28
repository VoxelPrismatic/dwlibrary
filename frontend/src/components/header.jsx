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
              Welcome to The Sweet Baby Gang
            </Typography>
          </Grid>
          <Grid item>
            <ExpandMoreIcon style={{ color: "black" }} />
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails style={{ justifyContent: "center" }}>
        <Typography>
          The #1 rule of the Sweet Baby Gang is to not talk about the Sweet Baby
          Gang. I believe this website breaks that rule. Matt Walsh has many
          titles just to name a few, he is the best selling children's LGBTQ
          author, Transphobe of the year, philanthropist and a Virginian at
          heart. Most Importantly Matt Walsh is the Theorcratic Fascist Dictator
          of The Sweet Baby Gang. This Website currently tracks and has
          transcripts from every show as well as tracking the daily
          cancellations which debuted on episode 431. All of this is searchable,
          future additions to the site will track fan favorite topics such as
          books/documentaries Matt suggested we read/watch and of course a full
          blown alien section. Maybe I can start with a proper "about" page but
          until then for any corrections or future suggestions email:
          SBGHistorian@gmail.com
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default WebsiteHeadBanner;
