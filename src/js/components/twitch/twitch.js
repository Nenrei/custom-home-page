import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClientCredentialsAuthProvider } from "twitch-auth";
import "./twitch.css";
import { MdAutorenew } from "react-icons/md";

const Twitch = () => {
  const twitchUserId="xxxxx";

  const [loading, setLoading] = useState(true);
  const [liveChannels, setLiveChannels] = useState([]);

  const clientId = "kokt9fj6hrvmut0vq6nrssio6n8e06";
  const clientSecret = "3ckxchwi183wbtsmxhd36oa9lo41ot";
  const authProvider = new ClientCredentialsAuthProvider(
    clientId,
    clientSecret
  );

  let api;

  useEffect(() => {
    handleRefresh();

    setInterval(() => {
      handleRefresh(null, true);
    }, 30000);
  }, []);

  const handleRefresh = (e, ignoreLoading) => {
    if(!ignoreLoading){
      setLoading(true);
    }
    authProvider.getAccessToken().then((res) => {
      api = axios.create({
        headers: {
          "Client-ID": clientId,
          Authorization: "Bearer " + res.accessToken,
        },
      });

      getFollowedUsers();
    });
  };

  const getFollowedUsers = () => {
    api
      .get(
        `https://api.twitch.tv/helix/users/follows?from_id=${twitchUserId}&first=100`
      )
      .then((response) => {
        let followsIds = [];
        response.data.data.forEach((follow) => {
          followsIds.push(`user_id=${follow.to_id}`);
        });
        getLiveUsers(followsIds.join("&"));
      });
  };

  const getLiveUsers = (ids) => {
    api.get(`https://api.twitch.tv/helix/streams?${ids}`).then((response) => {
      if (response.data.data.length > 0) {
        getLiveUserData(response.data.data);
      } else {
        setLoading(false);
      }
    });
  };

  const getLiveUserData = (liveUsersData) => {
    let promises = [];

    liveUsersData.forEach((liveUserData) => {
      promises.push(
        api.get(`https://api.twitch.tv/helix/users?id=${liveUserData.user_id}`)
      );
    });

    Promise.all(promises).then(function (responses) {
      let tempLiveUsersData = [];
      let tempUsersData = [];
      responses.forEach((response) => {
        tempLiveUsersData.push(response.data.data[0]);
      });

      const sortedLives = liveUsersData.sort((a, b) =>
        a.user_id > b.user_id ? 1 : -1
      );
      const sortedUsers = tempLiveUsersData.sort((a, b) =>
        a.id > b.id ? 1 : -1
      );

      for (let i = 0; i < sortedLives.length; i++) {
        tempUsersData.push({
          ...sortedLives[i],
          ...sortedUsers[i],
        });
      }

      setLiveChannels(tempUsersData);
      setLoading(false);
    });
  };

  return (
    <div className="twitch-live-channels">
      <h2>
        Twitch Live Channels{" "}
        <MdAutorenew
          className="twitch-live-channels__refresh"
          onClick={handleRefresh}
        />{" "}
      </h2>
      {loading ? (
        <div className="twitch-live-channels__loading">
          Loading Twitch channels...
        </div>
      ) : !loading && liveChannels.length > 0 ? (
        <div className="twitch-live-channels">
          {liveChannels.map((live) => {
            return (
              <a
                className="twitch-live-channels__channel"
                key={live.user_id}
                href={`https://www.twitch.tv/${live.login}`}
              >
                <div className="twitch-live-channels__channel__name">
                  {live.user_name}
                </div>
                <div className="twitch-live-channels__channel__image">
                  <img src={live.profile_image_url} />
                </div>
                <div className="twitch-live-channels__channel__game" title={live.game_name}>
                  {live.game_name}
                </div>
                <div className="twitch-live-channels__channel__viewers">
                  {live.viewer_count} <div></div>
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="twitch-live-channels__no-chanels"></div>
      )}
    </div>
  );
};

export default Twitch;
