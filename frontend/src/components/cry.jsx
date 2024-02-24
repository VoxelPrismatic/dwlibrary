import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Paper
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import CryingBanner from "../media/cryinglist.png";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%"
  },
  title: {
    width: "100%",
    maxWidth: "800px",
    border: "0",
    borderBottom: "4px solid #cb767d",
    marginBottom: "10px",
    paddingTop: "15px"
  },
  contentWrapper: {
    display: "flex",
    alignItems: "flex-start",
    backgroundColor: "#999797"
  },
  paper: {
    padding: "20px",
    elevation: 10,
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#999797"
  },
  accordion: {
    width: "100%",
    marginBottom: "10px"
  },
  accordionSummary: {
    color: "#cb767d",
    backgroundColor: "#fff"
  },
  accordionDetails: {
    backgroundColor: "#f2f2f2",
    padding: "10px"
  }
}));

export default function MenCryingList() {
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      <div className={classes.contentWrapper}>
        <Paper className={classes.paper}>
          <Accordion
            expanded={expanded === `panel0`}
            onChange={handleChange(`panel0`)}
            className={classes.accordion}
          >
            <AccordionSummary
              className={classes.accordionSummary}
              aria-controls={`panel0d-content`}
              id={`panel0d-header`}
            >
              <Typography>8 Reasons Men Are Allowed To Cry</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetails}>
              <Typography variant="body1">
                <b>
                  {" "}
                  See episodes 763, 764, 769, 781 for references on the official
                  list/rule book for reasons men are allowed to cry. <br />{" "}
                  <br />
                  On Episode 763 Matt Walsh cancelled democrat politicians
                  specifially men for crying. Below is a quote from Matt's show
                  on episode 764.{" "}
                </b>{" "}
                <br />
                <br /> My position on the subject of men crying as i mentioned
                yesterday i tweeted that men should not cry in public because
                it's dishonorable and unmanly though i allow for certain
                exceptions which i have outlined in further detail in the past
                um perhaps i should publish an official list you know with an
                index and a glossary and a bibliography and everything so that
                any man if he's considering crying can quickly consult the rule
                book and find out if he's if his upcoming sobbing fit meets the
                requirements you know is this going to be sanctioned crying or
                not but that's a project for another day
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === `panel1`}
            onChange={handleChange(`panel1`)}
            className={classes.accordion}
          >
            <AccordionSummary
              className={classes.accordionSummary}
              aria-controls={`panel1d-content`}
              id={`panel1d-header`}
            >
              <Typography>Reason #1: Loved one dies</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetails}>
              <Typography variant="body1">
                <b>
                  {" "}
                  The first 5 list items came from episode 763 while cancelling
                  crying politicians. A true epidemic in our country{" "}
                </b>{" "}
                <br />
                <br /> I said men should not cry in public it is unmanly and
                dishonorable rare exceptions can be made to this rule but we
                make far too many exceptions and the exceptions are pretty
                obvious a loved one dies
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === `panel2`}
            onChange={handleChange(`panel2`)}
            className={classes.accordion}
          >
            <AccordionSummary
              className={classes.accordionSummary}
              aria-controls={`panel2d-content`}
              id={`panel2d-header`}
            >
              <Typography>Reason #2: Child born</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetails}>
              <Typography variant="body1">
                <b>
                  {" "}
                  A dignified tear or two may be acceptable but please don't
                  turn the faucet on okay there's no reason to go overboard
                  don't try to prove a point{" "}
                </b>{" "}
                <br />
                <br /> The exceptions are pretty obvious a loved one dies your
                child is born.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === `panel3`}
            onChange={handleChange(`panel3`)}
            className={classes.accordion}
          >
            <AccordionSummary
              className={classes.accordionSummary}
              aria-controls={`panel3d-content`}
              id={`panel3d-header`}
            >
              <Typography>Reason # 3: Bride is walking down aisle</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetails}>
              <Typography variant="body1">
                <b>
                  A dignified tear or two may be acceptable but please don't
                  turn the faucet on okay there's no reason to go overboard
                  don't try to prove a point
                </b>{" "}
                <br />
                <br /> The exceptions are pretty obvious a loved one dies your
                child is born your bride is walking down the aisle at your
                wedding
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === `panel3`}
            onChange={handleChange(`panel3`)}
            className={classes.accordion}
          >
            <AccordionSummary
              className={classes.accordionSummary}
              aria-controls={`panel3d-content`}
              id={`panel3d-header`}
            >
              <Typography>
                Reason # 4: Saying goodbye to a family member before a 3 year
                voyage to Mars
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetails}>
              <Typography variant="body1">
                <b>
                  A dignified tear or two may be acceptable but please don't
                  turn the faucet on okay there's no reason to go overboard
                  don't try to prove a point
                </b>{" "}
                <br />
                <br /> The exceptions are pretty obvious a loved one dies your
                child is born your bride is walking down the aisle at your
                wedding
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === `panel3`}
            onChange={handleChange(`panel3`)}
            className={classes.accordion}
          >
            <AccordionSummary
              className={classes.accordionSummary}
              aria-controls={`panel3d-content`}
              id={`panel3d-header`}
            >
              <Typography>
                Reason # 5: Watching the end of the movie Rudy
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetails}>
              <Typography variant="body1">
                <b>
                  A dignified tear or two may be acceptable but please don't
                  turn the faucet on okay there's no reason to go overboard
                  don't try to prove a point
                </b>{" "}
                <br />
                <br /> The exceptions are pretty obvious a loved one dies your
                child is born your bride is walking down the aisle at your
                wedding
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === `panel3`}
            onChange={handleChange(`panel3`)}
            className={classes.accordion}
          >
            <AccordionSummary
              className={classes.accordionSummary}
              aria-controls={`panel3d-content`}
              id={`panel3d-header`}
            >
              <Typography>
                Reason # 6: Moved to tears of joy and inspiration by anything
                Matt says
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetails}>
              <Typography variant="body1">
                <b>
                  A dignified tear or two may be acceptable but please don't
                  turn the faucet on okay there's no reason to go overboard
                  don't try to prove a point
                </b>{" "}
                <br />
                <br /> The exceptions are pretty obvious a loved one dies your
                child is born your bride is walking down the aisle at your
                wedding
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === `panel3`}
            onChange={handleChange(`panel3`)}
            className={classes.accordion}
          >
            <AccordionSummary
              className={classes.accordionSummary}
              aria-controls={`panel3d-content`}
              id={`panel3d-header`}
            >
              <Typography>Reason # 7: True Patriotism</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetails}>
              <Typography variant="body1">
                <b>
                  A dignified tear or two may be acceptable but please don't
                  turn the faucet on okay there's no reason to go overboard
                  don't try to prove a point
                </b>{" "}
                <br />
                <br /> The exceptions are pretty obvious a loved one dies your
                child is born your bride is walking down the aisle at your
                wedding
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === `panel3`}
            onChange={handleChange(`panel3`)}
            className={classes.accordion}
          >
            <AccordionSummary
              className={classes.accordionSummary}
              aria-controls={`panel3d-content`}
              id={`panel3d-header`}
            >
              <Typography>
                Reason # 8: Child comes home healthy after NICU
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetails}>
              <Typography variant="body1">
                <b>
                  A dignified tear or two may be acceptable but please don't
                  turn the faucet on okay there's no reason to go overboard
                  don't try to prove a point
                </b>{" "}
                <br />
                <br /> The exceptions are pretty obvious a loved one dies your
                child is born your bride is walking down the aisle at your
                wedding
              </Typography>
            </AccordionDetails>
          </Accordion>
          {/* Repeat the above Accordion components for the remaining reasons */}
        </Paper>
      </div>
    </div>
  );
}
