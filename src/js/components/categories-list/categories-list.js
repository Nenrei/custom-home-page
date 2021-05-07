/* eslint-disable no-undef */
import React, { useState, useContext } from "react";
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
import HomePageSettings from "../config/context";
import ClassNames from "classnames";
import UserContext from "../../context/UserContext";
import { addNewCategory, updateCategory, deleteCategory } from "../../firebase/services" 

const CategoriesList = ({categories}) => {
  const {
    state: { isTwitchCollapsed, showTwitch },
  } = useContext(HomePageSettings);

  const [dialogOpened, setDialogOpened] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({
    title: "",
  });

  const categoryListClasses = ClassNames({
    "websites-list": true,
    "websites-list--extended": !showTwitch || (showTwitch && isTwitchCollapsed),
  });

  const { state: { user } } = useContext(UserContext);

  const handleClose = (e) => {
    e.preventDefault();
    setDialogOpened(!dialogOpened);
    setNewCategoryData({
      title: "",
      webPages: []
    });
  };
  
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
    deleteCategory(user.name, newCategoryData).then(result => { handleClose(e); });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCategoryData.key) {
      addNewCategory(user.name, newCategoryData).then(result => { handleClose(e); });
    } else {
      updateCategory(user.name, newCategoryData).then(result => { handleClose(e); });
    }
  };

  return (
    <div className={categoryListClasses}>
      <h2>Mis Webs</h2>
      <div className="website-category-list">
        {categories.map((category) => (
          <WebsiteCategory
            user={user}
            key={category.key}
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
              label="Nombre del Grupo"
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
              Cancelar
            </Button>

            {newCategoryData.key && (
              <>
                <Button type="submit" color="primary">
                  Actualizar
                </Button>
                <Button onClick={handleRemove} color="primary">
                  Eliminar
                </Button>
              </>
            )}

            {!newCategoryData.key && (
              <Button type="submit" color="primary">
                Añadir
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default CategoriesList;
