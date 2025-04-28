import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
function AdvancedRow({
  setAdvancedSearchCode,
  setPagination,
  searchInputs,
  setSearchInputs,
}) {
  const options = [
    { name: "all", code: "all" },
    { name: "Used codes", code: "used" },
    { name: "Unused Codes", code: "unused" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setPagination((prev) => ({
      ...prev,
      ...searchInputs,
      pageNumber: 1,
    }));
  };

  return (
    <div className="relative lg:mx-56 bg-sea/10 shadow-md p-5 rounded-3xl">
      <button
        onClick={() => {
          setPagination((prev) => ({
            ...prev,
            code: "",
            isUsed: null,
            serialNo: "",
            pageNumber: 1,
          }));
          setSearchInputs((prev) => ({
            ...prev,
            code: "",
            serialNo: "",
            isUsed: null,
          }));
          setAdvancedSearchCode(false)
        }}
        className="right-3 top-2 absolute text-sea hover:text-blood cursor-pointer"
      >
        X
      </button>
      <div className="flex pr-3 gap-3 rounded-md m-2">
        <div className="relative flex-1 gap-3">
          <input
            name="code"
            value={searchInputs.code}
            onChange={handleChange}
            placeholder=" "
            className="peer w-full border border-grey/30 rounded-md pl-3 pr-3 pt-5 pb-1 text-sm
              focus:outline-none focus:border-sea focus:ring-1 focus:ring-sea 
              hover:border-sea transition-all"
          />
          <label
            className="absolute left-3 top-[0.5px] text-gray-500 text-xs transition-all duration-300 
              peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm 
              peer-placeholder-shown:text-gray-400
              peer-focus:top-[-1rem] peer-focus:text-xs peer-focus:text-sea bg-inherit px-1 pointer-events-none"
          >
            Code
          </label>
        </div>

        <div className="relative flex-1 gap-3">
          <input
            name="serialNo"
            value={searchInputs.serialNo}
            onChange={handleChange}
            placeholder=" "
            className="peer w-full border border-grey/30 rounded-md pl-3 pr-3 pt-5 pb-1 text-sm
              focus:outline-none focus:border-sea focus:ring-1 focus:ring-sea 
              hover:border-sea transition-all"
          />
          <label
            className="absolute left-3 top-[0.5px] text-gray-500 text-xs transition-all duration-300 
              peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm 
              peer-placeholder-shown:text-gray-400
              peer-focus:top-[-1rem] peer-focus:text-xs peer-focus:text-sea bg-inherit px-1 pointer-events-none"
          >
            Serial Number
          </label>
        </div>
      </div>

      <div className="w-full mt-5 pr-3 flex">
        <button
          onClick={handleSearch}
          className="w-full cursor-pointer ml-2 mr-2 py-1.5 text-sm bg-sea text-white rounded-md hover:bg-blue-700 transition-all"
        >
          Search
        </button>
        <div className="card mr-2 flex justify-content-center">
          <Dropdown
            value={
              searchInputs.isUsed === true
                ? "used"
                : searchInputs.isUsed === false
                ? "unused"
                : "all"
            }
            onChange={(e) => {
              const value = e.value;
              setSearchInputs((prev) => {
                const updated = { ...prev };
                if (value === "used") {
                  updated.isUsed = true;
                } else if (value === "unused") {
                  updated.isUsed = false;
                } else if (value === "all") {
                  updated.isUsed = null;
                }
                console.log(updated);
                return updated;
              });
            }}
            options={options}
            optionLabel="name"
            optionValue="code"
            placeholder="Code Status"
            className="w-48 md:w-14rem"
            selectedOption
          />
        </div>
      </div>
    </div>
  );
}

export default AdvancedRow;
