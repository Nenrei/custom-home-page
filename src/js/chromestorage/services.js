/* eslint-disable no-undef */
export const getWebPages = (categoryId, callback) => {
  if (chrome && chrome.storage) {
    chrome.storage.sync.get(["webSites"], (storedData) => {
      if (storedData.webSites && storedData.webSites.length > 0) {
        const fetchedData = categoryId ? JSON.parse(storedData.webSites).filter((site) => site.categoryId === categoryId) : JSON.parse(storedData.webSites);
        callback(fetchedData.sort((a,b) => (a.id > b.id) ? 1 : -1 ));
      }else{
        callback([])
      }
    });
  }
};

export const addWebPage = (data, callback) => {
  if (chrome && chrome.storage) {
    getWebPages(null, (websites) => {
      const newWebSites = [...websites, data];
      chrome.storage.sync.set(
        { "webSites": JSON.stringify(newWebSites) },
        callback
      );
    });
  }
};

export const removeWebPage = (id, callback) => {
  if (chrome && chrome.storage) {
    getWebPages(null, (websites) => {
      const newWebSites = websites.filter((site) => site.id !== id);
      chrome.storage.sync.set(
        { "webSites": JSON.stringify(newWebSites) },
        callback
      );
    });
  }
};

export const updateWebPage = (data, callback) => {
  if (chrome && chrome.storage) {
    getWebPages(null, (websites) => {
      let newWebSites = websites.filter((site) => site.id !== data.id);
      newWebSites = [...newWebSites, data];
      chrome.storage.sync.set(
      { "webSites": JSON.stringify(newWebSites) },
        callback
      );
    });
  }
};

export const getWebCategories = (callback) => {
  if (chrome && chrome.storage) {
    chrome.storage.sync.get(["categories"], (storedData) => {
      if (storedData.categories && storedData.categories.length > 0) {
        const fetchedData = JSON.parse(storedData.categories);
        callback(fetchedData.sort((a,b) => (a.id > b.id) ? 1 : -1 ));
      }else{
        callback([]);
      }
    });
  }
};

export const addWebCategory = (categories, data, callback) => {
  if (chrome && chrome.storage) {
    const newCategories = [...categories, data];
    chrome.storage.sync.set(
      { "categories": JSON.stringify(newCategories) },
      callback
    );
  }
};

export const removeWebCategory = (categories, id, callback) => {
  if (chrome && chrome.storage) {
    const newCategories = categories.filter((category) => category.id !== id);
    chrome.storage.sync.set(
      {
        "categories": JSON.stringify(newCategories),
      },
      callback
    );
  }
};

export const updateWebCategory = (categories, data, callback) => {
  if (chrome && chrome.storage) {
    let newCategories = categories.filter(
      (category) => category.id !== data.id
    );
    chrome.storage.sync.set(
      { "categories": JSON.stringify(newCategories) },
      function () {
        newCategories = [...newCategories, data];
        chrome.storage.sync.set(
          { "categories": JSON.stringify(newCategories) },
          callback
        );
      }
    );
  }
};

export const saveSettings = ({ showTwitch, twitchUser, setShowTwitch, setTwitchUser }) => {
  if(chrome && chrome.storage){
    chrome.storage.sync.set(
      {
        "showTwitch": showTwitch,
        "twitchUser": twitchUser,
      },
      function () {
        getSettings({setShowTwitch, setTwitchUser});
      }
    );
  }
};

export const getSettings = ({setShowTwitch, setTwitchUser}) => {
  if (chrome && chrome.storage) {
    chrome.storage.sync.get(
      ["showTwitch", "twitchUser"],
      function (items) {
        setShowTwitch(items.showTwitch);
        setTwitchUser(items.twitchUser);
      }
    );
  }
};

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
  }else{
    callback(null);
  }
};

export const setAuthUser = (authUser) => {
  if(chrome && chrome.storage){
    chrome.storage.sync.set({"authUser": authUser}, function () {});
  }
};