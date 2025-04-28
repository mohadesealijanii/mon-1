import React, { useEffect, useState } from "react"
import Table from "../../modules/Table"
import { newComments, changeStatusComment } from "../../../utils/services"
import dayjs from "dayjs"
import { FaCheck } from "react-icons/fa6"
import { GoTrash } from "react-icons/go"
import ToolTip from "../../modules/Tooltip"
import toast from "react-hot-toast"
import ReusableModal from "../../modules/ReusableModal"

function CommentsPage() {
  const [data, setData] = useState({ data: [] })
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNumber: 1,
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedComment, setSelectedComment] = useState(null) // { id, status }
  const [actionLoading, setActionLoading] = useState(false)

  const fetchComments = async () => {
    try {
      setLoading(true)
      const comments = await newComments({ pagination })
      setData(comments)
      setLoading(false)
    } catch (error) {
      toast.error("Error fetching comments")
      setData({ data: [] })
      console.error(error)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [pagination])

  const handleModalOpen = (commentId, status) => {
    setSelectedComment({ id: commentId, status })
    setModalOpen(true)
  }

  const confirmStatusChange = async () => {
    const { id, status } = selectedComment
    try {
      setActionLoading(true)
      const res = await changeStatusComment({
        commentId: id,
        status: status,
      })
      if (res.status === 200) {
        toast.success(
          `Comment ${status ? "confirmed" : "deleted"} successfully`
        )
        setModalOpen(false)
        fetchComments()
      }
    } catch (error) {
      toast.error("Failed to update comment status")
      console.error(error)
    } finally {
      setActionLoading(false)
    }
  }

  const renderCommentRow = (item) => (
    <tr className="w-full h-15 text-nowrap transition-colors duration-400 border-t border-slate-300 overflow-x-hidden">
      <td className="pl-2">{item.titleBook}</td>
      <td>{item.userName}</td>
      <td>
        {item.firstName} {item.lastName}
      </td>
      <td>{item.comment}</td>
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
          <div
            className="p-2 shadow-lg cursor-pointer rounded-lg transition-colors duration-400 bg-blood/80 hover:bg-blood/100 text-white"
            onClick={() => handleModalOpen(item.commentId, false)}
          >
            <GoTrash />
          </div>
          <ToolTip id="trash" content="Delete" />
        </div>
      </td>
    </tr>
  )

  const columns = [
    { key: "book", label: "Book" },
    { key: "userName", label: "User Name" },
    { key: "fullName", label: "Full Name" },
    { key: "comment", label: "Comment" },
    { key: "data", label: "Date" },
    { key: "icons", label: " " },
  ]

  return (
    <>
      <Table
        title="Unapproved Comments"
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
  )
}

export default CommentsPage
