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
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [searchInput, setSearchInput] = useState("");
  const [typingSearchInput, setTypingSearchInput] = useState("");
  const [categoryFilterActive, setCategoryFilterActive] = useState(false);

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

  const fetchData = async () => {
    try {
      let endpoint;

      // Encode the selected category before including it in the endpoint
      const encodedCategory = encodeURIComponent(selectedCategory);

      if (encodedCategory) {
        endpoint = `http://localhost:9000/api/cancelled/${encodedCategory}?page=${currentPage}`;
      } else {
        endpoint = searchInput
          ? `http://localhost:9000/api/cancelled?query=${searchInput}&page=${currentPage}`
          : `http://localhost:9000/api/cancelled?page=${currentPage}`;
      }

      const response = await axios.get(endpoint);
      const sortedCancelled = response.data.sort(
        (a, b) => a.episode - b.episode
      );
      setCancelled(sortedCancelled);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, selectedCategory, searchInput]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // Fetch metadata
        const metaResponse = await axios.get(
          "http://localhost:9000/api/cancelled/meta"
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

  const handleSearchSubmit = async () => {
    setSearchInput(typingSearchInput); // Set the final search input
    try {
      const response = await axios.get(
        `http://localhost:9000/api/cancelled?query=${typingSearchInput}`
      );
      const searchResults = response.data;
      setCancelled(searchResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
    setCategoryFilterActive(true);
  };

  const handleTypingSearch = (e) => {
    setTypingSearchInput(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`/cancelled?page=${pageNumber}`);
  };

  const clearCategorySelection = () => {
    setSelectedCategory("");
    setCategoryFilterActive(false);

    // Reset the current page to 1
    setCurrentPage(1);

    // Update the URL
    navigate("/cancelled?page=1");
  };

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

  const categories = Array.from(
    new Set(cancelled.map((item) => item.Category))
  ); // Get unique categories

  const classes = useStyles();
  return (
    <div>
      <Box
        display="flex"
        justifyContent="center"
        marginTop={2}
        marginBottom={2}
      >
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            disabled={currentPage === i + 1}
          >
            {i + 1}
          </button>
        ))}
      </Box>
      <Box display="flex" justifyContent="center" marginBottom={2}>
        <Box display="flex" justifyContent="center" marginBottom={2}>
          <TextField
            label="Search"
            variant="outlined"
            value={typingSearchInput}
            onChange={handleTypingSearch}
          />
          {/* Use handleSearchSubmit for the button click */}
          <Button
            onClick={handleSearchSubmit}
            variant="contained"
            color="primary"
          >
            Search
          </Button>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        marginTop={2}
        marginBottom={2}
      >
        <Box display="flex" alignItems="center">
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
          </Select>

          {categoryFilterActive && (
            <Chip
              label="Clear Filters"
              size="small"
              onDelete={clearCategorySelection}
              variant="outlined"
              style={{ marginLeft: 8 }} // Adjust styling as needed
            />
          )}
        </Box>
      </Box>
      <Grid container spacing={2}>
        {filteredCancelleds.map((cancelledItem) => (
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
            {expandedCancelled}
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
