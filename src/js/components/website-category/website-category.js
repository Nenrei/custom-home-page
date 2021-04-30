import React, { useState, useEffect } from "react";
import Website from "../website/website";
import "./website-category.scss";
import {
  getWebPages,
  addWebPage,
  removeWebPage,
  updateWebPage,
} from "../../chromestorage/services";
import {
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Button,
} from "@material-ui/core";

const WebsiteCategory = ({ categoryData, handleEditCategory }) => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [webPages, setWebPages] = useState([]);
  const [newWebPageData, setNewWebPageData] = useState({
    url: "",
    icon: "",
    title: "",
  });

  useEffect(() => {
    getWebsites();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleRemove = (e, id) => {
    e.preventDefault();

    removeWebPage(id, getWebsites);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const data = {
      categoryId: categoryData.id,
      url: newWebPageData.url,
      icon: newWebPageData.icon,
      title: newWebPageData.title,
    };
    
    if (!newWebPageData.id) {
      data.id =`site-${(new Date()).getTime()}`;
      // eslint-disable-next-line no-undef
      if (chrome && chrome.storage) {
        addWebPage(data, getWebsites);
      }else{
        setWebPages([...webPages, data]);
        handleClose(e);
      }
    } else {
      updateWebPage(newWebPageData, getWebsites);
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

  const getWebsitesCallback = (storedSites) => {
    setWebPages(storedSites);
    setNewWebPageData({
      url: "",
      icon: "",
      title: "",
      id: "",
    });
  }

  const getWebsites = () => {
    setDialogOpened(false);

    getWebPages(categoryData.id, getWebsitesCallback);
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
              key={web.id}
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
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {!newWebPageData.id ? "Add" : "Update"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default WebsiteCategory;
