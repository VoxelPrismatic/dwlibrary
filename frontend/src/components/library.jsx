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
import Church from "../media/churchofcowards.jpg";
import WIAW from "../media/wiaw.jpg";
import Unholytrinity from "../media/unholytrinity.jpg";
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
  const [showBooksList, setShowBooksList] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleBooksClick = () => {
    setShowBooksList(true);
  };

  const handleCloseBooks = () => {
    setShowBooksList(false);
  };

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
    },
    {
      _id: 2,
      title: "What Is A Women?",
      author: "Matt Walsh",
      coverimage: WIAW,
      description: (
        <>
          A NATIONAL BESTSELLER
          <br />
          Publishers Weekly Bestseller
          <br />
          USA Today Bestseller
          <br />
          Wall Street Journal Bestseller
          <br />
          Seattle Times Bestseller
          <br />
          Amazon Bestseller
          <br />
          Is this even a question?
          <br />
          <br />
          What is a woman? For months, Matt Walsh devoted nearly every waking
          hour to answering this simple question. Honestly, it’s a question he
          never thought he’d have to ask.
          <br />
          <br />
          But all of a sudden, way too many people don’t seem to know the
          answer. Is a woman a woman just by feeling or acting a particular way?
          Aren’t gender roles just a "social construct"? Can a woman be “trapped
          in a man’s body”? Does being a woman mean anything at all?
          <br />
          <br />
          We used to think that being a woman had something to do with biology,
          but the nation’s top experts keep assuring us that is definitely not
          the case. So Matt decided to do what no man (whatever that means) had
          done before. He sat down with the experts and asked them directly.
          <br />
          <br />
          In What Is a Woman?, our hero:
          <br />
          - Discovers that no one—not doctors, therapists, psychiatrists,
          politicians, transgender people, nor San Franciscans—can actually
          define the word “woman”
          <br />
          - Hilariously convinces a non-binary therapist that Matt is
          questioning his own gender identity
          <br />
          - Uncovers the shocking and horrifying roots of transgender theory
          <br />
          - Learns exactly how activists and ideologues are trying to take over
          the minds of our kids
          <br />
          - Reveals a strategy to defeat the collective insanity that has taken
          over our society
          <br />
          <br />
          Join Matt on his often comical yet deeply disturbing journey as he
          answers the question generations before us never knew they needed to
          ask: What is a woman?
          <br />
          <br />
          ©2022 Matt Walsh (P)2022 DW Books
        </>
      )
    },
    {
      _id: 3,
      title: "Church Of Cowards",
      author: "Matt Walsh",
      coverimage: Church,
      description: (
        <>
          What Would You Surrender for God?
          <br />
          <br />
          Christians in the Middle East, in much of Asia, and in Africa are
          still being martyred for the faith, but how many American Christians
          are willing to lay down their smartphones, let alone their lives, for
          the faith?
          <br />
          <br />
          Being a Christian in America doesn’t require much these days. Suburban
          megachurches are more like entertainment venues than places to worship
          God. The lives that American “Christians” lead aren’t much different
          from those of their atheist neighbors, and their knowledge of theology
          isn’t much better either.
          <br />
          <br />
          Matt Walsh of The Daily Wire exposes the pitiful state of Christianity
          in America today, lays out the stakes for us, our families, and our
          eternal salvation, and invites us to a faith that’s a lot less easy
          and comfortable—but that’s more real and actually worth something.
          <br />
          <br />
          The spiritual junk food we’re stuffing ourselves with is never going
          to satisfy. As St. Augustine said over a millennium ago, our hearts
          are restless until they rest in Him. Only God Himself can make our
          lives anything but ultimately meaningless and empty. And we will never
          get anywhere near Him if we refuse to take up our cross and follow
          Jesus.
          <br />
          <br />
          This rousing call to the real adventure of a living faith is a wake-up
          call to complacent Christians and a rallying cry for anyone
          dissatisfied with a lukewarm faith.
        </>
      )
    },
    {
      _id: 4,
      title: "The Unholy Trinity",
      author: "Matt Walsh",
      coverimage: Unholytrinity,
      description: (
        <>
          It's now or never for conservative values.
          <br />
          <br />
          This highly anticipated debut from Matt Walsh of The Blaze demands
          that conservative voters make a last stand and fight for the moral
          center of America. The Trump presidency and Republican Congress
          provide an urgent opportunity to stop the Left's value-bending march
          to destroy the culture of our country.
          <br />
          <br />
          Republican control of the presidency, senate, and House of
          Representatives for the next two years is a precious—and fleeting—gift
          to conservatives. Americans concerned with blocking liberals’ swift
          rethinking of life, marriage, and gender need to capture this moment
          to turn the tide of history.
          <br />
          <br />
          For years conservatives have worried endlessly about peripheral
          issues, liberals have been hard at work chipping away at the bedrock
          of our civilization, and putting a new foundation in its place. New
          attitudes on abortion, gay marriage, and gender identity threaten to
          become culture defining victories for progressives—radically altering
          not just our politics, but dangerously placing Man above God and the
          self above the good of the whole.
          <br />
          <br />
          What’s at stake? The most fundamental elements of society, including
          how we understand reality itself.
          <br />
          <br />
          In The Unholy Trinity, TheBlaze contributor Matt Walsh draws on
          Catholic teachings to expose how liberals have attempted, with
          startling success, to redefine life, marriage, and gender. Abortion
          redefines human life, gay marriage redefines the family, and the
          latest theories on gender redefine what it means to be a man or a
          woman. The potential consequences are dire.
          <br />
          <br />
          If progressivism can bend life, family, and sex to its whims, Walsh
          argues, it has established relativism over God as the supreme law, and
          owns the power to destroy western civilization.
          <br />
          <br />
          With insight, candor, and faith, Walsh shows conservatives how to
          confront liberal arguments, defeat the progressive agenda for good,
          and reclaim American culture for truth.
        </>
      )
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

      <Paper
        elevation={3}
        style={{ padding: 20, width: "100%", marginTop: "20px" }}
      >
        <Typography
          marginBottom={"20px"}
          fontFamily={"sans-serif"}
          marginRight={"10px"}
        >
          The intention of this section of the site is to catelog all of the
          books recommended on The Matt Walsh Show.
          <br />
          Thus The Sweet Baby Gang Library is born!
          <br />
          <br />
          If you have any books not on the list mentioned on the show email
          SBGHistorian@gmail.com with the book title and the episode you found
          where he mentioned it.
          <br />
          <br />
          Shoutout to TerribleQualityMemes for the amazing picture.
        </Typography>
      </Paper>
      {/* recommended */}
      <Grid item xs={showBooksList ? 12 : 6} marginLeft={"5px"}>
        {showBooksList ? (
          <BooksList onClose={handleCloseBooks} />
        ) : (
          <Button
            style={{ width: 300, height: 200 }}
            variant="contained"
            color="grey"
            onClick={handleBooksClick}
            size="large"
          >
            <LibraryBooksIcon className={classes.libraryBooksIcon} />
            View Recommended Books
          </Button>
        )}
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
