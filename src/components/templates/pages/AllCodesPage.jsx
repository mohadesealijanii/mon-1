import React, { useEffect, useState } from "react";
import Table from "../../modules/Table";
import { getCodesReserve } from "../../../utils/services";
import { RiFileExcel2Fill } from "react-icons/ri";
import toast from "react-hot-toast";
import { FaCirclePlus } from "react-icons/fa6";
import GenerateCodeModal from "../../modules/allCodes/GenerateCodeModal";
import ConnectCodeModal from "../../modules/allCodes/ConnectCodeModal";
import GetExcelModal from "../../modules/allCodes/GetExcelModal";

function AllCodesPage() {
  const [data, setData] = useState({ data: [] });
  const [sparkles, setSparkles] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchRow, setSearchRow] = useState(false);
  const [modals, setModals] = useState({
    generateCode: false,
    connectCode: false,
    getExcel: false,
  });
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNumber: 1,
    code: "",
    serialNo: "",
    isUsed: null,
  });
  const [searchInputs, setSearchInputs] = useState({
    code: "",
    serialNo: "",
    isUsed: null,
  });

  const fetchAllCodes = async () => {
    try {
      setLoading(true);
      const BookCodes = await getCodesReserve(pagination);
      console.log(BookCodes);
      setData(BookCodes);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching codes");
      setData({ data: [] });
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllCodes();
  }, [pagination, refreshTrigger]);

  const renderAllCodesRow = (item) => (
    <tr className="w-full h-15 text-nowrap transition-colors duration-400 border-t border-slate-300 overflow-x-hidden">
      <td className="pl-2">{item.code}</td>
      <td>{item.serialNo}</td>
      <td className="pl-4">{item.isUsed ? <p>used</p> : <p>unused</p>}</td>
    </tr>
  );

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
    { key: "code", label: "Code" },
    { key: "serialNumber", label: "Serial Number" },
    { key: "status", label: "Status" },
  ];

  const filters = () => (
    <div className="flex gap-2 flex-row mt-3 mx-4 justify-end w-full">
      <div className="flex gap-1">
        <button
          onClick={() => setModals((prev) => ({ ...prev, getExcel: true }))}
          className="flex bg-green-700 hover:bg-green-900 cursor-pointer transition-colors duration-300 px-5 py-2 rounded-md text-nowrap text-white overflow-visible"
        >
          <RiFileExcel2Fill size={25} className="mr-3" />
          Get Excel
        </button>
      </div>
      <div className="group">
        <button
          onClick={() => setSearchRow((prev) => !prev)}
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
    </div>
  );

  const addButton = () => (
    <div className="flex gap-2">
      <button
        onClick={() => setModals((prev) => ({ ...prev, connectCode: true }))}
        className="bg-sun hover:bg-orange cursor-pointer transition-colors duration-300 px-5 py-2 rounded-md text-nowrap text-white overflow-visible"
      >
        Connect Code
      </button>
      <button
        onClick={() => setModals((prev) => ({ ...prev, generateCode: true }))}
        className="flex bg-sun hover:bg-orange cursor-pointer transition-colors duration-300 px-[5px] py-2 rounded-md text-nowrap text-white overflow-visible"
      >
        <FaCirclePlus size={25} className="mr-4" />
        Generate Code
      </button>
    </div>
  );
  return (
    <>
      {modals.connectCode && (
        <ConnectCodeModal
          pagination={pagination}
          isOpen={modals.connectCode}
          setRefreshTrigger={setRefreshTrigger}
          onClose={() => setModals((prev) => ({ ...prev, connectCode: false }))}
          onSubmit={(data) => {
            console.log("ConnectCode Data:", data);
          }}
        />
      )}

      {modals.getExcel && (
        <GetExcelModal
          isOpen={modals.getExcel}
          setRefreshTrigger={setRefreshTrigger}
          onClose={() => setModals((prev) => ({ ...prev, getExcel: false }))}
          onSubmit={(data) => {
            console.log("ConnectCode Data:", data);
          }}
        />
      )}
      {modals.generateCode && (
        <GenerateCodeModal
          setRefreshTrigger={setRefreshTrigger}
          isOpen={modals.generateCode}
          onClose={() =>
            setModals((prev) => ({ ...prev, generateCode: false }))
          }
          onSubmit={(count) => {
            console.log("Generate Count:", count);
          }}
        />
      )}
      <Table
        title="All Codes"
        addButton={addButton()}
        data={data.data}
        setData={setData}
        columns={columns}
        totalData={data.totalCount}
        setPagination={setPagination}
        pagination={pagination}
        loading={loading}
        setLoading={setLoading}
        renderRow={renderAllCodesRow}
        customHeaderContent={filters()}
        advancedSearchCode={searchRow}
        setAdvancedSearchCode={setSearchRow}
        setSearchInputs={setSearchInputs}
        searchInputs={searchInputs}
      />
    </>
  );
}

export default AllCodesPage;
