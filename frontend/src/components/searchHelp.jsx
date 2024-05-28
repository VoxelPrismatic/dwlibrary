import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const SearchTips = () => {
  return (
    <Accordion style={{ color: "black" }}>
      <AccordionSummary
        aria-controls="panel1a-content"
        id="panel1a-header"
        style={{ justifyContent: "center" }}
      >
        <Grid container alignItems="center" justifyContent="center">
          <Grid item>
            <Typography
              variant="h5"
              style={{ fontFamily: "Apple Color Emoji" }}
            >
              Search Help
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails style={{ justifyContent: "center" }}>
        <Typography>
          Searching can be done using exact phrase matching or individual words
          to break down searches.
          <br />
          <br />
          For Example if you wanted to search for "Pandas" you can search for
          another word by hitting search again such as "Death" and it will
          filter results containing both of those words to see if the hosts
          think Pandas should exist. Hit Clear search to clear all searches to
          start over.
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default SearchTips;
