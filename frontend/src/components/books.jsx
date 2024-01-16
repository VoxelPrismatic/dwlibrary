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
    height: "100%", // Adjust the height as needed
    borderRadius: theme.spacing(1) // Optional: add border-radius for a rounded look
  },
  coverImage: {
    objectFit: "cover",
    width: "50%" // Ensure the image takes the full width of the container
  },
  libraryBooksIcon: {
    marginRight: theme.spacing(1), // Adjust the margin as needed
    fontSize: "1.5rem" // Adjust the font size as needed
  }
}));

const BooksList = ({ onClose }) => {
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

  const handleCloseBooks = () => {
    onClose(); // Call the onClose function passed from the parent component
  };

  const classes = useStyles();

  return (
    <div>
      {/* Close Button for Books */}
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleCloseBooks}
        style={{ width: 300, height: 200 }}
      >
        <LibraryBooksIcon className={classes.libraryBooksIcon} />
        Close Recommended Books
      </Button>
      <Grid container spacing={2} className={classes.gridContainer}>
        {books.map((book) => (
          <Grid item key={book._id} xs={12} sm={6} md={4} lg={3}>
            <Card
              onClick={() => handleCardClick(book)}
              style={{ cursor: "pointer" }}
            >
              <div className={classes.coverImageContainer}>
                <img
                  src={book.coverimage}
                  alt={book.title}
                  className={classes.coverImage}
                />
              </div>
              <CardContent>
                <Typography variant="h6" className={classes.title}>
                  {book.title}
                </Typography>
                <Typography variant="subtitle1" className={classes.author}>
                  {book.author}
                </Typography>
                <Typography variant="body2">
                  <span className={classes.episodeText}>Episode:</span>{" "}
                  {book.episode}
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
