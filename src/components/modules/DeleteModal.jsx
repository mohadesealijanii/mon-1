import Cookies from "js-cookie"
import React, { useState } from "react"
import toast from "react-hot-toast"
import { ClipLoader } from "react-spinners"

function DeleteModal({
  onClose,
  setDeleteModal,
  id,
  fetchData,
  totalPages,
  selectedTitle,
  currentPage,
  setCurrentPage,
  setInfo,
  info,
  lastPage,
  categoryPerPage,
}) {
  const [loading, setLoading] = useState(false)

  const deleteHandler = async (id) => {
    const token = Cookies.get("authToken")
    try {
      setLoading(true)
      const res = await fetch(
        `https://stg-core.bpapp.net/api/BookCategory/DeleteBookCategory?id=${id}&transfer=false`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await res.json()
      if (data === true) {
        setInfo((prevInfo) => prevInfo.filter((item) => item.id !== id))
        toast.success("Category deleted successfully")
        setDeleteModal(false)

        await fetchData().then(setCurrentPage(lastPage))
        console.log("currentPage:", currentPage)
        console.log("totalPages:", totalPages)

        console.log("lastPage:", lastPage)
      }
    } catch (error) {
      console.log(error)
      toast.error("Error in deleting category")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/5 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✖
        </button>
        <h2 className="text-lg  mb-9 text-center">
          Are you sure to delete "
          {<span className="text-red-300">{selectedTitle}</span>}" category?
        </h2>
        <div className="flex justify-around gap-2">
          <button
            onClick={onClose}
            className="px-7 py-2 border-blood/40 an border-2 text-ocean rounded hover:bg-blood/50 hover:text-white transition-colors duration-300"
          >
            Cancel
          </button>
          {loading ? (
            <p className="flex items-center justify-center max-h-10 mb-[1px] px-9 bg-red-400 text-white rounded">
              <ClipLoader size={20} color="white" />
            </p>
          ) : (
            <button
              onClick={() => deleteHandler(id)}
              className="px-2 py-2 bg-red-400/45 rounded hover:bg-red-500/70 hover:text-white transition-colors duration-500"
            >
              Yes! Im sure
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeleteModal
