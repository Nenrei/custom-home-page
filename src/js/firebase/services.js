import firebase from "../../firebase";

export const signUp = (email, password, setError, fillUser) => {
  setError("");
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      signIn(email, password, setError, fillUser);
    })
    .catch((error) => {
      setError(error.message);
    });
};

export const signIn = (email, password, setError, fillUser) => {
  setError("");
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((response) => {
      fillUser(response);
    })
    .catch((error) => setError(error.message));
};

export const signOut = (cleanData) => {
  firebase
    .auth()
    .signOut()
    .then((response) => {
      cleanData();
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getUserData = (
  username,
  setCategories,
  setTwitchUser,
  setShowTwitch,
  setLoading
) => {
  const userDataRef = firebase.database().ref(`${username}`);
  userDataRef.on("value", (snapshot) => {
    const newStateCategories = [];
    if(snapshot.val()){
      const categories = snapshot.val().categories;
      for (let category in categories) {
        newStateCategories.push({
          key: category,
          title: categories[category].title,
          order: categories[category].order,
          webPages: categories[category].webPages,
        });
      }
      newStateCategories.sort((a, b) => (a.order > b.order) ? 1 : -1);
    }
    setCategories(newStateCategories);

    if(snapshot.val()){
      const twitch = snapshot.val().twitch;
      if (twitch) {
        if (twitch.user && twitch.user.length > 0) {
          setTwitchUser(twitch.user);
        }
        if (twitch.showTwitch !== undefined) {
          setShowTwitch(twitch.showTwitch);
        }
      }
    }
    setLoading(false);
  });
};

export const addNewWebPage = (username, categoryKey, webPage) => {
  var promise = new Promise((resolve, reject) => {
    const webPageRef = firebase
      .database()
      .ref(`${username}/categories/${categoryKey}/webPages`);
    delete webPage.key;
    webPageRef.push(webPage, (result) => {
      if (result === null) {
        resolve(webPage);
      } else {
        reject(result);
      }
    });
  });
  return promise;
};

export const updateWebPage = (username, categoryKey, webPage) => {
  const categoryRef = firebase
    .database()
    .ref(`${username}/categories/${categoryKey}/webPages/${webPage.key}`);
  return categoryRef.update({
    url: webPage.url,
    icon: webPage.icon,
    title: webPage.title,
    order: webPage.order,
  });
};

export const deleteWebPage = (username, categoryKey, webPage) => {
  if (window.confirm("¿Seguro que quieres eliminar esta web?")) {
    const categoryRef = firebase
      .database()
      .ref(`${username}/categories/${categoryKey}/webPages/${webPage.key}`);
    return categoryRef.remove();
  }
};

export const addNewCategory = (userName, category) => {
  var promise = new Promise((resolve, reject) => {
    const categoriesRef = firebase.database().ref(`${userName}/categories`);
    delete category.key;
    categoriesRef.push(category, (result) => {
      if (result === null) {
        resolve(category);
      } else {
        reject(result);
      }
    });
  });
  return promise;
};

export const updateCategory = (userName, category) => {
  const categoryRef = firebase
    .database()
    .ref(`${userName}/categories/${category.key}`);
  return categoryRef.update({
    title: category.title,
    order: category.order,
  });
};

export const deleteCategory = (userName, category) => {
  if (window.confirm("¿Seguro que quieres eliminar este grupo y todas sus webs?")) {
    const categoryRef = firebase
      .database()
      .ref(`${userName}/categories/${category.key}`);
    return categoryRef.remove();
  }
};

export const getTwitchData = (userName, setTwitchUser, setShowTwitch) => {
  const twitchRef = firebase.database().ref(`${userName}/twitch`);
  twitchRef.on("value", (snapshot) => {
    if(snapshot.val()){
      setTwitchUser(snapshot.val().user);
      setShowTwitch(snapshot.val().showTwitch);
    }
  });
};

export const setTwitchData = (userName, twitchUser, showTwitch) => {
  const twitchRef = firebase.database().ref(`${userName}/twitch`);
  twitchRef.set({
    user: twitchUser,
    showTwitch: showTwitch,
  });
};
