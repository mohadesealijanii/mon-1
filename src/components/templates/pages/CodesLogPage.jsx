import React, { useEffect, useState } from "react";
import Table from "../../modules/Table";
import { getLogConnectedCodes } from "../../../utils/services";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { BsInfoCircle } from "react-icons/bs";
import ToolTip from "../../modules/Tooltip";

function CodesLogPage() {
  const [advancedSearchLog, setAdvancedSearchLog] = useState(false);
  const [data, setData] = useState({ data: [] });
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sparkles, setSparkles] = useState([]);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNumber: 1,
  });

  const [searchInputs, setSearchInputs] = useState({
    expireDays: "",
    serialEnd: "",
    serialStart: "",
    userId: "",
    bookId: "",
  });

  const fetchLogConnectedCodes = async () => {
    try {
      setLoading(true);
      const codesLog = await getLogConnectedCodes(pagination);
      setData(codesLog || []);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching codes");
      setData({ data: [] });
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLogConnectedCodes();
  }, [pagination, refreshTrigger]);

  const renderAllCodesRow = (item) => {
    const tooltipId = `info-${item.serialStart}`;

    return (
      <tr className="w-full h-15 text-nowrap transition-colors duration-400 border-t border-slate-300 overflow-x-hidden">
        <td className="pl-2">{item.userId}</td>
        <td>{item.bookId}</td>
        <td className="pl-4">{item.serialStart}</td>
        <td className="pl-4">{item.serialEnd}</td>
        <td className="pl-4">{item.expireDays}</td>
        <td className="pl-4">{dayjs(item.date).format("YYYY/MM/DD HH:mm")}</td>
        <td data-tooltip-id={tooltipId}>
          <div className="bg-orange hover:bg-orange-600 transition-colors duration-300 cursor-pointer text-white p-2 rounded-md w-fit">
            <BsInfoCircle size={20} />
          </div>
        </td>
        <ToolTip id={tooltipId} content={item.message} />
      </tr>
    );
  };

  const generateSparkles = () => {
    const count = 80;
    const dots = Array.from({ length: count }).map((_, index) => ({
      id: Date.now() + index,
      transformEnd: `translate(${(Math.random() - 0.5) * 200}px, ${
        (Math.random() - 0.5) * 200
      }px)`,
    }));
    setSparkles(dots);
    setTimeout(() => setSparkles([]), 900);
  };

  const columns = [
    { key: "userId", label: "User Id" },
    { key: "bookId", label: "Book Id" },
    { key: "serialStart", label: "Serial Start" },
    { key: "serialEnd", label: "Serial End" },
    { key: "expireDays", label: "Expires In" },
    { key: "date", label: "Date" },
    { key: "info", label: "Info" },
  ];

  const filters = () => (
    <div className="flex gap-2 flex-row mt-3 justify-end w-full">
      <button
        onClick={() => setAdvancedSearchLog((prev) => !prev)}
        onMouseEnter={generateSparkles}
        className="bg-sea hover:bg-sea-hover cursor-pointer transition-colors duration-300 px-4 rounded-md text-nowrap text-white h-11 z-6 overflow-visible"
      >
        Advanced Search
      </button>

      <div className="sparkle-container">
        {sparkles.map((sparkle) => (
          <span
            key={sparkle.id}
            className="sparkle-dot"
            style={{
              top: "50%",
              left: "50%",
              "--transform-end": sparkle.transformEnd,
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Table
        title="Connected Codes Log"
        data={data.data || []}
        setData={setData}
        columns={columns}
        totalData={data.totalCount}
        setPagination={setPagination}
        pagination={pagination}
        loading={loading}
        setLoading={setLoading}
        renderRow={renderAllCodesRow}
        advancedSearchLog={advancedSearchLog}
        setAdvancedSearchLog={setAdvancedSearchLog}
        addButton={filters()}
        searchInputs={searchInputs}
        setSearchInputs={setSearchInputs}
      />
    </>
  );
}

export default CodesLogPage;
