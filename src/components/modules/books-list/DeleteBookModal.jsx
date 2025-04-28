import React, { useState } from "react"
import Input from "../Input"
import { deleteBook } from "../../../utils/services"
import toast from "react-hot-toast"
import { ClipLoader } from "react-spinners"

function DeleteBookModal({ onClose, title, id, setRefreshTrigger }) {
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState("")

  const deleteHandler = async () => {
    if (input === "DELETE") {
      try {
        setLoading(true)
        const res = await deleteBook(id)
        if (res.status === 200) {
          toast.success("Book successfully deleted")
          setLoading(false)
          setRefreshTrigger((prev) => !prev)
        }
      } catch (error) {
        toast.error(error.message)
      }
    } else {
      toast.error("Invalid input!")
    }
  }
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white py-6 px-12 rounded-lg shadow-lg max-w-96 relative">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✖
        </button>
        <h2 className="text-md mb-2 text-center ">
          IF you want to delete the
          {<span className="text-blood"> "{title}"</span>} book, please type
          "DELETE" below:
        </h2>
        <div className="flex justify-center mt-5">
          <Input
            label="type here"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="flex justify-around gap-2 mt-12">
          <button
            onClick={onClose}
            className="px-7 py-2 border-sea cursor-pointer border-2 text-ocean rounded hover:bg-sea/80 hover:text-white transition-colors duration-300"
          >
            cancel
          </button>
          {loading ? (
            <p className="flex items-center justify-center max-h-10 mb-[1px] px-9 bg-sea text-white rounded">
              <ClipLoader size={20} color="white" />
            </p>
          ) : (
            <button
              onClick={() => deleteHandler(id)}
              className="px-7 cursor-pointer bg-blood/60 rounded hover:bg-blood text-white transition-colors duration-300"
            >
              confirm
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeleteBookModal
