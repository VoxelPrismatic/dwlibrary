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
              Disclaimer Below
            </Typography>
          </Grid>
          <Grid item>
            <ExpandMoreIcon style={{ color: "black" }} />
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails style={{ justifyContent: "center" }}>
        <Typography>
          My name is SBGHistorian on X and this started out as a pet project
          documenting all of Matt's transcripts and cancellations having a
          centralized repository for mega fans of the SBG to search anything he
          has ever said. Please note that all these transcripts are auto
          generated so there will be typos.
          <br />
          This site is not affiliated or owned by the Daily Wire, all resources
          on this site are non-member block transcripts. Any information that
          was pulled was used public platforms where the shows are availble for
          free with Ads.
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default WebsiteHeadBanner;
