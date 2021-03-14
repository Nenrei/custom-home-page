import React from "react";
const HomePageSettings = React.createContext({
  state: {
    showTwitch: false,
    twitchUser: "",
    websitesUser: "",
    updateTwitch: "",
  },
  actions: {
    setShowTwitch: null,
    setTwitchUser: null,
    setWebsitesUser: null,
    setUpdateTwitch: null,
  },
});
export default HomePageSettings;
