// src/components/CardItem/CardItem.js
import React from "react";
import "./CardItem.css";

const CardItem = ({ thumbnail, name, description, link, isArticle }) => {
  return (
    <div className="card-item">
      <img src={thumbnail} alt={`${name} thumbnail`} className="thumbnail" />
      <div className="card-details">
        <h4 className="card-name">{name}</h4>
        <p className="card-description">{description}</p>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="card-link"
        >
          {isArticle ? "Read Article" : "View Project"}
        </a>
      </div>
    </div>
  );
};

export default CardItem;
