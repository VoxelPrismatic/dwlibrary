import React from 'react'
import Home from "./components/Home";
import Transcript from "./components/transcript";
import Cancelled from "./components/cancelled";
import Books from "./components/books";
import { Routes, Route} from 'react-router-dom'
import Navbar from './components/navbar';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';


// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#303030', // Customize the primary color '#cb767d' - pinkish
    },
    secondary: {
      main: '#ffffff', // Customize the secondary color  White - #303030'#cb767d'
    },
  },
});

const App = () => {
  return (
    <>
    <ThemeProvider theme={theme}>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/transcript" element={<Transcript/>} />
        <Route path="/cancelled" element={<Cancelled/>} />
        <Route path="/books" element={<Books/>} />
      </Routes>
    </ThemeProvider>
    </>
  );
}

export default App