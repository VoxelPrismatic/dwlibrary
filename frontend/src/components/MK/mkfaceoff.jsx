import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
// Import your image files
import MWalsh from "../../media/faceoff/mwalsh.jpg";
import Jjordan from "../../media/faceoff/jjordan.jpg";
import Bshapiro from "../../media/faceoff/bshapiro.jpg";
import Mmalice from "../../media/faceoff/mmalice.jpg";
import Aklavan from "../../media/faceoff/aklavan.jpg";
import Drubin from "../../media/faceoff/drubin.jpg";
import Mwalshw from "../../media/faceoff/mwalshw.jpg";
// Import other images as needed

const MyTable = () => {
  // Data for the table rows, including titles, points, winners, and images
  const rows = [
    {
      title: "Michael Knowles Vs Walsh Women Edition",
      points: "11-7",
      winner: "Michael Knowles",
      image: MWalsh
    },
    {
      title: "Michael Knowles Vs Ben Shapiro Famous Dead Guys",
      points: "12-9",
      winner: "Michael Knowles",
      image: Bshapiro
    },
    {
      title: "Michael Knowles Vs Michael Malice Famous Dictators",
      points: "12-11",
      winner: "Michael Knowles",
      image: Mmalice
    },
    {
      title: "Michael Knowles Vs Dave Rubin Culture War",
      points: "10-8",
      winner: "Michael Knowles",
      image: Drubin
    },
    {
      title: "Michael Knowles Vs Matt Walsh Catholic Edition",
      points: "11-7",
      winner: "Michael Knowles",
      image: Mwalshw
    },
    {
      title: "Michael Knowles Andrew Klavan Riddles",
      points: "7-10",
      winner: "Andrew Klavan",
      image: Aklavan
    },
    {
      title: "Michael Knowles vs Jim Jordan Corrupt Democrats",
      points: "8-8",
      winner: "Tied",
      image: Jjordan
    }
    // Add more rows with titles, points, winners, and respective images
  ];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Points</TableCell>
            <TableCell>Winner</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <div>
                  <span>{row.title}</span>
                  <br />
                  <img
                    src={row.image}
                    alt={row.title}
                    style={{ maxWidth: "300px", maxHeight: "100px" }}
                  />
                </div>
              </TableCell>
              <TableCell>{row.points}</TableCell>
              <TableCell>{row.winner}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MyTable;
