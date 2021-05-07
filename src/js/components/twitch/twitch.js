import React, { useEffect, useContext, useState } from "react";
import "./twitch.scss";
import ClassNames from "classnames";
import { MdAutorenew, MdKeyboardArrowLeft } from "react-icons/md";
import { useTwitch } from "./use-twitch";
import HomePageSettings from "../config/context";
import {
  getCollapsedTwitch,
  setCollapsedTwitch,
} from "../../chromestorage/services";

const Twitch = () => {
  const {
    state: { showTwitch, twitchUser, updateTwitch },
    actions: { setIsTwitchCollapsed },
  } = useContext(HomePageSettings);

  const {
    twitchState: { liveChannels, loading },
    actions: { handleRefresh },
  } = useTwitch({ twitchUser });

  const [collapsed, setCollapsed] = useState(false);

  const collapseClass = ClassNames({
    "twitch-live-channels__collapse": true,
    "twitch-live-channels__collapse--collapsed": collapsed,
  });

  const collapseTwitchClass = ClassNames({
    "twitch-live-channels": true,
    "twitch-live-channels--collapsed": collapsed,
  });

  useEffect(() => {
    handleRefresh(showTwitch);
    getCollapsedTwitch((data) => {
      setCollapsed(data);
      setIsTwitchCollapsed(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateTwitch]);

  const handleCollapse = () => {
    setIsTwitchCollapsed(!collapsed);
    setCollapsedTwitch(!collapsed);
    setCollapsed(!collapsed);
  };

  return showTwitch ? (
    <div className={collapseTwitchClass}>
      <h2>
        <span>Canales en Directo </span>
        <MdAutorenew
          className="twitch-live-channels__refresh"
          title="Actualizar Lista"
          onClick={() => {
            handleRefresh(showTwitch);
          }}
        />{" "}
        <MdKeyboardArrowLeft
          className={collapseClass}
          title={collapsed ? "Desplegar" : "Plegar"}
          onClick={() => {
            handleCollapse();
          }}
        />{" "}
      </h2>
      {loading ? (
        <div className="twitch-live-channels__loading">
          Loading Twitch channels...
        </div>
      ) : !loading && liveChannels.length > 0 ? (
        liveChannels.map((live) => {
          return (
            <a
              className="twitch-live-channels__channel"
              key={live.user_id}
              href={`https://www.twitch.tv/${live.login}`}
            >
              <img
                className="twitch-live-channels__channel__image"
                src={live.profile_image_url}
                alt=""
              />

              <div className="twitch-live-channels__channel__data">
                <div className="twitch-live-channels__channel__data__name">
                  {live.user_name}
                </div>
                <div
                  className="twitch-live-channels__channel__data__game"
                  title={live.game_name}
                >
                  {live.game_name}
                </div>
              </div>

              <div className="twitch-live-channels__channel__viewers">
                <div className="twitch-live-channels__channel__viewers__circle"></div>
                <div className="twitch-live-channels__channel__viewers__number">
                  {live.viewer_count}
                </div>
              </div>
            </a>
          );
        })
      ) : (
        <div className="twitch-live-channels__no-chanels"></div>
      )}
    </div>
  ) : (
    <div></div>
  );
};

export default Twitch;
