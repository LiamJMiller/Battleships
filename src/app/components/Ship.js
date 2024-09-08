/** @format */

import React from "react";

const Ship = ({ ship, orientation, onDragStart }) => {
  const shipStyle = {
    display: "inline-block",
    width: orientation === "horizontal" ? `${ship.size * 30}px` : "30px",
    height: orientation === "horizontal" ? "30px" : `${ship.size * 30}px`,
    backgroundColor: "gray",
    cursor: "grab",
  };

  return (
    <div draggable onDragStart={(e) => onDragStart(e, ship)} style={shipStyle}>
      {ship.name}
    </div>
  );
};

export default Ship;
