import React, { useState } from "react"
import toast from "react-hot-toast"
import { PropagateLoader } from "react-spinners"
import { Dropdown } from "primereact/dropdown"
import { createQuestion } from "../../../../../utils/services"
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

function AddQuesModal({ setModal, setRefreshTrigger }) {
  const { testId } = useParams()
  const [loading, setLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const options = [
    { name: "Multiple Choice", id: 1 },
    { name: "True Or False", id: 2 },
    { name: "Gap Filling", id: 3 },
  ]
  const [data, setData] = useState({
    title: "",
    modelQuestions: null,
    bookChapterAssetId: testId,
  })
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setData({
      ...data,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!data.title || !data.modelQuestions) {
      toast.error("Please enter the question data completely")
      return
    }
    try {
      setLoading(true)
      const res = await createQuestion(data)
      if (res.status === 200) {
        toast.success("Question is added successfully")
        setModal(false)
        setRefreshTrigger((prev) => !prev)
      }
    } catch (error) {
      console.error("Create Question Error:", error)
      toast.error("An erro ocuured while adding question!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center fixed bg-black/60 inset-0 z-7">
      <div className="relative bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4 text-sea">
          Add New Question Data
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <InputField
                id="title"
                label="title"
                value={data.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="card flex justify-content-center">
              <Dropdown
                value={selectedOption}
                onChange={(e) => {
                  setSelectedOption(e.value)
                  setData((prev) => ({
                    ...prev,
                    modelQuestions: e.value.id,
                  }))
                }}
                options={options}
                optionLabel="name"
                placeholder="Question Type"
                className="w-full md:w-14rem"
                checkmark={true}
                highlightOnSelect={false}
              />
            </div>
          </div>

          <div className="mt-4 text-center text-white bg-sun p-2 h-10 rounded-md hover:bg-orange transition-colors duration-300">
            {loading ? (
              <PropagateLoader color="white" className="pt-1" />
            ) : (
              <button>Add Question</button>
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

export default AddQuesModal
