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
import Crufo from "../../media/faceoff/crufo.jpg";
import CRaichik from "../../media/faceoff/craichik.jpg";
import TPool from "../../media/faceoff/tpool.png";
// Import other images as needed

const MyTable = () => {
  // Data for the table rows, including titles, points, winners, and images
  const rows = [
    {
      title: "Tim Pool: Civil War",
      points: "0-22",
      winner: "Tim Pool",
      image: TPool
    },
    {
      title: "Chaya Raichik: LibsofTikTok",
      points: "0-18",
      winner: "Chaya Raichik",
      image: CRaichik
    },
    {
      title: "Matt Walsh: Women Edition",
      points: "11-7",
      winner: "Michael Knowles",
      image: MWalsh
    },
    {
      title: "Ben Shapiro: Famous Dead Guys Edition",
      points: "12-9",
      winner: "Michael Knowles",
      image: Bshapiro
    },
    {
      title: "Michael Malice: Famous Dictators Edition",
      points: "12-11",
      winner: "Michael Knowles",
      image: Mmalice
    },
    {
      title: "Dave Rubin: Culture War Edition",
      points: "10-8",
      winner: "Michael Knowles",
      image: Drubin
    },
    {
      title: "Matt Walsh: Catholic Edition",
      points: "11-7",
      winner: "Michael Knowles",
      image: Mwalshw
    },
    {
      title: "Christopher Rufo: Race Hustler Edition",
      points: "13-12",
      winner: "Michael Knowles",
      image: Crufo
    },
    {
      title: "Andrew Klavan: Riddles Edition",
      points: "7-10",
      winner: "Andrew Klavan",
      image: Aklavan
    },
    {
      title: "Jim Jordan: Corrupt Democrats Edition",
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
            <TableCell>Contestant: Edition</TableCell>
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
