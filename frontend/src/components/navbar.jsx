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
  Popover,
  MenuItem
} from "@material-ui/core";
import { Link, useLocation } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Logo from "../media/dwlogo.png";

const useStyles = makeStyles((theme) => ({
  navbarContainer: {
    display: "flex",
    alignItems: "center",
    borderRadius: "50px", // Adjust the value to make the oval shape smoother or sharper
    overflow: "hidden"
  },
  image: {
    width: "250px",
    marginTop: "15px"
  },
  navbarButton: {
    padding: theme.spacing(1, 2),
    "&:hover": {
      backgroundColor: theme.palette.primary.dark
    },
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  selectedButton: {
    backgroundColor: theme.palette.primary.light
  },
  menuButton: {
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  appBar: {
    backgroundColor: "#000000", // Set the background color of the AppBar
    borderBottom: "4px solid #ffffff",
    width: "auto",
    marginBottom: "15px",
    position: "static",
    zIndex: theme.zIndex.drawer + 1
  },
  dropdownIcon: {
    marginLeft: theme.spacing(1)
  }
}));

const Navbar = () => {
  const classes = useStyles();
  const location = useLocation();
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [walshMenuAnchor, setWalshMenuAnchor] = useState(null);
  const [knowlesMenuAnchor, setKnowlesMenuAnchor] = useState(null);

  const isActive = (path) => {
    return location.pathname === path ? classes.selectedButton : "";
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleWalshMenuOpen = (event) => {
    setWalshMenuAnchor(event.currentTarget);
  };

  const handleWalshMenuClose = () => {
    setWalshMenuAnchor(null);
  };

  const handleKnowlesMenuOpen = (event) => {
    setKnowlesMenuAnchor(event.currentTarget);
  };

  const handleKnowlesMenuClose = () => {
    setKnowlesMenuAnchor(null);
  };

  return (
    <AppBar className={classes.appBar}>
      <Toolbar>
        <Link to="/">
          <img src={Logo} alt="Logo" className={classes.image} />
        </Link>
        <Box className={classes.navbarContainer}>
          <Button
            color="secondary"
            className={classes.navbarButton}
            aria-haspopup="true"
            onClick={handleWalshMenuOpen}
          >
            <Typography variant="h6" component="span">
              The Matt Walsh Show
            </Typography>
            <ArrowDropDownIcon className={classes.dropdownIcon} />
          </Button>
          <Button
            color="secondary"
            className={classes.navbarButton}
            aria-haspopup="true"
            onClick={handleKnowlesMenuOpen}
          >
            <Typography variant="h6" component="span">
              The Michael Knowles Show
            </Typography>
            <ArrowDropDownIcon className={classes.dropdownIcon} />
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
        <Popover
          open={Boolean(mobileMenuAnchor)}
          anchorEl={mobileMenuAnchor}
          onClose={handleMobileMenuClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
        >
          <Box>
            <MenuItem
              component={Link}
              to="/transcript"
              onClick={handleMobileMenuClose}
              className={isActive("/transcript")}
            >
              Matt Walsh Transcripts
            </MenuItem>
            <MenuItem
              component={Link}
              to="/cancelled"
              onClick={handleMobileMenuClose}
              className={isActive("/cancelled")}
            >
              Matt Walsh Daily Cancellation
            </MenuItem>
            <MenuItem
              component={Link}
              to="/library"
              onClick={handleMobileMenuClose}
              className={isActive("/library")}
            >
              The Sweet Baby Library
            </MenuItem>
            <MenuItem
              component={Link}
              to="/mktranscripts"
              onClick={handleMobileMenuClose}
              className={isActive("/mktranscripts")}
            >
              Michael Knowles Transcripts
            </MenuItem>
            {/* <MenuItem
              component={Link}
              to="/knowles/yaf-speeches"
              onClick={handleMobileMenuClose}
              className={isActive("/knowles/yaf-speeches")}
            >
              Knowles YAF Speeches
            </MenuItem> */}
          </Box>
        </Popover>
        <Popover
          open={Boolean(walshMenuAnchor)}
          anchorEl={walshMenuAnchor}
          onClose={handleWalshMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left"
          }}
        >
          <Box>
            <MenuItem
              component={Link}
              to="/transcript"
              onClick={handleWalshMenuClose}
              className={isActive("/transcript")}
            >
              Matt Walsh Transcripts
            </MenuItem>
            <MenuItem
              component={Link}
              to="/cancelled"
              onClick={handleWalshMenuClose}
              className={isActive("/cancelled")}
            >
              Matt Walsh Daily Cancellation
            </MenuItem>
            <MenuItem
              component={Link}
              to="/library"
              onClick={handleWalshMenuClose}
              className={isActive("/library")}
            >
              The Sweet Baby Library
            </MenuItem>
          </Box>
        </Popover>
        <Popover
          open={Boolean(knowlesMenuAnchor)}
          anchorEl={knowlesMenuAnchor}
          onClose={handleKnowlesMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left"
          }}
        >
          <Box>
            <MenuItem
              component={Link}
              to="/mktranscripts"
              onClick={handleKnowlesMenuClose}
              className={isActive("/mktranscripts")}
            >
              Michael Knowles Transcripts
            </MenuItem>
            {/* <MenuItem
              component={Link}
              to="/knowles/yaf-speeches"
              onClick={handleKnowlesMenuClose}
              className={isActive("/knowles/yaf-speeches")}
            >
              Knowles YAF Speeches
            </MenuItem> */}
          </Box>
        </Popover>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
