import React from "react";
const HomePageSettings = React.createContext({
  state: {
    isTwitchCollapsed: false,
    showTwitch: false,
    twitchUser: "",
    websitesUser: "",
    updateTwitch: "",
  },
  actions: {
    setIsTwitchCollapsed: null,
    setShowTwitch: null,
    setTwitchUser: null,
    setWebsitesUser: null,
    setUpdateTwitch: null,
  },
});
export default HomePageSettings;
