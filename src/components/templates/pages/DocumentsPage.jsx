import React, { useEffect, useState } from "react"
import { changeDocOrder, deleteAsset, getAssets } from "../../../utils/services"
import { useLocation, useNavigate } from "react-router-dom"
import Table from "../../modules/Table"
import { BiSortAlt2 } from "react-icons/bi"
import { FiEdit } from "react-icons/fi"
import { GoTrash } from "react-icons/go"
import { FaCirclePlus } from "react-icons/fa6"
import AddDocModal from "../../modules/chapter/documents/AddDocModal"
import ReusableDeleteModal from "../../modules/ReusableDeleteModal"
import toast from "react-hot-toast"
import EditDocModal from "../../modules/chapter/documents/EditDocModal"
import ReusableSortModal from "../../modules/ReusableSortModal"
import ToolTip from "../../modules/Tooltip"

function DocumentsPage() {
  const [data, setData] = useState({ data: [] })
  const [loading, setLoading] = useState(true)
  const [addDocModal, setAddDocModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedDocId, setSelectedDocId] = useState(null)
  const [editDocModal, setEditDocModal] = useState(false)
  const [sortModal, setSortModal] = useState(false)
  const [selectedDocOrder, setSelectedDocOrder] = useState(undefined)
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [editingData, setEditingData] = useState([])
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNumber: 1,
  })
  const location = useLocation()
  const navigate = useNavigate()
  const chapterId = location.state?.chapterId

  const getDocs = async () => {
    try {
      setLoading(true)
      const documents = await getAssets({
        ...pagination,
        asset: 4,
        bookChapterId: chapterId,
      })
      setData(documents)
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
    getDocs()
  }, [chapterId, refreshTrigger])

  const handleDelete = async () => {
    try {
      setLoading(true)
      const res = await deleteAsset(selectedDocId)
      if (res.status === 200) {
        toast.success("Document is successfully deleted!")
        setDeleteModal(false)
        setLoading(false)
        getDocs()
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast.error("Something went wrong!")
    }
  }

  const handleSort = async (docId, order) => {
    try {
      const res = await changeDocOrder(docId, order)
      if (res.status === 200) {
        toast.success("Done!")
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong!")
    }
  }
  const columns = [
    { key: "title", label: "Title" },
    { key: "version", label: "Version" },
    { key: "order", label: "Order" },
    { key: "controls", label: "Controls" },
  ]

  const renderDocsRow = (item) => (
    <>
      <tr className="h-13">
        <td className="pl-3">{item.title}</td>
        <td className="pl-6">{item.version}</td>
        <td className="pl-6">{item.order}</td>
        <td className="flex mt-2 gap-2 -ml-4">
          <div>
            <BiSortAlt2
              size={30}
              data-tooltip-id="order"
              className="bg-sea text-white hover:bg-sea-hover p-2 rounded-md shadow-lg cursor-pointer transition-colors duration-400"
              onClick={() => {
                setSortModal(true)
                setSelectedDocOrder(item.order)
                setSelectedDocId(item.id)
                setEditingData(item)              }}
            />
            <ToolTip id="order" content="Change Order" />
          </div>

          <div>
            <FiEdit
              size={30}
              data-tooltip-id="edit"
              className="bg-sea text-white hover:bg-sea-hover p-2 rounded-md shadow-lg cursor-pointer transition-colors duration-400"
              onClick={() => {
                setEditDocModal(true)
                setSelectedDocId(item.id)
                console.log(item.id)
                setEditingData(item)
              }}
            />
            <ToolTip id="edit" content="Edit" />
          </div>
          <button
            onClick={() => {
              setDeleteModal(true)
              setSelectedDocId(item.id)
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
      onClick={() => setAddDocModal((prev) => !prev)}
      className="flex bg-sun hover:bg-orange cursor-pointer transition-colors duration-300 px-[22px] py-2 rounded-md text-nowrap text-white relative overflow-visible"
    >
      <FaCirclePlus size={25} className="mr-4" />
      Add Document
    </button>
  )
  return (
    <div>
      {sortModal && (
        <ReusableSortModal
          title={editingData.title}
          setModal={setSortModal}
          initialOrder={selectedDocOrder}
          setRefreshTrigger={setRefreshTrigger}
          actionHandler={(order) => handleSort(selectedDocId, order)}
        />
      )}

      {editDocModal && (
        <EditDocModal
          chapterId={chapterId}
          docId={selectedDocId}
          setRefreshTrigger={setRefreshTrigger}
          editingData={editingData}
          setEditDocModal={setEditDocModal}
        />
      )}

      {addDocModal && (
        <AddDocModal
          setAddDocModal={setAddDocModal}
          pagination={pagination}
          setRefreshTrigger={setRefreshTrigger}
          setPagination={setPagination}
          chapterId={chapterId}
        />
      )}

      {deleteModal && (
        <ReusableDeleteModal
          // onClose={() => setDeleteModal(false)}
          onConfirm={handleDelete}
          setModal={setDeleteModal}
          loading={loading}
          setLoading={setLoading}
          headerText='If you want to delete the selected document, please type "DELETE" below:'
          setRefreshTrigger={setRefreshTrigger}
        />
      )}
      <Table
        title="Documents"
        data={data.data}
        setData={setData}
        totalData={data.totalCount}
        pagination={pagination}
        setPagination={setPagination}
        addButton={addButton()}
        columns={columns}
        loading={loading}
        setLoading={setLoading}
        renderRow={renderDocsRow}
      />
    </div>
  )
}

export default DocumentsPage
