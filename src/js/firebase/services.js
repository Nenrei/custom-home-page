import firebase from "../../firebase";

export const getUserData = (username, setCategories, setTwitchUser, setShowTwitch) => {
  const userDataRef = firebase.database().ref(`${username}`);
  userDataRef.on("value", (snapshot) => {
    const categories = snapshot.val().categories;
    const newStateCategories = [];
    for(let category in categories){
      newStateCategories.push({
        key: category,
        title: categories[category].title,
        webPages: categories[category].webPages,
      });
    }
    setCategories(newStateCategories);

    const twitch = snapshot.val().twitch;
    if(twitch){
      if(twitch.user && twitch.user.length > 0){
        setTwitchUser(twitch.user);
      }
      if(twitch.showTwitch !== undefined){
        setShowTwitch(twitch.showTwitch);
      }
    }
  });
};

export const addNewWebPage = (username, categoryKey, webPage) => {
  var promise = new Promise( (resolve, reject) => {
    const webPageRef = firebase.database().ref(`${username}/categories/${categoryKey}/webPages`);
    delete webPage.key;
    webPageRef.push(webPage, (result) => {
      if(result === null){
        resolve(webPage);
      }else{
        reject(result);
      }
    });
   });
   return promise;
};

export const updateWebPage = (username, categoryKey, webPage) => {
  const categoryRef = firebase.database().ref(`${username}/categories/${categoryKey}/webPages/${webPage.key}`);
  return categoryRef.update({
    url: webPage.url,
    icon: webPage.icon,
    title: webPage.title
  });
};

export const deleteWebPage = (username, categoryKey, webPage) => {
  if(window.confirm("Delete this category?")) {
    const categoryRef = firebase.database().ref(`${username}/categories/${categoryKey}/webPages/${webPage.key}`);
    return categoryRef.remove();
  }
};

export const addNewCategory = (userName, category) => {
  var promise = new Promise( (resolve, reject) => {
    const categoriesRef = firebase.database().ref(`${userName}/categories`);
    delete category.key;
    categoriesRef.push(category, (result) => {
      if(result === null){
        resolve(category);
      }else{
        reject(result);
      }
    });
   });
   return promise;
};

export const updateCategory = (userName, category) => {
  const categoryRef = firebase.database().ref(`${userName}/categories/${category.key}`);
  return categoryRef.update({
    title: category.title
  });
};

export const deleteCategory = (userName, category) => {
  if(window.confirm("Delete this category?")) {
    const categoryRef = firebase.database().ref(`${userName}/categories/${category.key}`);
    return categoryRef.remove();
  }
};