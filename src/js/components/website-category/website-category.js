import React, { useState, useEffect } from "react";
import Website from "../website/website";
import "./website-category.scss";
import {
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Button,
} from "@material-ui/core";
import { addNewWebPage, updateWebPage, deleteWebPage } from "../../firebase/services" 

const WebsiteCategory = ({ user, categoryData, handleEditCategory }) => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [webPages, setWebPages] = useState([]);
  const [newWebPageData, setNewWebPageData] = useState({
    url: "",
    icon: "",
    title: "",
  });

  useEffect(() => {
      const webPages = categoryData.webPages;
      const newStateWebPages = [];
      for(let webPage in webPages){
        newStateWebPages.push({
          key: webPage,
          url: webPages[webPage].url,
          icon: webPages[webPage].icon,
          title: webPages[webPage].title,
        });
      }
      setWebPages(newStateWebPages);
  }, [setWebPages, categoryData.webPages]);

  const handleChange = (e) => {
    setNewWebPageData({
      ...newWebPageData,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const handleEdit = (e, data) => {
    e.preventDefault();
    setNewWebPageData(data);
    setDialogOpened(true);
  };

  const handleRemove = (e, webPageData) => {
    e.preventDefault();
    deleteWebPage(user.name, categoryData.key, webPageData);
  };

  const handleAdd = (e) => {
    e.preventDefault();    
    if (!newWebPageData.key) {
      addNewWebPage(user.name, categoryData.key, newWebPageData).then(result => { handleClose(e); });
    } else {
      updateWebPage(user.name, categoryData.key, newWebPageData).then(result => { handleClose(e); });
    }
  };

  const handleClose = (e) => {
    e.preventDefault();
    setDialogOpened(!dialogOpened);
    setNewWebPageData({
      url: "",
      icon: "",
      title: "",
    });
  };

  return (
    <div className="website-category-list__category">
      <div className="website-category-list__category__title">
        <div className="website-category-list__category__title__line"></div>
        <div className="website-category-list__category__title__text" onClick={(e) => {handleEditCategory(e, categoryData)}}>
          {categoryData.title}
        </div>
        <div className="website-category-list__category__title__line"></div>
      </div>

      <div className="website-category-list__category__content">
        {webPages &&
          webPages.map((web) => (
            <Website
              key={web.key}
              websiteData={web}
              handleEdit={handleEdit}
              handleRemove={handleRemove}
            />
          ))}
        <Website isAdd={true} handleAdd={handleClose} />
      </div>

      <Dialog
        open={dialogOpened}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={handleAdd} autoComplete="off">
          <DialogContent>
            <TextField
              margin="dense"
              name="title"
              label="Website Name"
              type="text"
              variant="outlined"
              value={newWebPageData.title}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              name="url"
              label="Website Url"
              type="text"
              variant="outlined"
              value={newWebPageData.url}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              name="icon"
              label="Icon Url"
              type="text"
              variant="outlined"
              value={newWebPageData.icon}
              onChange={handleChange}
              fullWidth
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {!newWebPageData.key ? "Add" : "Update"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default WebsiteCategory;
