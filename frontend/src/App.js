import React from "react";
import Home from "./components/Home";
import Transcript from "./components/walshTranscript";
import Books from "./components/books";
import { Routes, Route } from "react-router"; // Correct import
import Navbar from "./components/navbar";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import MW from "./components/mw";
import Library from "./components/library";
import KnowlesTranscript from "./components/knowlesTranscript";
import MKPotlist from "./components/MK/mkpotlist";
import MWtitles from "./components/mwtitles";
import MKFaceoff from "./components/MK/mkfaceoff";
import Cancelled from "./components/dailycancellation";
import Backstage from "./components/Backstage/backstageTranscripts";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#303030" // Customize the primary color '#cb767d' - pinkish
    },
    secondary: {
      main: "#ffffff" // Customize the secondary color White - #303030'#cb767d'
    }
  }
});

const App = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transcript" element={<Transcript />} />
          <Route path="/books" element={<Books />} />
          <Route path="/mw" element={<MW />} />
          <Route path="/library" element={<Library />} />
          <Route path="/sinspinach" element={<MKPotlist />} />
          <Route path="/mktranscripts" element={<KnowlesTranscript />} />
          <Route path="/mwtitles" element={<MWtitles />} />
          <Route path="/mkfaceoff" element={<MKFaceoff />} />
          <Route path="/cancelled" element={<Cancelled />} />
          <Route path="/backstage" element={<Backstage />} />
        </Routes>
      </ThemeProvider>
    </>
  );
};

export default App;
