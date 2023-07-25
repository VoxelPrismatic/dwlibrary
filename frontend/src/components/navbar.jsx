import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Divider } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Logo from "../media/SBGFacebookLogo.jpg"

const Navbar = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Link to="/">
          <img src={Logo} alt="Logo" style={{ width: '175px', marginRight: '15px', marginTop: '15px'}}/>
        </Link>
        <Box display="flex">
          <Button component={Link} to="/transcript" color="secondary">
            <Typography variant="h6">Transcripts</Typography>
          </Button>
          <Divider orientation="vertical" flexItem style={{ backgroundColor: '#cb767d' }}/>
          <Button component={Link} to="/cancelled" color="secondary" >
            <Typography variant="h6">Daily Cancellation</Typography>
          </Button>
          <Divider orientation="vertical" flexItem style={{ backgroundColor: '#cb767d' }}/>
          <Button component={Link} to="/books" color="secondary">
            <Typography variant="h6">Books</Typography>
          </Button>
          <Divider orientation="vertical" flexItem style={{ backgroundColor: '#cb767d' }}/>
          <Button component={Link} to="/cryinglist" color="secondary">
            <Typography variant="h6">Should Men Cry?</Typography>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
