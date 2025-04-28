import React, { useState } from "react"
import toast from "react-hot-toast"
import { PropagateLoader } from "react-spinners"
import { createAsset } from "../../../../utils/services"

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

function AddVideoModal({ setModals, setRefreshTrigger, chapterId }) {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      Image: e.target.files[0],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // فرم رو با Asset کامل کن
    const dataToSend = {
      ...formData,
      Asset: 2,
      BookChapterId: chapterId,
    }

    console.log(dataToSend)

    if (!dataToSend.Title || !dataToSend.Version) {
      toast.error("Please enter the video data completely")
      return
    }

    try {
      setLoading(true)
      const res = await createAsset(dataToSend)
      if (res.status === 200) {
        toast.success("Chapter added successfully")
        setModals((prev) => ({ ...prev, add: false }))
        setRefreshTrigger((prev) => !prev)
      }
    } catch (error) {
      toast.error("Something went wrong!")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center fixed bg-black/60 inset-0 z-50">
      <div className="relative bg-white p-6 rounded-lg w-full max-w-xl">
        <h2 className="text-xl font-semibold text-center mb-4 text-sea">
          Add New Video
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Title & Version */}
          <div className="flex gap-4">
            <InputField
              id="Title"
              label="Title"
              value={formData.Title}
              onChange={handleInputChange}
              required
            />
            <InputField
              id="Version"
              label="Version"
              value={formData.Version}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Row 2: Filename & Time */}
          <div className="flex gap-4">
            <InputField
              id="FileName"
              label="File Name"
              value={formData.FileName}
              onChange={handleInputChange}
              required
            />
            <InputField
              id="Time"
              label="Time"
              value={formData.Time}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Row 3: Description & Image */}
          <div className="flex gap-4">
            <InputField
              id="Description"
              label="Description"
              value={formData.Description}
              onChange={handleInputChange}
              required
            />
            <InputField
              id="Image"
              label="Image"
              onChange={handleFileChange}
              isFile
            />
          </div>

          {/* Submit Button */}
          <div className="mt-4 text-center text-white bg-sun p-2 h-10 rounded-md hover:bg-orange transition-colors duration-300">
            {loading ? (
              <PropagateLoader color="white" className="pt-1" />
            ) : (
              <button type="submit">Add Video</button>
            )}
          </div>
        </form>

        {/* Close Modal */}
        <button
          onClick={() => setModals((prev) => ({ ...prev, add: false }))}
          className="absolute top-2 right-3 text-gray-600 hover:text-gray-800"
        >
          X
        </button>
      </div>
    </div>
  )
}

export default AddVideoModal
