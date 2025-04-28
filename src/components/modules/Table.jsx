import React, { useEffect, useRef, useState } from "react";
import { PropagateLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";
import RowDropdown from "./RowDropdown";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import IsFree from "./books-list/IsFree";
import MultiFilter from "./books-list/MultiFilter";
import AdvancedRow from "./allCodes/AdvancedRow";
import AdvancedLogRow from "./codesLogs/AdvancedLogRow";
import AdvancedRepeatRow from "./repeatedCodes/AdvancedRepeatRow";
import AdvancedEntityLogsRow from "./logs/AdvancedEntityLogsRow";

function Table({
  data,
  columns,
  title,
  pagination,
  setPagination,
  totalData,
  loading,
  customHeaderContent,
  renderRow,
  searchRow,
  addButton,
  helpButton,
  advancedSearchCode,
  setAdvancedSearchCode,
  setSearchInputs,
  searchInputs,
  setAdvancedSearchLog,
  advancedSearchLog,
  advancedRepeat,
  setAdvancedRepeat,
  advancedLog,
  setAdvancedLog,
}) {
  const totPages = Math.ceil(totalData / pagination.pageSize);
  const thisPage = pagination.pageNumber;
  const [dropdown, setDropdown] = useState(false);
  const [jumpInput, setJumpInput] = useState("");
  const dropdownRef = useRef(null);

  const handlePageChange = (event, value) => {
    setPagination({ ...pagination, pageNumber: value });
  };

  const jumpHandler = (e) => {
    const input = e.target.value;
    setJumpInput(input);
    let targetPage = +input;
    if (!input || targetPage < 1 || targetPage > totPages) {
      toast.error(`Page must be between 1 to ${totPages}`);
      targetPage = 1;
    }
    setPagination({ ...pagination, pageNumber: targetPage });
  };

  const handleRowsChange = (newRows) => {
    setPagination({
      ...pagination,
      pageSize: newRows,
      pageNumber: 1,
    });
    setDropdown(false);
  };

  const dropdownHandler = () => setDropdown((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex justify-center overflow-y-scroll overflow-x-scroll">
      <div className="w-full pb-10 max-h-fit rounded-b-2xl">
        <div className="flex flex-col h-fit min-h-fit text-slate-700 bg-white shadow-md rounded-xl">
          {/* Header */}
          <div className="flex justify-between mx-4 mt-4 text-slate-700 rounded-none">
            <div className="flex">
              <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
            </div>
            <div className="flex">
              {helpButton}
              {addButton}
            </div>
          </div>

          {/* Custom Header Content */}
          {customHeaderContent && (
            <div className="mb-5 max-w-full flex">{customHeaderContent}</div>
          )}

          {/* Search / Advanced Search */}
          <div className="pt-5 w-full">
            {(advancedSearchCode ||
              advancedSearchLog ||
              searchRow ||
              advancedLog ||
              advancedRepeat) && (
              <table className="w-full ">
                <thead>
                  {advancedRepeat && (
                    <tr>
                      <td colSpan={9} className="z-50 shadow-lg">
                        <AdvancedRepeatRow
                          searchInputs={searchInputs}
                          setSearchInputs={setSearchInputs}
                          pagination={pagination}
                          setPagination={setPagination}
                          setAdvancedRepeat={setAdvancedRepeat}
                        />
                      </td>
                    </tr>
                  )}
                  {advancedLog && (
                    <tr>
                      <td colSpan={9} className="z-50 shadow-lg">
                        <AdvancedEntityLogsRow
                          searchInputs={searchInputs}
                          setSearchInputs={setSearchInputs}
                          pagination={pagination}
                          setPagination={setPagination}
                          setAdvancedLog={setAdvancedLog}
                        />
                      </td>
                    </tr>
                  )}
                  {advancedSearchCode && (
                    <tr>
                      <td colSpan={9} className="z-50 shadow-lg">
                        <AdvancedRow
                          searchInputs={searchInputs}
                          setSearchInputs={setSearchInputs}
                          pagination={pagination}
                          setPagination={setPagination}
                          setAdvancedSearchCode={setAdvancedSearchCode}
                        />
                      </td>
                    </tr>
                  )}
                  {advancedSearchLog && (
                    <tr>
                      <td colSpan={9} className="z-50 shadow-lg">
                        <AdvancedLogRow
                          setAdvancedSearchLog={setAdvancedSearchLog}
                          searchInputs={searchInputs}
                          setSearchInputs={setSearchInputs}
                          pagination={pagination}
                          setPagination={setPagination}
                        />
                      </td>
                    </tr>
                  )}
                  {searchRow && (
                    <tr>
                      <td colSpan={9} className="z-50 shadow-lg">
                        {/* Simple Search Inputs */}
                        <div className="flex mt-1 gap-3 rounded-md m-2">
                          {["title", "authors", "tags"].map((field, idx) => (
                            <div key={idx} className="relative flex-1 gap-3">
                              <input
                                name={field}
                                value={pagination[field] || ""}
                                placeholder=" "
                                onChange={(e) => {
                                  const { name, value } = e.target;
                                  setPagination((prev) => ({
                                    ...prev,
                                    [name]: value,
                                  }));
                                }}
                                className="peer w-full border border-grey/30 rounded-md pl-3 pr-3 pt-5 pb-1 text-sm
                                focus:outline-none focus:border-sea focus:ring-1 focus:ring-sea 
                                hover:border-sea transition-all"
                              />
                              <label
                                className="absolute left-3 top-[0.5px] text-gray-500 text-xs transition-all duration-300 
                                peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm 
                                peer-placeholder-shown:text-gray-400
                                peer-focus:top-[-0.5rem] peer-focus:text-xs peer-focus:text-sea bg-white px-1 pointer-events-none"
                              >
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                              </label>
                            </div>
                          ))}
                          <div className="">
                            <MultiFilter setPagination={setPagination} />
                          </div>
                        </div>

                        <div className="w-full mt-5 flex">
                          <button
                            onClick={() =>
                              setPagination((prev) => ({
                                ...prev,
                                pageNumber: 1,
                              }))
                            }
                            className="w-full ml-2 py-1.5 text-sm bg-sea text-white rounded-md hover:bg-blue-700 transition-all"
                          >
                            Search
                          </button>
                          <IsFree
                            setPagination={setPagination}
                            pagination={pagination}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </thead>
              </table>
            )}
          </div>

          {/* Table Content */}
          <div className="p-0 w-full">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <PropagateLoader size={20} color="#023047" />
              </div>
            ) : (
              <div className="max-h-[500px] overflow-y-auto w-full">
                <table className="w-full">
                  <thead>
                    <tr className="top-0 sticky h-15 bg-slate-100 z-2">
                      {columns.map((col, idx) => (
                        <th key={idx} className="p-2 text-left">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((item) => (
                        <React.Fragment key={item.id}>
                          {renderRow(item)}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length}>
                          <div className="flex flex-col justify-center items-center h-64">
                            <img
                              src="https://cdn-icons-png.flaticon.com/512/7486/7486809.png"
                              width="156"
                              height="156"
                              alt="Nothing Found"
                            />
                            <p className="text-lg text-gray-500">
                              Nothing Found!
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="text-nowrap bg-ocean/10 bg-op border-[1px] border-blue-950/15 rounded-b-2xl shadow-xl">
            <div className="flex items-center justify-between px-5 py-4">
              {/* Jump to Page Input */}
              <div className="hidden lg:flex items-center gap-2">
                <p className="text-sm text-slate-600">Jump to page:</p>
                <input
                  type="number"
                  value={jumpInput}
                  onChange={jumpHandler}
                  className="w-16 px-2 py-1 focus:outline-0 border-[1px] border-slate-300 rounded-md text-sm"
                  min={1}
                />
              </div>

              {/* Pagination UI */}
              <Stack spacing={2}>
                <Pagination
                  count={totPages}
                  page={thisPage}
                  siblingCount={1}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Stack>

              {/* Rows Dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={dropdownHandler}
                  className="text-sm text-slate-600 border px-3 py-1 rounded border-slate-300"
                >
                  Rows: {pagination.pageSize}
                </button>
                {dropdown && (
                  <div className="absolute bottom-0 left-0 z-5">
                    <RowDropdown onSelect={handleRowsChange} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}

export default Table;
