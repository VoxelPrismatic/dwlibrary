import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  Grid,
  Button,
  Select,
  MenuItem
} from "@material-ui/core";
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
  const [isSearchActive, setIsSearchActive] = useState(false);

  const filteredCancelleds = cancelled.filter(
    (cancelledItem) =>
      cancelledItem.context.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cancelledItem.cancelled.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //this grabs my data and handles category changes and searches
  const fetchData = async () => {
    try {
      let endpoint;
      const encodedCategory = encodeURIComponent(selectedCategory);

      if (encodedCategory) {
        endpoint = `https://the-sweet-baby-gang-backend-git-main-tyler-sowers-projects.vercel.app/api/cancelled/${encodedCategory}?page=${currentPage}`;
      } else {
        endpoint = searchInput
          ? `https://the-sweet-baby-gang-backend-git-main-tyler-sowers-projects.vercel.app/api/cancelled?query=${searchInput}&page=${currentPage}`
          : `https://the-sweet-baby-gang-backend-git-main-tyler-sowers-projects.vercel.app/api/cancelled?page=${currentPage}`;
      }

      const response = await axios.get(endpoint);
      setCancelled(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, selectedCategory, searchInput]);

  //this fetches my meta data

  const fetchMetadata = async () => {
    try {
      // Fetch metadata
      const metaResponse = await axios.get(
        "https://the-sweet-baby-gang-backend-git-main-tyler-sowers-projects.vercel.app/api/cancelled/meta"
        //"https://the-sweet-baby-gang-backend-git-main-tyler-sowers-projects.vercel.app/api/cancelled/meta"
      );
      const totalCount = metaResponse.data.totalCount;
      setTotalItems(totalCount);
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };
  useEffect(() => {
    fetchMetadata();
  }, []);

  const handleSearchSubmit = async () => {
    setSearchInput(typingSearchInput); // Set the final search input
    setIsSearchActive(true);
    try {
      const response = await axios.get(
        `https://the-sweet-baby-gang-backend-git-main-tyler-sowers-projects.vercel.app/api/cancelled?query=${typingSearchInput}`
      );
      const searchResults = response.data;
      setTotalItems(searchResults.length);
      setCancelled(searchResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setTypingSearchInput("");
    setIsSearchActive(false);
    fetchData();
    fetchMetadata();
    // Fetch data again to reset results
  };

  const handleTypingSearch = (e) => {
    setTypingSearchInput(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`/cancelled?page=${pageNumber}`);
  };

  const handleCategoryClick = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setCurrentPage(1); // Reset current page when changing category
    // navigate(`/cancelled/${category}`);
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

  const categories = Array.from(
    new Set(cancelled.map((item) => item.Category))
  ); // Get unique categories

  console.log("categories", selectedCategory);
  console.log("cancelled", cancelled);

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
          <Button
            onClick={handleSearchSubmit}
            variant="contained"
            color="primary"
          >
            Search
          </Button>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" marginBottom={2}>
        <Box display="flex" alignItems="center">
          {isSearchActive && (
            <Chip
              label="Clear Search"
              size="small"
              onDelete={clearSearch}
              variant="outlined"
              style={{ marginLeft: 8 }}
            />
          )}
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" marginBottom={2}>
        <Select
          value={selectedCategory}
          onChange={handleCategoryClick}
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
      </Box>
      {selectedCategory && (
        <Box display="flex" justifyContent="center" marginBottom={2}>
          <Chip
            label={`Selected Category: ${selectedCategory}`}
            onDelete={() => {
              setSelectedCategory("");
              setCurrentPage(1); // Reset current page when clearing category
              navigate(`/cancelled?page=1`);
            }}
            variant="outlined"
            style={{ marginLeft: 8 }}
          />
        </Box>
      )}
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
                <Button onClick={() => opencancelledDialog(cancelledItem._id)}>
                  Popout
                </Button>

                {expandedCardId === cancelledItem._id && (
                  <Typography>{expandedCancelled}</Typography>
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
