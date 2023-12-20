import React from "react";
import Home from "./components/Home";
import Transcript from "./components/transcript";
import Books from "./components/books";
import { Routes, Route } from "react-router"; // Correct import
import Navbar from "./components/navbar";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import CancelledList from "./components/cancelled";
import About from "./components/about";

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
          <Route path="/cancelled/:page?" element={<CancelledList />} />
          <Route path="/books" element={<Books />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </ThemeProvider>
    </>
  );
};

export default App;
