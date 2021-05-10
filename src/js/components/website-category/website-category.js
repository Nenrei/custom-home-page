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
import {
  addNewWebPage,
  updateWebPage,
  deleteWebPage,
} from "../../firebase/services";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import ClassNames from "classnames";

const WebsiteCategory = ({
  user,
  categoryData,
  handleEditCategory,
  first,
  last,
  orderUpCategory,
  orderDownCategory,
}) => {
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
    for (let webPage in webPages) {
      newStateWebPages.push({
        key: webPage,
        url: webPages[webPage].url,
        icon: webPages[webPage].icon,
        title: webPages[webPage].title,
        order: webPages[webPage].order,
      });
    }
    newStateWebPages.sort((a, b) => (a.order > b.order ? 1 : -1));
    setWebPages(newStateWebPages);
  }, [setWebPages, categoryData.webPages]);

  const categoryClass = ClassNames({
    "website-category-list__category": true,
    "website-category-list__category--first": first,
    "website-category-list__category--last": last,
  });

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
      newWebPageData.order = webPages[webPages.length - 1].order + 1;
      addNewWebPage(user.name, categoryData.key, newWebPageData).then(
        (result) => {
          handleClose(e);
        }
      );
    } else {
      updateWebPage(user.name, categoryData.key, newWebPageData).then(
        (result) => {
          handleClose(e);
        }
      );
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

  const orderLeftWebSite = (e, activeWeb) => {
    const pasiveWeb = webPages.filter(
      (category) => category.order === activeWeb.order - 1
    )[0];

    if (activeWeb && pasiveWeb) {
      pasiveWeb.order += 1;
      activeWeb.order -= 1;
      updateWebPage(user.name, categoryData.key, activeWeb);
      updateWebPage(user.name, categoryData.key, pasiveWeb);
    }
  };

  const orderRightWebSite = (e, activeWeb) => {
    const pasiveWeb = webPages.filter(
      (category) => category.order === activeWeb.order + 1
    )[0];

    if (activeWeb && pasiveWeb) {
      pasiveWeb.order -= 1;
      activeWeb.order += 1;
      updateWebPage(user.name, categoryData.key, activeWeb);
      updateWebPage(user.name, categoryData.key, pasiveWeb);
    }
  };

  return (
    <div className={categoryClass}>
      <div className="website-category-list__category__title">
        <div className="website-category-list__category__title__line"></div>
        <div
          className="website-category-list__category__title__text"
          onClick={(e) => {
            handleEditCategory(e, categoryData);
          }}
        >
          {categoryData.title}
        </div>
        <MdExpandLess
          className="website-category-list__category__title__icon website-category-list__category__title__icon--up"
          onClick={(e) => {
            orderUpCategory(e, categoryData);
          }}
        />
        <MdExpandMore
          className="website-category-list__category__title__icon website-category-list__category__title__icon--down"
          onClick={(e) => {
            orderDownCategory(e, categoryData);
          }}
        />
        <div className="website-category-list__category__title__line"></div>
      </div>

      <div className="website-category-list__category__content">
        {webPages &&
          webPages.map((web, index) => (
            <Website
              key={web.key}
              websiteData={web}
              handleEdit={handleEdit}
              handleRemove={handleRemove}
              first={index === 0}
              last={index === webPages.length - 1}
              orderLeftWebSite={orderLeftWebSite}
              orderRightWebSite={orderRightWebSite}
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
              label="Nombre de la web"
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
              label="URL de la web"
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
              label="Icono de la web"
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
              Cancelar
            </Button>
            <Button type="submit" color="primary">
              {!newWebPageData.key ? "Añadir" : "Actualizar"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default WebsiteCategory;
