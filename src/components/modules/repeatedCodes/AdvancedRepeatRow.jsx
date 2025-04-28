import React from "react";
function AdvancedRepeatRow({
  setAdvancedRepeat,
  setPagination,
  searchInputs,
  setSearchInputs,
}) {
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
    <div className="relative flex flex-col justify-center lg:mx-50 mb-5 bg-sea/10 shadow-md p-5 rounded-3xl">
      <button
        onClick={() => {
          setSearchInputs({
            serialNo: "",
            code: "",
          });
          setPagination((prev) => ({
            ...prev,
            pageNumber: 1,
            serialNo: "",
            code: "",
          }));
          setAdvancedRepeat(false);
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
      </div>
    </div>
  );
}

export default AdvancedRepeatRow;
