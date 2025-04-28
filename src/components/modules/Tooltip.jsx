import React from "react";
import { Tooltip } from "react-tooltip";

function ToolTip({ id, content }) {
  return (
    <Tooltip
      id={id}
      place="top"
      content={content}
      opacity={1}
      style={{
        maxWidth: "300px",
        overflowWrap: "break-word",
        whiteSpace: "normal",
        zIndex: 50,
        backgroundColor: "#023047",
        color: "white",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        padding: "8px 12px",
        fontSize: "0.875rem",
        transition: "opacity 300ms ease-in-out, transform 300ms ease-in-out",
        transform: "scale(0.95)",
      }}
    />
  );
}

export default ToolTip;
