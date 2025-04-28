import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { PropagateLoader } from "react-spinners"
import InputField from "../InputField"
import { updateCat } from "../../../utils/services"
import { FaS } from "react-icons/fa6"

function EditCategoryModal({ setModal, setRefreshTrigger, selectedCat }) {
  const [loading, setLoading] = useState(false)
  const [newTitle, setNewTitle] = useState("")

  useEffect(() => {
    if (selectedCat) {
      setNewTitle(selectedCat.title)
    }
  }, [selectedCat])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newTitle) {
      toast.error("Please enter the category name!")
      return
    }
    try {
      setLoading(true)
      console.log(selectedCat.id, newTitle)
      const res = await updateCat(selectedCat.id, newTitle)
      if (res.status === 200) {
        setRefreshTrigger((prev) => !prev)
        setLoading(false)
        toast.success("Done!")
        setModal((prev) => ({ ...prev, edit: false }))
      }
    } catch (error) {
      setLoading(false)
      toast.success("Something went wrong!")
      console.log(error)
    }
  }

  return (
    <div className="flex justify-center items-center fixed bg-black/60 inset-0 z-50">
      <div className="relative bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4 text-sea">
          Add New Category
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between py-3">
            <InputField
              id="title"
              label="Category Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
          </div>

          <div className="mt-4 cursor-pointer text-center text-white bg-sun p-2 h-10 rounded-md hover:bg-orange transition-colors duration-300">
            {loading ? (
              <PropagateLoader color="white" className="pt-1" />
            ) : (
              <button
                onClick={() => handleSubmit}
                className="cursor-pointer"
                type="submit"
              >
                Submit
              </button>
            )}
          </div>
        </form>

        <button
          onClick={() => setModal((prev) => ({ ...prev, edit: false }))}
          className="absolute cursor-pointer top-2 right-3 text-gray-600 hover:text-gray-800"
        >
          X
        </button>
      </div>
    </div>
  )
}

export default EditCategoryModal
