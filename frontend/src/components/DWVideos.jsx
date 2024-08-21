import React from "react";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import OOC from "../media/outofcontext.jpg";
import DWSomeContextLogo from "../media/somecontext.jpg";

const LandingPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px",
        backgroundColor: "#f0f0f0",
        gap: "20px"
      }}
    >
      {/* Out of Context Section */}
      <Paper
        elevation={3}
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          textAlign: "center" // Center the image but not the text
        }}
      >
        <Link
          to="/outofcontext"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <img
            src={OOC}
            alt="Out of Context Logo"
            style={{ width: "300px", height: "auto", marginBottom: "20px" }}
          />
          <p style={{ textAlign: "left" }}>
            One of my favorite accounts on X is RealTruthCactus, previously
            known as DWOutofcontext_.
            <br />
            <br />
            I wanted to pay homage to her account and create a collection of out
            of context videos.
            <br />
            <br />
            Click here to view random videos out of context from your favorite
            Daily Wire Hosts.
          </p>
        </Link>
      </Paper>

      {/* Some Context Section */}
      <Paper
        elevation={3}
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          textAlign: "center" // Center the image but not the text
        }}
      >
        <Link
          to="/dwsomecontext"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <img
            src={DWSomeContextLogo}
            alt="Some Context Logo"
            style={{ width: "300px", height: "auto", marginBottom: "20px" }}
          />
          <p style={{ textAlign: "left" }}>
            Click here to view all the available videos sorted by{" "}
            <strong>Host</strong> with very little context.
            <br />
            <br />
            If you haven't noticed by now, I like to centralize all of my
            favorite Daily Wire content, and out of context videos are no
            exception.
          </p>
        </Link>
      </Paper>
    </div>
  );
};

export default LandingPage;
