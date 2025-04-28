import React from "react";

function RowDropdown({ onSelect }) {
  return (
    <div className="text-black flex flex-col bg-white border border-sea shadow-xl rounded-md">
      <span
        onClick={() => onSelect(10)}
        className="px-3 py-1 cursor-pointer hover:bg-ocean/20 rounded-t-md"
      >
        10
      </span>
      <span
        onClick={() => onSelect(15)}
        className="px-3 py-1 cursor-pointer hover:bg-ocean/20"
      >
        15
      </span>
      <span
        onClick={() => onSelect(20)}
        className="px-3 py-1 cursor-pointer hover:bg-ocean/20 "
      >
        20
      </span>
      <span
        onClick={() => onSelect(30)}
        className="px-3 py-1 cursor-pointer hover:bg-ocean/20 "
      >
        30
      </span>
      <span
        onClick={() => onSelect(50)}
        className="px-3 py-1 cursor-pointer hover:bg-ocean/20 "
      >
        50
      </span>
    </div>
  );
}

export default RowDropdown;
