import React, { useState } from "react";
import CategoriesList from "./js/components/categories-list/categories-list";

import "./app.scss";
import Clock from "./js/components/clock/clock";
import Twitch from "./js/components/twitch/twitch";
import UserSettings from "./js/components/config/user-settings";
import HomePageSettings from "./js/components/config/context";

const App = () => {
  const [showTwitch, setShowTwitch] = useState(false);
  const [updateTwitch, setUpdateTwitch] = useState(false);
  const [twitchUser, setTwitchUser] = useState("");

  return (
    <HomePageSettings.Provider
      value={{
        state: { showTwitch, twitchUser, updateTwitch },
        actions: { setShowTwitch, setTwitchUser, setUpdateTwitch },
      }}
    >
      <UserSettings />
      <Clock />
      <Twitch />
      <CategoriesList />
    </HomePageSettings.Provider>
  );
};

export default App;
