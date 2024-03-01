import React from "react";
import { Container, Typography, Paper } from "@mui/material";
import Cry from "./cry";
import WebsiteHeadBanner from "./header";
import BooksList from "./books";
import ShowCards from "./showcards";
import SCB from "../media/scb.png";

function KnowlesTranscript() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <img
        src={SCB}
        alt="SCB Image"
        style={{ margin: "auto" }}
        width={"100%"}
      />
    </div>
  );
}

export default KnowlesTranscript;
