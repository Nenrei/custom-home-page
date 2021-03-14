import { useState } from "react";
import axios from "axios";
import { ClientCredentialsAuthProvider } from "twitch-auth";

export function useTwitch({twitchUser}) {
  const [liveChannels, setLiveChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  const clientId = "kokt9fj6hrvmut0vq6nrssio6n8e06";
  const clientSecret = "3ckxchwi183wbtsmxhd36oa9lo41ot";
  const authProvider = new ClientCredentialsAuthProvider(
    clientId,
    clientSecret
  );

  let api;

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

  const getLiveUsers = (ids) => {
    api.get(`https://api.twitch.tv/helix/streams?${ids}`).then((response) => {
      if (response.data.data.length > 0) {
        getLiveUserData(response.data.data);
      } else {
        setLoading(false);
      }
    });
  };

  const getFollowedUsers = (userId) => {
    api
      .get(
        `https://api.twitch.tv/helix/users/follows?from_id=${userId}&first=100`
      )
      .then((response) => {
        let followsIds = [];
        response.data.data.forEach((follow) => {
          followsIds.push(`user_id=${follow.to_id}`);
        });
        getLiveUsers(followsIds.join("&"));
      });
  };

  const getUserId = () => {
    if(twitchUser && twitchUser.length > 0){
      api
        .get(`https://api.twitch.tv/helix/users?login=${twitchUser}`)
        .then((response) => {
          getFollowedUsers(response.data.data[0].id);
        })
        .catch((response) => {
          console.error(`Twitch user "${twitchUser}" not found`);
          setLoading(false);
        });
    }
  };

  const handleRefresh = (showTwitch) => {
    if(showTwitch){
      setLoading(true);
      authProvider.getAccessToken().then((res) => {
        api = axios.create({
          headers: {
            "Client-ID": clientId,
            Authorization: "Bearer " + res.accessToken,
          },
        });
        getUserId();
      });
    }
  };

  return {
    twitchState: {
      liveChannels,
      loading,
    },
    actions: {
      handleRefresh,
    },
  };
}
