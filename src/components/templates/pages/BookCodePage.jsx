import React, { useEffect, useState } from "react";
import Table from "../../modules/Table";
import {
  newComments,
  changeStatusComment,
  getBookCodes,
} from "../../../utils/services";
import dayjs from "dayjs";
import { FaCheck } from "react-icons/fa6";
import { GoTrash } from "react-icons/go";
import ToolTip from "../../modules/Tooltip";
import toast from "react-hot-toast";
import ReusableModal from "../../modules/ReusableModal";
import { useParams } from "react-router-dom";

function BookCodePage() {
  const [data, setData] = useState({ data: [] });
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNumber: 1,
  });
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);

  const calculateRemainingDays = (codeItem) => {
    const purchaseDate = dayjs(codeItem.purchaseDate);
    console.log(purchaseDate);
    const today = dayjs();
    const passedDays = today.diff(purchaseDate, "day");
    const remaining = codeItem.expireDays - passedDays;
    return remaining > 0 ? remaining : 0;
  };

  const fetchBookCodes = async () => {
    try {
      setLoading(true);
      const BookCodes = await getBookCodes({
        ...pagination,
        bookId: id,
      });
      setData(BookCodes.codes);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching codes");
      setData({ data: [] });
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBookCodes();
  }, [pagination]);

  const handleModalOpen = (commentId, status) => {
    setSelectedComment({ id: commentId, status });
    setModalOpen(true);
  };

  const renderCommentRow = (item) => (
    <tr className="w-full h-15 text-nowrap transition-colors duration-400 border-t border-slate-300 overflow-x-hidden">
      <td className="pl-2">{item.code}</td>
      <td>{item.serialNo}</td>
      <td>{item.expireDays}</td>
      <td>{item.username}</td>
      <td>{dayjs(item.date).format("YYYY/MM/DD")}</td>
      <td className="flex p-3 gap-3">
        <div className="relative group">
          <div
            className="p-2 shadow-lg cursor-pointer rounded-lg transition-colors duration-400 bg-sea hover:bg-sea-hover text-white"
            onClick={() => handleModalOpen(item.commentId, true)}
          >
            <FaCheck />
          </div>
          <ToolTip id="check" content="Confirm" />
        </div>
        <div className="relative group">
          {calculateRemainingDays(item)}
          <ToolTip id="trash" content="Delete" />
        </div>
      </td>
    </tr>
  );

  const columns = [
    { key: "code", label: "Code" },
    { key: "serialNumber", label: "Serial Number" },
    { key: "expireDay", label: "Expires in" },
    { key: "userName", label: "User Name" },
    { key: "remaining", label: "Remaining" },
    { key: "icons", label: " " },
  ];

  return (
    <>
      <Table
        title="Book Codes"
        data={data.data}
        setData={setData}
        columns={columns}
        totalData={data.totalCount}
        setPagination={setPagination}
        pagination={pagination}
        loading={loading}
        setLoading={setLoading}
        renderRow={renderCommentRow}
      />

      {modalOpen && (
        <ReusableModal
          title="Confirmation"
          description={`Are you sure you want to ${
            selectedComment?.status ? "approve" : "reject"
          } this comment?`}
          onClose={() => setModalOpen(false)}
          onConfirm={confirmStatusChange}
          confirmText={selectedComment?.status ? "Approve" : "Delete"}
          cancelText="Cancel"
          loading={actionLoading}
        />
      )}
    </>
  );
}

export default BookCodePage;
