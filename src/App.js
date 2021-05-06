import React, { useState,useEffect } from "react";
import CategoriesList from "./js/components/categories-list/categories-list";

import "./app.scss";
import Clock from "./js/components/clock/clock";
import Twitch from "./js/components/twitch/twitch";
import UserSettings from "./js/components/config/user-settings";
import HomePageSettings from "./js/components/config/context";
import UserContext from "./js/context/UserContext";
import Login from "./js/components/login/login";
import { getUserData } from "./js/firebase/services";

const App = () => {
  const [showTwitch, setShowTwitch] = useState(false);
  const [updateTwitch, setUpdateTwitch] = useState(false);
  const [twitchUser, setTwitchUser] = useState("");
  const [isTwitchCollapsed, setIsTwitchCollapsed] = useState(false);

  const [categories, setCategories] = useState([]);

  const [user, setUser] = useState(null);

  useEffect(() => {
    if(user){
      getUserData(user.name, setCategories, setTwitchUser, setShowTwitch);
    }
  }, [setCategories, user]);

  return (
    <UserContext.Provider
      value={{
        state: {
          user,
        },
        actions: {
          setUser,
        },
      }}
    >
      <Clock />
      <HomePageSettings.Provider
        value={{
          state: {
            showTwitch,
            twitchUser,
            updateTwitch,
            isTwitchCollapsed,
          },
          actions: {
            setShowTwitch,
            setTwitchUser,
            setUpdateTwitch,
            setIsTwitchCollapsed,
          },
        }}
      >
        {user && user.isAuthenticated ? (
          <>
            <UserSettings />
            <Twitch />
            <CategoriesList categories={categories} />
          </>
        ) : (
          <Login />
        )}
      </HomePageSettings.Provider>
    </UserContext.Provider>
  );
};

export default App;
