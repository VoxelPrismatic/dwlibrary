import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

const useStyles = makeStyles((theme) => ({
  episodeText: {
    color: "#cb767d"
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: theme.spacing(0.5)
  },
  gridContainer: {
    paddingTop: theme.spacing(2)
  },
  author: {
    fontSize: "1rem",
    fontStyle: "italic",
    color: "#555"
  },
  coverImageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "300px", // Fixed height for the Card
    borderRadius: theme.spacing(1)
  },
  coverImage: {
    objectFit: "contain", // Ensure the image is fully visible
    width: "150px", // Fixed width for the image
    height: "225px" // Fixed height for the image
  }
}));

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Fetch books from the backend when the component mounts
    axios
      .get(
        "https://the-sweet-baby-gang-backend-git-main-tyler-sowers-projects.vercel.app/api/books"
      )
      .then((response) => setBooks(response.data))
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  const handleCardClick = (book) => {
    setSelectedBook(book);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const classes = useStyles();

  return (
    <div>
      <Grid container spacing={2} className={classes.gridContainer}>
        {books.map((book) => (
          <Grid item key={book._id} xs={12} sm={6} md={4} lg={3}>
            <Card
              onClick={() => handleCardClick(book)}
              style={{ cursor: "pointer", height: "100%" }} // Set a fixed height for the Card
            >
              <div className={classes.coverImageContainer}>
                <img
                  src={book.coverimage}
                  alt={book.title}
                  className={classes.coverImage}
                />
              </div>
              <CardContent style={{ height: "100%" }}>
                <Typography variant="h6" className={classes.title}>
                  {book.title}
                </Typography>
                <Typography variant="subtitle1" className={classes.author}>
                  {book.author}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedBook && selectedBook.title}</DialogTitle>
        <DialogContent>
          <img
            src={selectedBook && selectedBook.coverimage}
            alt={selectedBook && selectedBook.title}
            style={{ height: 200, objectFit: "cover" }}
          />
          <DialogContentText>
            <Typography variant="subtitle1">
              Author: {selectedBook && selectedBook.author}
            </Typography>
            <Typography variant="body2">
              <span className={classes.episodeText}>Episode:</span>{" "}
              {selectedBook && selectedBook.episode}
            </Typography>
            <Typography variant="body1">
              {selectedBook && selectedBook.description}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BooksList;
