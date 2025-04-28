import React, { useEffect, useState } from "react"
import Table from "../../modules/Table"
import { BiSortAlt2 } from "react-icons/bi"
import { FiEdit } from "react-icons/fi"
import { GoTrash } from "react-icons/go"
import { FaCirclePlus } from "react-icons/fa6"
import { LiaClipboardCheckSolid } from "react-icons/lia"
import { changeDocOrder, deleteAsset, getAssets } from "../../../utils/services"
import AddTestModal from "../../modules/chapter/tests/AddTestModal"
import EditTestModal from "../../modules/chapter/tests/EditTestModal"
import ReusableDeleteModal from "../../modules/ReusableDeleteModal"
import toast from "react-hot-toast"
import ReusableSortModal from "../../modules/ReusableSortModal"
import { useParams, useNavigate } from "react-router-dom"
import ToolTip from "../../modules/Tooltip"

function TestsPage() {
  const [data, setData] = useState({ data: [] })
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [editingData, setEditingData] = useState([])
  const [modals, setModals] = useState({
    add: false,
    delete: false,
    edit: false,
    sort: false,
  })
  const [selectedTest, setSelectedTest] = useState({
    id: undefined,
    order: undefined,
    title: "",
  })
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNumber: 1,
  })

  const { chapterId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!chapterId) {
      navigate(-1)
      return
    }
    getTests()
  }, [chapterId, refreshTrigger])

  const getTests = async () => {
    try {
      setLoading(true)
      const tests = await getAssets({
        ...pagination,
        asset: 3,
        bookChapterId: chapterId,
      })
      setData(tests)
      console.log(tests)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const handleSort = async (selectedTest) => {
    try {
      const res = await changeDocOrder(selectedTest.id, selectedTest.order)
      if (res.status === 200) {
        toast.success("Done!")
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong!")
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      const res = await deleteAsset(selectedTest.id)
      if (res.status === 200) {
        toast.success("Test is successfully deleted!")
        setModals((prev) => ({ ...prev, delete: false }))
        setLoading(false)
        getTests()
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast.error("Something went wrong!")
    }
  }

  const columns = [
    { key: "title", label: "Title" },
    { key: "time", label: "Time" },
    { key: "order", label: "Order" },
    { key: "controls", label: "Controls" },
  ]

  const renderTestsRow = (item) => (
    <>
      <tr className="h-13">
        <td className="pl-3">{item.title}</td>
        <td className="pl-6">{item.version}</td>
        <td className="pl-6">{item.order}</td>
        <td className="flex mt-2 gap-2 -ml-7">
          <LiaClipboardCheckSolid
            size={30}
            data-tooltip-id="question"
            className="bg-sea text-white hover:bg-sea-hover p-2 rounded-md shadow-lg cursor-pointer transition-colors duration-400"
            onClick={() => {
              setModals((prev) => ({ ...prev, sort: true }))
              setSelectedTest({ id: item.id, order: item.order })
              navigate(`questions/${item.id}`)
            }}
          />
          <ToolTip id="question" content="Questions" />

          <BiSortAlt2
            size={30}
            data-tooltip-id="order"
            className="bg-sea text-white hover:bg-sea-hover p-2 rounded-md shadow-lg cursor-pointer transition-colors duration-400"
            onClick={() => {
              setModals((prev) => ({ ...prev, sort: true }))
              setSelectedTest({
                id: item.id,
                order: item.order,
                title: item.title,
              })
              console.log(item)
            }}
          />
          <ToolTip id="order" content="Change Order" />

          <FiEdit
            size={30}
            data-tooltip-id="edit"
            className="bg-sea text-white hover:bg-sea-hover p-2 rounded-md shadow-lg cursor-pointer transition-colors duration-400"
            onClick={() => {
              setModals((prev) => ({ ...prev, edit: true }))
              setSelectedTest({ id: item.id })
              setEditingData(item)
            }}
          />
          <ToolTip id="edit" content="Edit" />

          <button
            onClick={() => {
              setModals((prev) => ({ ...prev, delete: true }))
              setSelectedTest({ id: item.id })
            }}
          >
            <GoTrash
              size={30}
              data-tooltip-id="delete"
              className="bg-blood/80 text-white hover:bg-blood/100 p-2 rounded-md shadow-lg cursor-pointer transition-colors duration-400"
            />
            <ToolTip id="delete" content="Delete" />
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
      Add Test
    </button>
  )

  return (
    <div>
      {modals.sort && (
        <ReusableSortModal
          title={selectedTest.title}
          setModal={(value) => setModals((prev) => ({ ...prev, sort: value }))}
          initialOrder={selectedTest.order}
          setRefreshTrigger={setRefreshTrigger}
          actionHandler={(order) => handleSort({ id: selectedTest.id, order })}
        />
      )}

      {modals.delete && (
        <ReusableDeleteModal
          headerText='if You want to delete the selected test, type "DELETE" below:'
          setModal={() => setModals((prev) => ({ ...prev, delete: false }))}
          loading={loading}
          setLoading={setLoading}
          setRefreshTrigger={setRefreshTrigger}
          onConfirm={handleDelete}
        />
      )}

      {modals.add && (
        <AddTestModal
          setModal={() => setModals((prev) => ({ ...prev, add: false }))}
          pagination={pagination}
          setRefreshTrigger={setRefreshTrigger}
          setPagination={setPagination}
          chapterId={chapterId}
        />
      )}

      {modals.edit && (
        <EditTestModal
          setRefreshTrigger={setRefreshTrigger}
          setModal={() => setModals((prev) => ({ ...prev, edit: false }))}
          editingData={editingData}
          selectedTest={selectedTest}
        />
      )}

      <div>
        <Table
          title="Tests"
          addButton={addButton()}
          data={data.data}
          setData={setData}
          columns={columns}
          totalData={data.totalCount}
          setPagination={setPagination}
          pagination={pagination}
          loading={loading}
          setLoading={setLoading}
          renderRow={renderTestsRow}
        />
      </div>
    </div>
  )
}

export default TestsPage
