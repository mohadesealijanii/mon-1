import React, { useEffect, useState } from "react"
import { changeDocOrder, deleteAsset, getAssets } from "../../../utils/services"
import { useLocation, useNavigate } from "react-router-dom"
import Table from "../../modules/Table"
import { BiSortAlt2 } from "react-icons/bi"
import { FiEdit } from "react-icons/fi"
import { GoTrash } from "react-icons/go"
import { FaCirclePlus } from "react-icons/fa6"
import ReusableDeleteModal from "../../modules/ReusableDeleteModal"
import toast from "react-hot-toast"
import EditDocModal from "../../modules/chapter/documents/EditDocModal"
import ReusableSortModal from "../../modules/ReusableSortModal"
import ToolTip from "../../modules/Tooltip"
import nopic from "../../../pics/nopic.png"
import AddVideoModal from "../../modules/chapter/videos/AddVideoModal"
import EditVideoModal from "../../modules/chapter/videos/EditVideoModal"

function VideosPage() {
  const [data, setData] = useState({ data: [] })
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [editingData, setEditingData] = useState([])
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNumber: 1,
  })
  const [modals, setModals] = useState({
    add: false,
    delete: false,
    edit: false,
    sort: false,
    answer: false,
  })
  const [selectedVideo, setSelectedVideo] = useState({
    id: null,
    order: null,
    title: "",
  })
  const location = useLocation()
  const navigate = useNavigate()
  const chapterId = location.state?.chapterId
  const BASE_URL = "https://stg-core.bpapp.net/"
  const THUMB = "Content/Images/Book/Thumb/"

  const getVideos = async () => {
    try {
      setLoading(true)
      const videos = await getAssets({
        ...pagination,
        asset: 2,
        bookChapterId: chapterId,
      })
      console.log(videos)
      setData(videos)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    if (!chapterId) {
      navigate(-1)
      return
    }
    getVideos()
  }, [chapterId, refreshTrigger])

  const handleDelete = async () => {
    try {
      setLoading(true)
      const res = await deleteAsset(selectedVideo.id)
      if (res.status === 200) {
        toast.success("Document is successfully deleted!")
        setLoading(false)
        getVideos()
        setModals((prev) => ({ ...prev, delete: false }))
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast.error("Something went wrong!")
    }
  }

  const handleSort = async (id, order) => {
    try {
      const res = await changeDocOrder(id, order)
      if (res.status === 200) {
        getVideos()
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
    { key: "time", label: "Time" },
    { key: "order", label: "Order" },
    { key: "controls", label: "Controls" },
  ]

  const renderVideosRow = (item) => (
    <>
      <tr className="h-13">
        <td className="pl-3">
          <img
            src={`${BASE_URL}${THUMB}${item.imageName}`}
            alt=" "
            className="w-16 h-auto p-2 "
            onError={(e) => {
              e.target.onerror = null
              e.target.src = nopic
            }}
          />
        </td>
        <td className="pl-3">{item.version}</td>
        <td className="pl-3">{item.title}</td>
        <td className="pl-6">{item.time}</td>
        <td className="pl-6">{item.order}</td>
        <td className="flex mt-2 gap-2 -ml-4">
          <div>
            <BiSortAlt2
              size={30}
              data-tooltip-id="order"
              className="bg-sea text-white hover:bg-sea-hover p-2 rounded-md shadow-lg cursor-pointer transition-colors duration-400"
              onClick={() => {
                setSelectedVideo((prev) => ({ ...prev, order: item.order }))
                setModals((prev) => ({ ...prev, sort: true }))
                setSelectedVideo(item)
              }}
            />
            <ToolTip id="order" content="Change Order" />
          </div>

          <div>
            <FiEdit
              size={30}
              data-tooltip-id="edit"
              className="bg-sea text-white hover:bg-sea-hover p-2 rounded-md shadow-lg cursor-pointer transition-colors duration-400"
              onClick={() => {
                setModals((prev) => ({ ...prev, edit: true }))
                setSelectedVideo((prev) => ({ ...prev, id: item.id }))
                setEditingData(item)
              }}
            />
            <ToolTip id="edit" content="Edit" />
          </div>
          <button
            onClick={() => {
              setModals((prev) => ({ ...prev, delete: true }))
              setSelectedVideo((prev) => ({ ...prev, id: item.id }))
            }}
          >
            <GoTrash
              size={30}
              className="bg-blood/80 text-white hover:bg-blood/100 p-2 rounded-md shadow-lg cursor-pointer transition-colors duration-400"
              data-tooltip-id="trash"
            />
            <ToolTip id="trash" content="Delete" />
          </button>
        </td>
      </tr>
    </>
  )
  const addButton = () => (
    <button
      onClick={() => setModals((prev) => ({ ...prev, add: true }))}
      className="flex bg-sun hover:bg-orange cursor-pointer transition-colors duration-300 px-[22px] py-2 rounded-md text-nowrap text-white relative overflow-visible"
    >
      <FaCirclePlus size={25} className="mr-4" />
      Add Video
    </button>
  )
  return (
    <div>
      {modals.sort && (
        <ReusableSortModal
          title={editingData.title}
          setModal={() => setModals((prev) => ({ ...prev, sort: false }))}
          initialOrder={selectedVideo.order}
          setRefreshTrigger={setRefreshTrigger}
          actionHandler={(order) => handleSort(selectedVideo.id, order)}
        />
      )}

      {modals.edit && (
        <EditVideoModal
          setModals={setModals}
          setRefreshTrigger={setRefreshTrigger}
          chapterId={chapterId}
          editingData={editingData}
        />
      )}

      {modals.add && (
        <AddVideoModal
          setModals={setModals}
          pagination={pagination}
          setRefreshTrigger={setRefreshTrigger}
          setPagination={setPagination}
          chapterId={chapterId}
        />
      )}

      {modals.delete && (
        <ReusableDeleteModal
          onConfirm={handleDelete}
          setModal={() => setModals((prev) => ({ ...prev, delete: false }))}
          loading={loading}
          setLoading={setLoading}
          headerText='If you want to delete the selected video, please type "DELETE" below:'
          setRefreshTrigger={setRefreshTrigger}
        />
      )}
      <Table
        title="Videos"
        data={data.data}
        setData={setData}
        totalData={data.totalCount}
        pagination={pagination}
        setPagination={setPagination}
        addButton={addButton()}
        columns={columns}
        loading={loading}
        setLoading={setLoading}
        renderRow={renderVideosRow}
      />
    </div>
  )
}

export default VideosPage
