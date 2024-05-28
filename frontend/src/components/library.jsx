import React, { useState } from "react";
import BooksList from "./books"; // Import your Books component

import {
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import LibraryImage from "../media/library.jpg";
import { makeStyles } from "@material-ui/core/styles";
import Johnny from "../media/johnnythewalrus.jpg";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

const useStyles = makeStyles((theme) => ({
  coverImageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    borderRadius: theme.spacing(1)
  },
  coverImage: {
    width: "80%"
  },
  mattsBooks: {
    width: "70%"
  },
  card: {
    cursor: "pointer"
  },
  libraryBooksIcon: {
    marginRight: theme.spacing(1), // Adjust the margin as needed
    fontSize: "1.5rem" // Adjust the font size as needed
  }
}));

const SweetBabyLibrary = () => {
  const [selectedBook, setSelectedBook] = useState(null);

  const handleDescriptionClick = (book) => {
    setSelectedBook(book);
  };

  const handleCloseDescription = () => {
    setSelectedBook(null);
  };

  const classes = useStyles();

  const books = [
    {
      _id: 1,
      title: "Johnny The Walrus",
      author: "Matt Walsh",
      coverimage: Johnny,
      description:
        "Johnny is a little boy with a big imagination. One day he pretends to be a big scary dinosaur, the next day he’s a knight in shining armor or a playful puppy. But when the internet people find out Johnny likes to make-believe, he’s forced to make a decision between the little boy he is and the things he pretends to be — and he’s not allowed to change his mind."
    }
  ];

  return (
    <Grid container spacing={2} marginLeft={"5px"}>
      {/* library image */}
      <Grid item xs={12}>
        <Paper elevation={3} style={{ padding: 20, textAlign: "center" }}>
          <img
            src={LibraryImage}
            alt="The Sweet Baby Library"
            className={classes.coverImage}
          />
        </Paper>
      </Grid>

      {/* recommended */}
      <Grid item xs={12} marginLeft={"5px"}>
        <BooksList />
      </Grid>

      {/* Matts books */}
      <Grid
        container
        spacing={2}
        className={classes.gridContainer}
        marginTop={"10px"}
        marginLeft={"5px"}
      >
        {books.slice(0, 4).map((book) => (
          <Grid item key={book._id} xs={12} sm={6} md={4} lg={3}>
            <Card className={classes.card}>
              <div className={classes.coverImageContainer}>
                <img
                  src={book.coverimage}
                  alt={book.title}
                  className={classes.mattsBooks}
                />
              </div>
              <CardContent>
                <Typography variant="h6">{book.title}</Typography>
                <Typography variant="subtitle1">
                  Author: {book.author}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => handleDescriptionClick(book)}
                >
                  Description
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Description Popout */}
      <Dialog open={!!selectedBook} onClose={handleCloseDescription}>
        {selectedBook && (
          <>
            <DialogTitle>{selectedBook.title}</DialogTitle>
            <DialogContent>
              <div className={classes.coverImageContainer}>
                <img
                  src={selectedBook.coverimage}
                  alt={selectedBook.title}
                  className={classes.mattsBooks}
                />
              </div>
              <Typography variant="subtitle1">
                Author: {selectedBook.author}
              </Typography>
              <Typography variant="body2">
                {selectedBook.description}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDescription}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Grid>
  );
};

export default SweetBabyLibrary;
