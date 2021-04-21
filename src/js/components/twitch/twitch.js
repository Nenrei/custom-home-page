import React, { useEffect, useContext } from "react";
import "./twitch.scss";
import { MdAutorenew } from "react-icons/md";
import { useTwitch } from "./use-twitch";
import HomePageSettings from "../config/context";

const Twitch = () => {

  const {
    state: { showTwitch, twitchUser, updateTwitch },
  } = useContext(HomePageSettings);

  const {
    twitchState: { liveChannels, loading },
    actions: { handleRefresh },
  } = useTwitch({twitchUser});

  

  useEffect(() => {
    handleRefresh(showTwitch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateTwitch]);

  return (
    showTwitch ? (
      <div className="twitch-live-channels">
        <h2>
          Twitch Live Channels{" "}
          <MdAutorenew
            className="twitch-live-channels__refresh"
            onClick={()=>{handleRefresh(showTwitch)}}
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
    ) : <div></div>
  );
};

export default Twitch;
