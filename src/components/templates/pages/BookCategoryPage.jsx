import toast from "react-hot-toast"
import {
  deleteCategory,
  getAllCategories,
  getCatForUpdate,
} from "../../../utils/services"
import Table from "../../modules/Table"
import { useEffect, useState } from "react"
import { FaCirclePlus } from "react-icons/fa6"
import nopic from "../../../pics/nopic.png"
import { FiEdit } from "react-icons/fi"
import { GoTrash } from "react-icons/go"
import ReusableDeleteModal from "../../modules/ReusableDeleteModal"
import AddCategoryModal from "../../modules/category/AddCategoryModal"
import EditCategoryModal from "../../modules/category/EditCategoryModal"
import Input from "../../modules/Input"

function BookListPage() {
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNumber: 1,
    title: "",
  })
  const [data, setData] = useState({ data: [] })
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [selectedCat, setSelectedCat] = useState({
    id: "",
    title: "",
  })
  const [searchRow, setSearchRow] = useState(false)
  const [modals, setModals] = useState({
    add: false,
    edit: false,
    help: false,
  })
  useEffect(() => {
    getCategories()
  }, [pagination, refreshTrigger])

  const getCategories = async () => {
    try {
      setLoading(true)
      const categories = await getAllCategories(pagination)
      setData(categories)
      console.log(categories)
      setLoading(false)
    } catch (error) {
      console.log(error)
      toast.error("Error fetching categories!")
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      console.log(id)
      const res = await deleteCategory(id)
      if (res.status === 200) {
        setModals((prev) => ({ ...prev, delete: false }))
        toast.success("Category deleted successfully")
        setRefreshTrigger((prev) => !prev)
      } else {
        toast.error("Failed to delete category")
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong!")
    }
  }

  const getCat = async (id) => {
    const catData = await getCatForUpdate(id)
    setSelectedCat({
      id: id,
      title: catData.title,
    })
    setModals((prev) => ({ ...prev, edit: true }))
  }

  const columns = [
    { key: "image", label: "Image" },
    { key: "categories", label: "Categories" },
    { key: "controls", label: "Controls" },
  ]

  const BASE_URL = "https://stg-core.bpapp.net/"
  const THUMB = "Content/Images/Book/Thumb/"

  const renderCategoriesRow = (item) => (
    <>
      <tr className="w-full hover:bg-ocean/6 transition-colors duration-400 border-t border-slate-300 overflow-x-scroll cursor-pointer text-nowrap">
        <td className="pl-2">
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
        <td className="p-4 border-slate-300 ">{item.title}</td>
        <td className="p-4 border-slate-300">
          <button
            onClick={() => {
              getCat(item.id)
              setSelectedCat((prev) => ({ ...prev, id: item.id }))
              setModals((prev) => ({ ...prev, edit: true }))
              console.log(selectedCat)
            }}
            data-tooltip-id="edit"
            className="bg-sea -ml-4 mr-4 text-white hover:bg-sea-hover p-2 rounded-md shadow-lg cursor-pointer transition-colors duration-400"
          >
            <FiEdit />
          </button>
          <button
            onClick={() => {
              console.log(item.id)
              setSelectedCat((prev) => ({ ...prev, id: item.id }))
              setModals((prev) => ({ ...prev, delete: true }))
            }}
            data-tooltip-id="trash"
            className="bg-blood/80 text-white hover:bg-blood/100 p-2 rounded-md shadow-lg cursor-pointer transition-colors duration-400"
          >
            <GoTrash />
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
      Add Category
    </button>
  )

  const filters = (
    <div className="justify-between px-3 w-45">
      <Input
        label="Search"
        onChange={(e) =>
          setPagination((prev) => ({ ...prev, title: e.target.value }))
        }
        value={pagination.title}
      />
    </div>
  )

  return (
    <div>
      {modals.edit && (
        <EditCategoryModal
          setModal={() => setModals((prev) => ({ ...prev, edit: false }))}
          selectedCat={selectedCat}
          setRefreshTrigger={setRefreshTrigger}
        />
      )}
      {modals.delete && (
        <ReusableDeleteModal
          onConfirm={() => handleDelete(selectedCat.id)}
          setModal={() => setModals((prev) => ({ ...prev, delete: false }))}
          loading={loading}
          setLoading={setLoading}
          headerText='If you want to delete the selected category, please type "DELETE" below:'
          setRefreshTrigger={setRefreshTrigger}
        />
      )}
      {modals.add && (
        <AddCategoryModal
          setModals={setModals}
          setRefreshTrigger={setRefreshTrigger}
        />
      )}
      {/* {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />} */}{" "}
      <Table
        title="Categories List"
        addButton={addButton()}
        // helpButton={helpButton()}
        data={data.data}
        setData={setData}
        columns={columns}
        totalData={data.totalCount}
        setPagination={setPagination}
        pagination={pagination}
        loading={loading}
        setLoading={setLoading}
        renderRow={renderCategoriesRow}
        searchRow={searchRow}
        customHeaderContent={filters}
        setSearchRow={setSearchRow}
      />
    </div>
  )
}

export default BookListPage
