import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import InputField from "../InputField";
import toast from "react-hot-toast";
import { getAllBooks, getCodesReserve } from "../../../utils/services";
import Table from "../Table";
import SearchAny from "../books-list/SearchAny";

const ConnectCodeModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({});
  const [selectedBook, setSelectedBook] = useState({
    title: "",
    id: "",
  });
  const [loading, setLoading] = useState(true);
  const [searchRow, setSearchRow] = useState(false);
  const [anyValue, setAnyValue] = useState("");
  const [table, setTable] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [booksList, setBooksList] = useState([]);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNumber: 1,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAny = () => {
    if (!anyValue.trim()) return;

    setPagination((prev) => {
      if (prev.text !== anyValue.trim()) {
        return {
          ...prev,
          pageNumber: 1,
          text: anyValue.trim(),
        };
      }
      return prev;
    });
    setIsSearchMode(true);
  };

  useEffect(() => {
    async function fetchBooks() {
      console.log(pagination, isSearchMode, refreshTrigger);
      try {
        setLoading(true);
        let bookResponse;
        if (isSearchMode && pagination.text) {
          bookResponse = await getBooksAny(pagination);
          console.log("searchany");
        } else {
          bookResponse = await getAllBooks({ pagination });
          console.log("defaultsearch");
        }
        setData(bookResponse || { data: [] });
      } catch (error) {
        console.log(error);
        toast.error("Error fetching books");
        setData({ data: [] });
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, [pagination, isSearchMode, refreshTrigger]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!serialStart.length !== 10 || !serialEnd.length !== 10) {
    //   toast.error("Length of the serial must be included 10 numbers!");
    //   return;
    // }
    if (!selectedBook) {
      toast.error("Please select a book!");
      return;
    }
    if (!expireDays) {
      toast.error("Please specify the expiration!");
      return;
    }

    try {
      console.log(formData);
      const res = await getCodesReserve(formData);
      if (res.status === 200) {
        onclose();
        toast.success("Codes connected successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
      onclose();
    }
  };

  if (!isOpen) return null;
  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
  ];

  const renderBookRow = (item) => (
    <tr
      className="w-full hover:bg-ocean/6 transition-colors duration-400 border-t border-slate-300 overflow-x-scroll cursor-pointer text-nowrap"
      onClick={() => {
        setSelectedBook({ id: item.id, title: item.title });
        setFormData((prev) => ({ ...prev, bookId: item.id }));
        setTable(false);
      }}
    >
      <td className="sm:pl-4 lg:pl-4 md:pl-4 border-slate-300">{item.id}</td>
      <td className="flex p-4 border-slate-300">{item.title}</td>
    </tr>
  );

  const filters = (
    <div className="justify-between w-full">
      <div className="block">
        <SearchAny
          setPagination={setPagination}
          pagination={pagination}
          setLoading={setLoading}
          setSearchRow={setSearchRow}
          handleAny={handleAny}
          anyValue={anyValue}
          setAnyValue={setAnyValue}
          isSearchMode={isSearchMode}
          setIsSearchMode={setIsSearchMode}
        />
      </div>
    </div>
  );
  return (
    <div className="flex justify-center items-center fixed bg-black/60 inset-0 z-7">
      <div className="relative bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4 text-sea">
          Connect Code
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Serial Start & Serial End */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <InputField
                id="serialStart"
                label="Serial Start"
                value={formData.serialStart}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-1/2">
              <InputField
                id="serialEnd"
                label="Serial End"
                value={formData.serialEnd}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Row 2: Book ID & Expire Days */}
          <div className="flex gap-4">
            <div className="w-1/2" onClick={() => setTable((prev) => !prev)}>
              <InputField
                id="bookId"
                label="Book"
                value={formData.bookId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-1/2">
              <InputField
                id="expireDays"
                label="Expire Days"
                value={formData.expireDays}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              type="submit"
              className="text-white cursor-pointer  w-full bg-sun p-2 h-10 rounded-md hover:bg-orange transition-colors duration-300"
            >
              Create
            </button>
          </div>
        </form>

        <button
          onClick={onClose}
          className="absolute cursor-pointer top-2 right-3 text-gray-600 hover:text-gray-800"
        >
          <FaTimes size={18} />
        </button>
      </div>
      <div className="absolute lg:w-5/12 sm:w-full h-10 top-30">
        {table && (
          <Table
            data={data.data}
            setData={setData}
            columns={columns}
            totalData={data.totalCount}
            setPagination={setPagination}
            pagination={pagination}
            loading={loading}
            customHeaderContent={filters}
            setLoading={setLoading}
            renderRow={renderBookRow}
          />
        )}
      </div>
    </div>
  );
};

export default ConnectCodeModal;
