/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import {
  getWebCategories,
  addWebCategory,
  removeWebCategory,
  updateWebCategory,
} from "../../chromestorage/services";
import "./categories-list.scss";
import {
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Button,
} from "@material-ui/core";
import WebsiteCategory from "../website-category/website-category";
import { MdAdd } from "react-icons/md";

const CategoriesList = () => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategoryData, setNewCategoryData] = useState({
    title: ""
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

  const handleClose = (e) => {
    e.preventDefault();
    setDialogOpened(!dialogOpened);
    setNewCategoryData({
      title: ""
    });
  };

  const handleRemove = (e) => {
    e.preventDefault();

    removeWebCategory(categories, newCategoryData.id, getCategories);
  };

  const handleAdd = (e) => {
    e.preventDefault();

    if (!newCategoryData.id) {
      const data = {
        title: newCategoryData.title,
        id: `cat-${new Date().getTime()}`,
      };
      addWebCategory(categories, data, getCategories);
    } else {
      updateWebCategory(categories, newCategoryData, getCategories);
    }
  };

  const getCategoriesCallback = (storedCategories) => {
    setCategories(storedCategories);
    setNewCategoryData({
      title: ""
    });
  };

  const getCategories = () => {
    setDialogOpened(false);
    getWebCategories(getCategoriesCallback);
  };

  return (
    <div className="websites-list">
      <h2>My Websites</h2>
      <div className="website-category-list">
        {categories.map((category) => (
          <WebsiteCategory
            key={category.id}
            categoryData={category}
            handleEditCategory={handleEdit}
          />
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

            {newCategoryData.id && (
              <>
                <Button type="submit" color="primary">
                  Update
                </Button>
                <Button onClick={handleRemove} color="primary">
                  Remove
                </Button>
              </>
            )}

            {!newCategoryData.id && (
              <Button type="submit" color="primary">
                Add
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default CategoriesList;
