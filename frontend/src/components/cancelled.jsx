import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Import useTheme

const CancelledList = () => {
  const [cancelledData, setCancelledData] = useState([]);

  useEffect(() => {
    // Fetch data from your MongoDB API
    axios
      .get('http://localhost:9000/api/cancelled')
      .then((response) => {
        setCancelledData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Cancelled Episodes
      </Typography>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {cancelledData.map((item) => (
          <CancelledCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

const ExpandableContent = ({ content }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded((prevState) => !prevState);
  };

  return (
    <div>
      <Button onClick={toggleExpand} variant="outlined" size="small">
        {expanded ? 'Hide' : 'Show'} Context
      </Button>
      {expanded && (
        <Typography variant="body2" style={{ marginTop: '10px' }}>
          {content}
        </Typography>
      )}
    </div>
  );
};

const CancelledCard = ({ item }) => {
  const theme = useTheme(); // Access the theme object using useTheme
  return (
    <Card
      sx={{
        width: '100%', // Adjust the width to fit the screen on mobile devices
        margin: '10px',
        backgroundColor: '#cccac4',
        boxShadow: '8',
        [theme.breakpoints.up('sm')]: {
          width: '25%', // Set the width to 45% for small screens (e.g., smartphones)
        },
      }}
    >
      <CardContent>
        <Typography variant="h5" component="h2">
          {item.cancelled}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Episode: {item.episode}
        </Typography>
        <ExpandableContent content={item.context} />
      </CardContent>
    </Card>
  );
};

export default CancelledList;
