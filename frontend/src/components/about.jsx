import React from "react";
import { Container, Typography, Paper } from "@mui/material";
import Cry from "./cry";
import WebsiteHeadBanner from "./header";
import BooksList from "./books";

function About() {
  return (
    <div>
      {<BooksList />}
      {/* {<WebsiteHeadBanner />}
      {<Cry />}\ */}
    </div>
  );
}

export default About;
