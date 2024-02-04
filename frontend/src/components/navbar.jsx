import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Divider,
  makeStyles,
  IconButton,
  Menu,
  MenuItem
} from "@material-ui/core";
import { Link, useLocation } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import Logo from "../media/sweetbabylogo.png";

const useStyles = makeStyles((theme) => ({
  navbarContainer: {
    display: "flex",
    alignItems: "center",
    borderRadius: "50px", // Adjust the value to make the oval shape smoother or sharper
    overflow: "hidden",
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  image: {
    width: "350px",
    marginTop: "15px"
  },
  navbarButton: {
    padding: theme.spacing(1, 2),
    "&:hover": {
      backgroundColor: theme.palette.primary.dark
    }
  },
  selectedButton: {
    backgroundColor: theme.palette.primary.light
  },
  menuButton: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "block"
    }
  },
  appBar: {
    backgroundColor: "#303030", // Set the background color of the AppBar
    borderBottom: "4px solid #cb767d",
    width: "auto",
    marginBottom: "15px",
    position: "static",
    zIndex: theme.zIndex.drawer + 1
  }
}));

const Navbar = () => {
  const classes = useStyles();
  const location = useLocation();
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const isActive = (path) => {
    return location.pathname === path ? classes.selectedButton : "";
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  return (
    <AppBar className={classes.appBar}>
      <Toolbar>
        <Link to="/">
          <img src={Logo} alt="Logo" className={classes.image} />
        </Link>
        <Box className={classes.navbarContainer}>
          <Button
            component={Link}
            to="/transcript"
            color="secondary"
            className={`${classes.navbarButton} ${isActive("/transcript")}`}
          >
            <Typography variant="h6">Transcripts</Typography>
          </Button>
          <Divider
            orientation="vertical"
            flexItem
            style={{ backgroundColor: "#cb767d" }}
          />
          <Button
            component={Link}
            to="/cancelled"
            color="secondary"
            className={`${classes.navbarButton} ${isActive("/cancelled")}`}
          >
            <Typography variant="h6">Daily Cancellation</Typography>
          </Button>
          <Divider
            orientation="vertical"
            flexItem
            style={{ backgroundColor: "#cb767d" }}
          />
          <Button
            component={Link}
            to="/library"
            color="secondary"
            className={`${classes.navbarButton} ${isActive("/library")}`}
          >
            <Typography variant="h6">The Sweet Baby Library</Typography>
          </Button>
        </Box>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          className={classes.menuButton}
          onClick={handleMobileMenuOpen}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={mobileMenuAnchor}
          keepMounted
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
        >
          <MenuItem
            component={Link}
            to="/transcript"
            onClick={handleMobileMenuClose}
            className={isActive("/transcript")}
          >
            Transcripts
          </MenuItem>
          <MenuItem
            component={Link}
            to="/cancelled"
            onClick={handleMobileMenuClose}
            className={isActive("/cancelled")}
          >
            Daily Cancellation
          </MenuItem>
          <MenuItem
            component={Link}
            to="/library"
            onClick={handleMobileMenuClose}
            className={isActive("/library")}
          >
            The Sweet Baby Library
          </MenuItem>
          {/* <MenuItem
            component={Link}
            to="/about"
            onClick={handleMobileMenuClose}
            className={isActive("/about")}
          >
            About
          </MenuItem>  */}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
