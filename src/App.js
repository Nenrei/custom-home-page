import React from "react";
import ReactDOM from "react-dom";
import CategoriesList from "./js/components/categories-list/categories-list";

import "./App.css";
import Clock from "./js/components/clock/clock";
import Twitch from "./js/components/twitch/twitch";

const App = () => {
  return (
    <div>
      <Clock/>
      <Twitch/>
      <CategoriesList />
    </div>
  );
};

export default App;
