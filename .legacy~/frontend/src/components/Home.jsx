import React from "react";
import Banner from "./header";
import ShowCards from "./showcards";

function Home() {
  return (
    <div>
      {<ShowCards />}
      {<Banner />}
    </div>
  );
}

export default Home;
