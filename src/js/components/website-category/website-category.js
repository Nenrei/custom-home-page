import React, { useState, useEffect } from "react";
import Website from "../website/website";
import "./website-category.css";
import {
  getWebPages,
  addWebPage,
  removeWebPage,
  updateWebPage,
} from "../../firebase/services";
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
    setWebPages(categoryData.webSites);
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

    removeWebPage(id, categoryData.id, getWebsites);
  };

  const handleAdd = (e) => {
    e.preventDefault();

    const data = {
      url: newWebPageData.url,
      icon: newWebPageData.icon,
      title: newWebPageData.title,
    };

    if (!newWebPageData.id) {
      addWebPage(data, categoryData.id, getWebsites);
    } else {
      updateWebPage(data, newWebPageData.id, categoryData.id, getWebsites);
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

  const getWebsites = () => {
    setDialogOpened(false);
    getWebPages(categoryData.id).then((data) => {
      const fetchedData = [];
      for (let key in data) {
        fetchedData.push({ ...data[key], id: key });
      }
      setWebPages(fetchedData);
      setNewWebPageData({
        url: "",
        icon: "",
        title: "",
        id: "",
      });
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