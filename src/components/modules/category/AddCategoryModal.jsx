import React, { useState } from "react"
import toast from "react-hot-toast"
import { PropagateLoader } from "react-spinners"
import InputField from "../InputField"
import { createCategory } from "../../../utils/services"

function AddCategoryModal({ setModals, setRefreshTrigger }) {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title) {
      toast.error("Please enter the category name!")
      return
    }
    try {
      setLoading(true)
      const res = await createCategory({ title: title })
      if (res.status === 200) {
        toast.success("Category added successfully")
        setModals((prev) => ({ ...prev, add: false }))
        setRefreshTrigger((prev) => !prev)
      }
    } catch (error) {
      console.error("Create Category Error:", error)
      toast.error("An error occurred while creating the category!")
    } finally {
      setLoading(false)
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mt-4 cursor-pointer text-center text-white bg-sun p-2 h-10 rounded-md hover:bg-orange transition-colors duration-300">
            {loading ? (
              <PropagateLoader color="white" className="pt-1" />
            ) : (
              <button className="cursor-pointer" type="submit">
                Submit
              </button>
            )}
          </div>
        </form>

        <button
          onClick={() => setModals((prev) => ({ ...prev, add: false }))}
          className="absolute cursor-pointer top-2 right-3 text-gray-600 hover:text-gray-800"
        >
          X
        </button>
      </div>
    </div>
  )
}

export default AddCategoryModal
