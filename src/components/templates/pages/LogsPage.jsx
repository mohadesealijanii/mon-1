import React, { useEffect, useState } from "react";
import Table from "../../modules/Table";
import { searchLog } from "../../../utils/services";
import toast from "react-hot-toast";
import { BsInfoCircle } from "react-icons/bs";
import ToolTip from "../../modules/Tooltip";
import EntityLogsModal from "../../modules/logs/EntityLogsModal";

function LogsPage() {
  const [advancedLog, setAdvancedLog] = useState(false);
  const [data, setData] = useState({ data: [] });
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sparkles, setSparkles] = useState([]);
  const [info, setInfo] = useState({
    modal: false,
    data: "",
  });
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNumber: 1,
  });

  const [searchInputs, setSearchInputs] = useState({
    ip: "",
    userName: "",
    entity: "",
    entityId: "",
    dateTime: "",
  });

  const getSearchLogs = async () => {
    try {
      setLoading(true);
      const searchLogResponse = await searchLog(pagination);
      setData(searchLogResponse || []);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching logs");
      setData({ data: [] });
      console.error(error);
    }
  };

  useEffect(() => {
    getSearchLogs();
  }, [pagination, refreshTrigger]);

  const renderLogsRow = (item) => {
    return (
      <tr className="w-full h-15 text-nowrap transition-colors duration-400 border-t border-slate-300 overflow-x-hidden">
        <td className="pl-2">{item.ip.split(" --- ")[0]}</td>
        <td className="pl-4">{item.userName}</td>
        <td className="pl-4">{item.entity}</td>
        <td className="pl-4">{item.entityId}</td>
        <td data-tooltip-id={item.entityId}>
          <div className="bg-orange hover:bg-orange-600 transition-colors duration-300 cursor-pointer text-white p-2 rounded-md w-fit">
            <BsInfoCircle
              size={20}
              onClick={() => {
                setInfo({ data: item, modal: true });
              }}
            />
          </div>
        </td>
        <ToolTip id={item.serialNo} content="More Info" />
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
    { key: "ip", label: "IP" },
    { key: "userName", label: "User Name" },
    { key: "section", label: "Section" },
    { key: "updatedSectionId", label: "updated Section Id" },
    { key: "info", label: "More Info" },
  ];

  const filters = () => (
    <div className="flex gap-2 flex-row mt-3 justify-end w-full">
      <div className="relative w-fit h-fit">
        {/* Sparkles behind button */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {sparkles.map((sparkle) => (
            <span
              key={sparkle.id}
              className="sparkle-dot absolute"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                "--transform-end": sparkle.transformEnd,
              }}
            />
          ))}
        </div>

        {/* Button */}
        <button
          onClick={() => setAdvancedLog((prev) => !prev)}
          onMouseEnter={generateSparkles}
          className="bg-sea hover:bg-sea-hover cursor-pointer transition-colors duration-300 px-4 rounded-md text-nowrap text-white h-11 z-10 relative"
        >
          Advanced Search
        </button>
      </div>
    </div>
  );

  return (
    <>
      {info.modal && (
        <EntityLogsModal
          info={info}
          onClose={() => setInfo((prev) => ({ ...prev, modal: false }))}
        />
      )}
      <Table
        title="Repeated Codes"
        data={data.data || []}
        setData={setData}
        columns={columns}
        totalData={data.totalCount}
        setPagination={setPagination}
        pagination={pagination}
        loading={loading}
        setLoading={setLoading}
        renderRow={renderLogsRow}
        advancedLog={advancedLog}
        setAdvancedLog={setAdvancedLog}
        addButton={filters()}
        searchInputs={searchInputs}
        setSearchInputs={setSearchInputs}
      />
    </>
  );
}

export default LogsPage;
