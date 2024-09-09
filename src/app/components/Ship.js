/** @format */

import React from "react";

const Ship = ({ ship, orientation, onDragStart }) => {
  const shipStyle = {
    display: "inline-block",
    width: orientation === "horizontal" ? `${ship.size * 30}px` : "30px",
    height: orientation === "horizontal" ? "30px" : `${ship.size * 30}px`,
    backgroundColor: "gray",
    cursor: "grab",
    margin: "5px", // Add margin to create space between ships
    position: "relative", // Ensure the text is positioned correctly
  };

  const textStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform:
      orientation === "horizontal"
        ? "translate(-50%, -50%)"
        : "translate(-50%, -50%) rotate(90deg)",
    whiteSpace: "nowrap", // Prevent text from wrapping
  };

  return (
    <div draggable onDragStart={(e) => onDragStart(e, ship)} style={shipStyle}>
      <div style={textStyle}>{ship.name}</div>
    </div>
  );
};

export default Ship;
