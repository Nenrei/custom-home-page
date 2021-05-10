import React from "react";
import "./website.scss";
import { MdClose, MdModeEdit, MdAdd, MdChevronLeft, MdChevronRight } from "react-icons/md";
import ClassNames from "classnames";

const Website = ({
  isAdd,
  websiteData,
  handleAdd,
  handleRemove,
  handleEdit,
  first,
  last,
  orderLeftWebSite,
  orderRightWebSite,
}) => {

  const websiteClass = ClassNames({
    "website": true,
    "website--first": first,
    "website--last": last,
  });

  return !isAdd ? (
    <div className={websiteClass}>
      <button
        className="website__btn website__btn--remove"
        title="Eliminar"
        onClick={(e) => {
          handleRemove(e, websiteData);
        }}
      >
        <MdClose />
      </button>
      <button
        className="website__btn website__btn--edit"
        title="Editar"
        onClick={(e) => {
          handleEdit(e, websiteData);
        }}
      >
        <MdModeEdit />
      </button>
      <a href={websiteData.url}>
        <img
          className="website__icon"
          src={
            websiteData.icon && websiteData.icon.length === 0
              ? `https://www.google.com/s2/favicons?domain=${websiteData.url}`
              : websiteData.icon
          }
          alt={websiteData.title}
        />
      </a>
      <span className="website__title">{websiteData.title}</span>
      <MdChevronLeft
        className="website__order-icon website__order-icon--left"
        onClick={(e) => {orderLeftWebSite(e, websiteData)}}
      />
      <MdChevronRight
        className="website__order-icon website__order-icon--right"
        onClick={(e) => {orderRightWebSite(e, websiteData)}}
      />
    </div>
  ) : (
    <div className="website" title="Nueva Web">
      <button className="website__btn-add" title="Añadir" onClick={handleAdd}>
        <MdAdd />
      </button>
    </div>
  );
};

export default Website;
