import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { PropagateLoader } from "react-spinners"
import { updateQuestion } from "../../../../../utils/services"
import { useParams } from "react-router-dom"

function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  isFile = false,
}) {
  return (
    <div className="relative flex-1">
      {isFile ? (
        <input
          type="file"
          id={id}
          name={id}
          onChange={onChange}
          className="peer w-full border border-grey/30 rounded-md pl-3 pr-10 pt-6 text-sm 
                     focus:outline-none focus:border-sea focus:ring-1 focus:ring-sea 
                     hover:border-sea bg-white transition-all"
        />
      ) : (
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder=" "
          className="peer w-full border border-grey/30 rounded-md pl-3 pr-10 pt-6 text-sm 
                     focus:outline-none focus:border-sea focus:ring-1 focus:ring-sea 
                     hover:border-sea bg-white transition-all"
          required={required}
        />
      )}
      <label
        htmlFor={id}
        className="absolute left-3 top-[0.9px] text-gray-500 text-sm transition-all duration-300 
                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                   peer-placeholder-shown:text-gray-400
                   peer-focus:top-[-0.5rem] peer-focus:text-sm peer-focus:text-sea bg-white px-1 pointer-events-none"
      >
        {label}
      </label>
    </div>
  )
}

function EditQuestionModal({ setModal, setRefreshTrigger, editingData }) {
  const { testId } = useParams()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    title: "",
    bookChapterAssetId: testId,
    id: "",
  })

  useEffect(() => {
    if (editingData) {
      setData({
        title: editingData.title || "",
        // bookChapterAssetId: editingData.bookChapterAssetId || "",
        id: editingData.id || "",
      })
    }
  }, [editingData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setData({
      ...data,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!data.title) {
      toast.error("Please complete all fields")
      return
    }
    try {
      setLoading(true)
      const res = await updateQuestion(data)
      if (res.status === 200) {
        toast.success("Question updated successfully")
        setModal(false)
        setRefreshTrigger((prev) => !prev)
      }
    } catch (error) {
      console.error("Update Question Error:", error)
      toast.error("An error occurred while updating the question")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center fixed bg-black/60 inset-0 z-7">
      <div className="relative bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4 text-sea">
          Edit Question
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="title"
            label="Title"
            value={data.title}
            onChange={handleInputChange}
            required
          />
          <div className="mt-4 text-center text-white bg-sun p-2 h-10 rounded-md hover:bg-orange transition-colors duration-300">
            {loading ? (
              <PropagateLoader color="white" className="pt-1" />
            ) : (
              <button type="submit">Update Question</button>
            )}
          </div>
        </form>
        <button
          onClick={() => setModal(false)}
          className="absolute top-2 right-3 text-gray-600 hover:text-gray-800"
        >
          X
        </button>
      </div>
    </div>
  )
}

export default EditQuestionModal
