import React from "react";
import "./website.scss";
import { MdClose, MdModeEdit, MdAdd } from "react-icons/md";

const Website = ({
  isAdd,
  websiteData,
  handleAdd,
  handleRemove,
  handleEdit,
}) => {
  return !isAdd ? (
    <div className="website" title={websiteData.title}>
      <button
        className="website__btn website__btn--remove"
        title="Remove"
        onClick={(e) => {
          handleRemove(e, websiteData.key);
        }}
      >
        <MdClose />
      </button>
      <button
        className="website__btn website__btn--edit"
        title="Edit"
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
          alt=""
        />
      </a>
      <span className="website__title">{websiteData.title}</span>
    </div>
  ) : (
    <div className="website" title="New Website">
      <button className="website__btn-add" title="Add" onClick={handleAdd}>
        <MdAdd />
      </button>
    </div>
  );
};

export default Website;
