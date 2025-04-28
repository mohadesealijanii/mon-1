import React, { useEffect, useState } from "react";
import { getSearchSetting, updateSearchSetting } from "../../../utils/services";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { PropagateLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";

function SearchSettingPage() {
  const [data, setData] = useState({ data: [] });
  const [loading, setLoading] = useState(true);
  const [modifiedCategories, setModifiedCategories] = useState([]);

  const toggleShowIsFree = (bookCategoryId) => {
    setData((prevData) => {
      const updatedData = prevData.data.map((item) => {
        if (item.bookCategoryId === bookCategoryId) {
          return { ...item, showIsFree: !item.showIsFree };
        }
        return item;
      });
      return { ...prevData, data: updatedData };
    });

    // Track modified categories
    setModifiedCategories((prev) => [...prev, bookCategoryId]);
  };

  const toggleShowIsNotFree = (bookCategoryId) => {
    setData((prevData) => {
      const updatedData = prevData.data.map((item) => {
        if (item.bookCategoryId === bookCategoryId) {
          return { ...item, showIsNotFree: !item.showIsNotFree };
        }
        return item;
      });
      return { ...prevData, data: updatedData };
    });

    // Track modified categories
    setModifiedCategories((prev) => [...prev, bookCategoryId]);
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const result = await getSearchSetting();
      setData(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleChange = async () => {
    try {
      setLoading(true);
      const res = await updateSearchSetting(data.data);
      if (res.status === 200) {
        toast.success("Changes applied successfully!");
        setModifiedCategories([]);
      }
      console.log(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  const renderRow = (item) => (
    <>
      <tr className="h-13 border-b border-b-gray-200" key={item.bookCategoryId}>
        <td className="pl-11">{item.bookCategoryId}</td>
        <td className="pl-9">
          <button
            type="button"
            onClick={() => toggleShowIsFree(item.bookCategoryId)}
            className="text-2xl text-sea-hover cursor-pointer"
          >
            {item.showIsFree ? (
              <IoMdCheckmarkCircleOutline />
            ) : (
              <MdOutlineRadioButtonUnchecked />
            )}
          </button>
        </td>
        <td className="pl-11">
          <button
            type="button"
            onClick={() => toggleShowIsNotFree(item.bookCategoryId)}
            className="text-2xl text-sea-hover cursor-pointer"
          >
            {item.showIsNotFree ? (
              <IoMdCheckmarkCircleOutline />
            ) : (
              <MdOutlineRadioButtonUnchecked />
            )}
          </button>
        </td>
      </tr>
    </>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100 ">
        <PropagateLoader />
      </div>
    );
  }

  return (
    <div className="flex flex-col text-nowrap bg-white w-full gap-x-15 rounded-xl shadow-xl h-120 overflow-y-scroll">
      <table className="min-w-full table-auto">
        <thead className="sticky top-0 bg-slate-100 z-10">
          <tr>
            <th className="px-6 py-4 text-left">Category</th>
            <th className="px-6 py-4 text-left">Show Free</th>
            <th className="px-6 py-4 text-left">Show Not Free</th>
          </tr>
        </thead>
        <tbody>{data.data.map((item) => renderRow(item))}</tbody>
      </table>
      <button
        onClick={handleChange}
        className="sticky bottom-0 z-10 p-2 cursor-pointer bg-sea hover:bg-sea-hover duration-300 transition-colors text-white rounded"
      >
        {loading ? <PropagateLoader className="mt-3" /> : "Apply Changes"}
      </button>
      <Toaster />
    </div>
  );
}

export default SearchSettingPage;
