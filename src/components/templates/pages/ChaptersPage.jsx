import React, { useEffect, useState } from "react"
import Table from "../../modules/Table"
import {
  changeChapterOrder,
  deleteChapter,
  getChapters,
} from "../../../utils/services"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { IoDocumentOutline } from "react-icons/io5"
import { RxQuestionMark } from "react-icons/rx"
import { MdOutlineAudiotrack, MdOutlineSlowMotionVideo } from "react-icons/md"
import { BiSortAlt2 } from "react-icons/bi"
import { FiEdit } from "react-icons/fi"
import { GoTrash } from "react-icons/go"
import ToolTip from "../../modules/Tooltip"
import nopic from "../../../pics/nopic.png"
import { FaCirclePlus } from "react-icons/fa6"
import AddChapterModal from "../../modules/chapter/AddChapterModal"
import ReusableDeleteModal from "../../modules/ReusableDeleteModal"
import ReusableSortModal from "../../modules/ReusableSortModal"
import EditChapterModal from "../../modules/chapter/EditChapter"

function ChaptersPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageNumber: 1,
    bookId: id,
  })
  const [data, setData] = useState({ data: [] })
  const [loading, setLoading] = useState(true)
  const [expandedRowId, setExpandedRowId] = useState(null)
  const [addChapterModal, setAddChapterModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [selectedChapterId, setSelectedChapterId] = useState(null)
  const [editModal, setEditModal] = useState(false)
  const [sortModal, setSortModal] = useState(false)
  const [editingData, setEditingData] = useState("")

  const BASE_URL = "https://stg-core.bpapp.net/"
  const THUMB = "Content/Images/Book/Thumb/"

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageNumber: 1,
      bookId: id,
    }))
  }, [id])

  useEffect(() => {
    async function fetchChapters() {
      try {
        setLoading(true)
        setData({ data: [] })
        const chapterResponse = await getChapters({ pagination })
        setData(chapterResponse || { data: [] })
        console.log(chapterResponse)
      } catch (error) {
        console.log(error)
        toast.error("Error fetching chapters")
        setData({ data: [] })
      } finally {
        setLoading(false)
      }
    }

    fetchChapters()
  }, [pagination, refreshTrigger])

  const handleDelete = async () => {
    try {
      setLoading(true)
      const res = await deleteChapter(selectedChapterId)
      if (res.status === 200) {
        toast.success("Chapter successfully deleted")
        setRefreshTrigger((prev) => !prev)
        setDeleteModal(false)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = async (id, order) => {
    try {
      console.log(editingData)
      const res = await changeChapterOrder(id, order)
      if (res.status === 200) {
        toast.success("Done!")
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong!")
    }
  }

  const columns = [
    { key: "image", label: "Image" },
    { key: "version", label: "Version" },
    { key: "title", label: "Title" },
    { key: "order", label: "Order" },
    { key: "description", label: "Description" },
  ]

  const handleRowClick = (id) => {
    setExpandedRowId((prev) => (prev === id ? null : id))
  }

  const renderChapterRow = (item) => {
    const firstGroup = [
      {
        id: "document",
        icon: <IoDocumentOutline />,
        text: "See Documents",
        onClick: () => navigate("documents", { state: { chapterId: item.id } }),
      },
      {
        id: "question",
        icon: <RxQuestionMark />,
        text: "View Tests",
        onClick: () => navigate(`tests/${item.id}`),
      },
      {
        id: "video",
        icon: <MdOutlineSlowMotionVideo />,
        text: "Watch Video",
        onClick: () => navigate("videos", { state: { chapterId: item.id } }),
      },
      {
        id: "audio",
        icon: <MdOutlineAudiotrack />,
        text: "Listen Audio",
        onClick: () => navigate(`audios/${item.id}`),
      },
    ]

    const secondGroup = [
      {
        id: "sort",
        icon: <BiSortAlt2 />,
        text: "Sort",
        onClick: () => {
          setSortModal(true)
          setSelectedChapterId(item.id)
          setEditingData(item)
        },
      },
      {
        id: "edit",
        icon: <FiEdit />,
        text: "Edit Chapter",
        onClick: () => {
          setEditModal(true)
          setSelectedChapterId(item.id)
          setEditingData(item)
        },
      },
      {
        id: "delete",
        icon: <GoTrash />,
        text: "Delete Chapter",
        onClick: () => {
          setDeleteModal(true)
          setSelectedChapterId(item.id)
        },
        className: "bg-blood/80 text-white hover:bg-blood/100 hover:text-white",
      },
    ]

    return (
      <>
        <tr
          key={item.id}
          colSpan={columns.length}
          onClick={() => handleRowClick(item.id)}
          className={`${
            expandedRowId === item.id ? "bg-ocean/15" : ""
          } hover:bg-ocean/6 transition-colors duration-300 border-t border-slate-300 cursor-pointer`}
        >
          <td className="pl-2 pr-2 sm:pl-4 lg:pl-4 md:pl-4 border-slate-300">
            {
              <img
                src={`${BASE_URL}${THUMB}${item.imageName}`}
                alt=" "
                className="w-16 h-auto p-2 "
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = nopic
                }}
              />
            }
          </td>
          <td className="text-left pl-5">{item.version}</td>
          <td className="p-4 border-slate-300">{item.title}</td>
          <td className="p-4 border-slate-300">{item.order}</td>
          <td className="p-4 border-slate-300">{item.description}</td>
        </tr>

        {expandedRowId === item.id && (
          <tr key={`detail-${item.id}`} className="border-b border-slate-300">
            <td colSpan={5} className="p-4">
              <div className="flex justify-center gap-4 items-center">
                {[firstGroup, secondGroup].map((group, index) => (
                  <div key={index} className="flex gap-1 p-1 rounded-md">
                    {group.map(({ id, icon, text, onClick, className }) => (
                      <div
                        key={id}
                        data-tooltip-id={id}
                        className={`p-2 cursor-pointer shadow-md rounded-lg transition-colors duration-400 ${
                          className || "bg-sea hover:bg-sea-hover text-white"
                        }`}
                        onClick={onClick}
                      >
                        {icon}
                        <ToolTip id={id} content={text} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </td>
          </tr>
        )}
      </>
    )
  }

  const addButton = () => (
    <button
      onClick={() => setAddChapterModal((prev) => !prev)}
      className="flex bg-sun hover:bg-orange cursor-pointer transition-colors duration-300 px-[22px] py-2 rounded-md text-nowrap text-white relative overflow-visible"
    >
      <FaCirclePlus size={25} className="mr-4" />
      Add Chapter
    </button>
  )

  return (
    <div>
      {sortModal && (
        <ReusableSortModal
          title={editingData.title}
          setModal={setSortModal}
          initialOrder={editingData.order}
          setRefreshTrigger={setRefreshTrigger}
          actionHandler={(order) => handleSort(selectedChapterId, order)}
        />
      )}

      {editModal && (
        <EditChapterModal
          setRefreshTrigger={setRefreshTrigger}
          setEditModal={setEditModal}
          editingData={editingData}
        />
      )}

      {deleteModal && (
        <ReusableDeleteModal
          setModal={setDeleteModal}
          onConfirm={handleDelete}
          loading={loading}
          setLoading={setLoading}
          headerText='If you want to delete the selected chapter, please type "DELETE" below:'
          setRefreshTrigger={setRefreshTrigger}
        />
      )}

      {addChapterModal && (
        <AddChapterModal
          setAddChapterModal={setAddChapterModal}
          pagination={pagination}
          setRefreshTrigger={setRefreshTrigger}
          setPagination={setPagination}
          BookId={id}
        />
      )}
      {/* {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />} */}
      <Table
        title="chapters"
        addButton={addButton()}
        data={data.data}
        setData={setData}
        columns={columns}
        totalData={data.totalCount}
        setPagination={setPagination}
        pagination={pagination}
        loading={loading}
        setLoading={setLoading}
        renderRow={renderChapterRow}
      />
    </div>
  )
}

export default ChaptersPage
