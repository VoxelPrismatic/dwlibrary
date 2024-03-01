import React from "react";
import { Container, Typography, Paper } from "@mui/material";
import Cry from "./cry";
import WebsiteHeadBanner from "./header";
import BooksList from "./books";
import ShowCards from "./showcards";

function About() {
  return <div>{<ShowCards />}</div>;
}

export default About;
