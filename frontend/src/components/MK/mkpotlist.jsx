import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper
} from "@material-ui/core";
import Mayflower from "../../media/mayflowerbanner.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 400,
    margin: "auto",
    marginBottom: theme.spacing(2)
  },
  title: {
    textAlign: "center",
    marginBottom: theme.spacing(1),
    fontFamily: "Helvetica Neue" // Change 'YourCustomFont' to your custom font name
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline"
    }
  },
  bannerLink: {
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%"
  },
  listContainer: {
    marginTop: theme.spacing(2)
  },
  listItem: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
    "&:hover": {
      boxShadow: theme.shadows[6]
    }
  }
}));

const MKPotlist = () => {
  const classes = useStyles();

  const listItems = [
    "Sin Spinach",
    "Devil's Lettuce",
    "California Cumin",
    "Peruvian parsley",
    "Haitian oregano",
    "Bob Marley cabbage",
    "Colombian Cuban",
    "Old Hippie Oregano",
    "Jazz cigarettes"
  ];

  return (
    <div className={classes.root}>
      <Typography variant="h5" className={classes.title}>
        <a
          href="https://mayflowercigars.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={classes.link}
        >
          Mayflowercigars.com
        </a>
      </Typography>
      <a
        href="https://mayflowercigars.com/"
        target="_blank"
        rel="noopener noreferrer"
        className={classes.bannerLink}
      >
        <img src={Mayflower} alt="Banner" className={classes.bannerLink} />
      </a>

      <div className={classes.listContainer}>
        <List component={Paper} elevation={3}>
          {listItems.map((item, index) => (
            <ListItem key={index} className={classes.listItem}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default MKPotlist;
