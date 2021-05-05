/* eslint-disable no-undef */

export const getCollapsedTwitch = (callback) => {
  if (chrome && chrome.storage) {
    chrome.storage.sync.get(["twitchCollapsed"], ({twitchCollapsed}) => {
      callback(twitchCollapsed);
    });
  }
};

export const setCollapsedTwitch = (twitchCollapsed) => {
  if(chrome && chrome.storage){
    chrome.storage.sync.set({"twitchCollapsed": twitchCollapsed}, function () {});
  }
};

export const getAuthUser = (callback) => {
  if (chrome && chrome.storage) {
    chrome.storage.sync.get(["authUser"], ({authUser}) => {
      callback(authUser);
    });
  }
};

export const setAuthUser = (authUser) => {
  if(chrome && chrome.storage){
    chrome.storage.sync.set({"authUser": authUser}, function () {});
  }
};