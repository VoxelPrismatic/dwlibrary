import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  Grid,
  Button,
  IconButton,
  Select,
  MenuItem
} from "@material-ui/core";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from "@material-ui/icons";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@material-ui/core";
import { Chip } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  episodeText: {
    color: "#cb767d"
  }
}));

const CancelledCard = () => {
  const [cancelled, setCancelled] = useState([]);
  const { page } = useParams(); // Get the 'page' parameter from the URL
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedDialogCardId, setExpandedDialogCardId] = useState(null);
  const [expandedCancelled, setExpandedCancelled] = useState("");
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [currentEpisodeTitle, setCurrentEpisodeTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;
  const [totalItems, setTotalItems] = useState(1);
  const navigate = useNavigate(); // Add this line to get the navigate function

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredCancelleds = cancelled.filter(
    (cancelledItem) =>
      (cancelledItem.context
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        cancelledItem.cancelled
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) &&
      (selectedCategory === "" || cancelledItem.Category === selectedCategory)
  );
  const currentItems = filteredCancelleds.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://the-sweet-baby-gang-backend-tyler-sowers-projects.vercel.app/api/cancelled?page=${currentPage}`
          //`http://localhost:9000/api/cancelled?page=${currentPage}`
        );
        const sortedCancelled = response.data.sort(
          (a, b) => a.episode - b.episode
        );
        setCancelled((prevCancelled) => [...prevCancelled, ...sortedCancelled]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Clear the cancelled state only if it's the first page
    if (currentPage === 1) {
      setCancelled([]);
    }

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // Fetch metadata
        const metaResponse = await axios.get(
          "https://the-sweet-baby-gang-backend-tyler-sowers-projects.vercel.app/api/cancelled/meta"
          //"http://localhost:9000/api/cancelled/meta"
        );
        const totalCount = metaResponse.data.totalCount;
        setTotalItems(totalCount);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };

    fetchMetadata();
  }, []);

  // const handleSearchChange = (event) => {
  //   setSearchQuery(event.target.value);
  //   setCurrentPage(1);
  // };

  // const handleCategoryChange = (event) => {
  //   setSelectedCategory(event.target.value);
  //   setCurrentPage(1);
  // };

  // const clearCategorySelection = () => {
  //   setSelectedCategory("");
  //   setCurrentPage(1);
  // };

  const highlightText = (text) => {
    const regex = new RegExp(searchQuery, "gi");
    return text.replace(
      regex,
      (match) => `<span style="background-color: yellow">${match}</span>`
    );
  };

  const opencancelledDialog = (cardId) => {
    const cancelledItem = cancelled.find((item) => item._id === cardId);
    if (cancelledItem) {
      setExpandedCancelled(cancelledItem.context);
      setExpandedDialogCardId(cardId);
      setCurrentEpisodeTitle(
        `The Daily Cancellation for Episode: ${cancelledItem.episode}`
      );
      setIsDialogOpen(true);
    }
  };

  const toggleCardExpansion = (cardId) => {
    if (cardId === expandedCardId) {
      setExpandedCardId(null);
    } else {
      setExpandedCardId(cardId);
    }
  };

  // const categories = Array.from(
  //   new Set(cancelled.map((item) => item.Category))
  // ); // Get unique categories

  const classes = useStyles();
  return (
    <div>
      <Box display="flex" justifyContent="center" marginTop={2}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            disabled={currentPage === i + 1}
          >
            {i + 1}
          </button>
        ))}
      </Box>
      {/* <Box display="flex" justifyContent="center" marginBottom={2}>
        <TextField
          margin=""
          label="Panda's shouldn't Exist"
          //value={searchQuery}
          //onChange={handleSearchChange}
        />
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="" disabled>
            Select Category
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
          {selectedCategory && (
            <MenuItem value="" onClick={clearCategorySelection}>
              Remove Filters
            </MenuItem>
          )}
        </Select>
      </Box> */}
      <Grid container spacing={2}>
        {currentItems.map((cancelledItem) => (
          <Grid item xs={6} sm={6} md={3} lg={3} key={cancelledItem._id}>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="h5" component="h2">
                    {cancelledItem.cancelled}
                  </Typography>
                  <Button
                    onClick={() => opencancelledDialog(cancelledItem._id)}
                  >
                    Popout
                  </Button>
                  <IconButton
                    onClick={() => toggleCardExpansion(cancelledItem._id)}
                  >
                    {expandedCardId === cancelledItem._id ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  <span className={classes.episodeText}>Episode:</span>{" "}
                  {cancelledItem.episode}
                </Typography>

                <Typography
                  color="textSecondary"
                  gutterBottom
                  style={{ marginTop: "25px" }}
                >
                  <span className={classes.episodeText}>Category</span> {"\n"}{" "}
                  {"\n"}
                  <Chip
                    label={cancelledItem.Category}
                    size="small"
                    variant="outlined"
                  />
                </Typography>

                {expandedCardId === cancelledItem._id && (
                  <Typography
                    variant="body2"
                    component="p"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(cancelledItem.context)
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="lg"
      >
        <DialogTitle>{currentEpisodeTitle}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" component="p">
            <span
              dangerouslySetInnerHTML={{
                __html: highlightText(expandedCancelled)
              }}
              className={classes.highlightedText}
            />
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Box display="flex" justifyContent="center" marginTop={2}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            disabled={currentPage === i + 1}
          >
            {i + 1}
          </button>
        ))}
      </Box>
    </div>
  );
};

export default CancelledCard;
