import React, { useState, useEffect } from "react";
import CategoriesList from "./js/components/categories-list/categories-list";

import "./app.scss";
import Clock from "./js/components/clock/clock";
import Twitch from "./js/components/twitch/twitch";
import UserSettings from "./js/components/config/user-settings";
import HomePageSettings from "./js/components/config/context";
import UserContext from "./js/context/UserContext";
import Login from "./js/components/login/login";
import { getUserData, signIn, signOut, signUp } from "./js/firebase/services";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { setAuthUser } from "./js/chromestorage/services";
import { encodeEmail } from "./js/utils/firebaseTwitchEncoder"

const App = () => {
  //Login
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Twitch
  const [showTwitch, setShowTwitch] = useState(false);
  const [updateTwitch, setUpdateTwitch] = useState(false);
  const [twitchUser, setTwitchUser] = useState("");
  const [isTwitchCollapsed, setIsTwitchCollapsed] = useState(false);

  //Content
  const [categories, setCategories] = useState([]);

  //User Context
  const [user, setUser] = useState(null);

  const fillUser = (response) => {
    setUser({
      email: response.user["email"],
      name: encodeEmail(response.user["email"]),
      isAuthenticated: true,
    });
    setAuthUser(response.user["email"]);
  };

  const clearUser = () => {
    setUser({ email: ``, name: ``, isAuthenticated: false });
    setShowLogin(true);
    setAuthUser(``);
    setEmail(``);
    setPassword(``);
    setCategories([]);
  };

  const onSignIn = () => {
    signUp(email, password, setError, fillUser);
  };

  const onLogin = () => {
    signIn(email, password, setError, fillUser);
  };

  const onLogout = () => {
    signOut(clearUser);
  };

  useEffect(() => {
    if (user && user.name.length > 0) {
      getUserData(
        user.name,
        setCategories,
        setTwitchUser,
        setShowTwitch,
        setLoading
      );
    }
  }, [user]);

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
          !loading ? (
            <>
              <UserSettings onLogout={onLogout} />
              <Twitch />
              <CategoriesList categories={categories} />
            </>
          ) : (
            <h1 className="app-loading">
              <AiOutlineLoading3Quarters className="app-loading__icon" />
            </h1>
          )
        ) : (
          <Login
            showLogin={showLogin}
            setShowLogin={setShowLogin}
            onLogin={onLogin}
            onSignIn={onSignIn}
            encodeEmail={encodeEmail}
            error={error}
            setError={setError}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />
        )}
      </HomePageSettings.Provider>
    </UserContext.Provider>
  );
};

export default App;
