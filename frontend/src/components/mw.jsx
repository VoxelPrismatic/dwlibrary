import React from "react";
import { Container, Typography, Paper } from "@mui/material";
import Cry from "./cry";
import WebsiteHeadBanner from "./old/header";
import BooksList from "./books";
import ShowCards from "./showcards";
import MKPot from "./MK/mkpotlist";

function mw() {
  return <div>{<Cry />}</div>;
}

export default mw;
