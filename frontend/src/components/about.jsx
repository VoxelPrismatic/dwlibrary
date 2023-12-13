import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import Cry from './cry';
import PetPeeve from './petpeeve'
import WebsiteHeadBanner from './header'

function About() {
  return (
    <div>
    {<WebsiteHeadBanner/>}
    {<Cry/>}
    {<PetPeeve/>}
 \
  </div>
  );
}

export default About;
