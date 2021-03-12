import React, { useState, useEffect } from "react";
import { getWebCategories, addWebCategory, removeWebCategory, updateWebCategory } from "../../firebase/services";
import "./categories-list.css";
import {
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Button,
} from "@material-ui/core";
import WebsiteCategory from "../website-category/website-category";
import { MdClose, MdModeEdit, MdAdd } from "react-icons/md";

const CategoriesList = () => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategoryData, setNewCategoryData] = useState({
    title: "",
    webSites: [],
  });

  useEffect(() => {
    getCategories();
  }, []);

  const handleChange = (e) => {
    setNewCategoryData({
      ...newCategoryData,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const handleEdit = (e, data) => {
    e.preventDefault();

    setNewCategoryData(data);
    setDialogOpened(true);
  };

  const handleRemove = (e) => {
    e.preventDefault();

    removeWebCategory(newCategoryData.id, getCategories);
  };

  const handleAdd = (e) => {
    e.preventDefault();

    const data = {
      title: newCategoryData.title,
      webSites: newCategoryData.webSites,
    };

    if (!newCategoryData.id) {
      data.webSites = [];
      addWebCategory(data, getCategories);
    } else {
      updateWebCategory(data, newCategoryData.id, getCategories);
    }
  };

  const handleClose = (e) => {
    e.preventDefault();
    setDialogOpened(!dialogOpened);
    setNewCategoryData({
      title: "",
      webSites: [],
    });
  };

  const getCategories = () => {
    setDialogOpened(false);
    getWebCategories().then((data) => {
      const fetchedData = [];
      for (let key in data) {
        const tempData = { id: key, title: data[key].title, webSites: [] };
        for (let webSiteKey in data[key].webSites) {
          tempData.webSites.push({ ...data[key].webSites[webSiteKey], id: webSiteKey });
        }
        fetchedData.push(tempData);
      }
      setCategories(fetchedData);
      setNewCategoryData({
        title: "",
        webSites: [],
      });
    });
  };

  return (
    <div className="websites-list">
      <h2>My Websites</h2>
      <div className="website-category-list">
        {categories.map((category) => (
          <WebsiteCategory key={category.id} categoryData={category} handleEditCategory={handleEdit}/>
        ))}
        <div className="website-category-list__category website-category-list__category--add">
          <div className="website-category-list__category__title">
            <div className="website-category-list__category__title__line"></div>
            <div
              className="website-category-list__category__title__text"
              onClick={handleClose}
            >
              <MdAdd />
            </div>
            <div className="website-category-list__category__title__line"></div>
          </div>

          <div className="website-category-list__category__content"></div>
        </div>
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
              label="Category Name"
              type="text"
              variant="outlined"
              value={newCategoryData.title}
              onChange={handleChange}
              fullWidth
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>

            {newCategoryData.id && <><Button type="submit" color="primary">Update</Button><Button onClick={handleRemove} color="primary">Remove</Button></>}
            
            {!newCategoryData.id && <Button type="submit" color="primary">Add</Button>}

          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default CategoriesList;
