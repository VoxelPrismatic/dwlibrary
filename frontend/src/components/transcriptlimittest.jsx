import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, TextField, Box, IconButton } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@material-ui/icons';
import axios from 'axios';

const TranscriptCard = () => {
  const [transcript, setTranscript] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [limit, setLimit] = useState(50);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/posts?limit={limit}');
        setTranscript(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const highlightText = (text) => {
    const regex = new RegExp(searchQuery, 'gi');
    return text.replace(regex, (match) => `<span style="background-color: yellow">${match}</span>`);
  };

  const handleLimitChange = (event) => {
    const newLimit = parseInt(event.target.value);
    setLimit(newLimit);
  };
  

  const [expandedCardId, setExpandedCardId] = useState(null);

  const toggleCardExpansion = (cardId) => {
    if (cardId === expandedCardId) {
      setExpandedCardId(null);
    } else {
      setExpandedCardId(cardId);
    }
  };

  const filteredTranscripts = transcript.slice(0, limit).filter((transcriptItem) =>
  transcriptItem.transcript.includes(searchQuery)
);


  return (
    <div>
      <Box display="flex" justifyContent="center" marginBottom={2}>
        <TextField
          label="Result Limit"
          type="number"
          value={limit}
          onChange={handleLimitChange}
        />
        <TextField
          label="Search Transcript"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Box>
      {filteredTranscripts.map((transcriptItem) => (
        <Card key={transcriptItem._id}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h5" component="h2">
                {transcriptItem.title}
              </Typography>
              <IconButton onClick={() => toggleCardExpansion(transcriptItem._id)}>
                {expandedCardId === transcriptItem._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            <Typography color="textSecondary" gutterBottom>
              Episode: {transcriptItem.episode}
            </Typography>
            {expandedCardId === transcriptItem._id && (
              <Typography
                variant="body2"
                component="p"
                dangerouslySetInnerHTML={{
                  __html: highlightText(transcriptItem.transcript),
                }}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TranscriptCard;
