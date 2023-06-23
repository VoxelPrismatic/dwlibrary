import React from 'react'
import Home from "./components/Home";
import Transcript from "./components/transcript";
import Cancelled from "./components/cancelled";
import { Routes, Route} from 'react-router-dom'
import Navbar from './components/navbar';


const App = () => {
  return (
    <>
      
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/transcript" element={<Transcript/>} />
        <Route path="/cancelled" element={<Cancelled/>} />
      </Routes>
    </>
  );
}

export default App