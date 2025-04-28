import React, { useState } from "react"
import { ClipLoader } from "react-spinners"
import toast from "react-hot-toast"
import { setAnswer } from "../../../../../utils/services"

function SetAnswerModal({ setRefreshTrigger, editingData, setModal }) {
  const { id, title, isCorrect } = editingData
  const [loading, setLoading] = useState(false)

  const setAnswerHandler = async (id) => {
    try {
      setLoading(true)
      const res = await setAnswer(id)
      if (res === true) {
        toast.success("Done!")
      }
      setLoading(false)
      setModal(false)
      setRefreshTrigger((prev) => !prev)
    } catch (error) {
      console.log(error)
      toast.error("something went wrong!")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={() => setModal(false)}
          className="absolute cursor-pointer top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✖
        </button>
        <h2 className="text-lg mb-9 text-center">
          {!isCorrect && (
            <span>Do you want to set it as the correct answer?</span>
          )}
        </h2>
        <div className="flex justify-around gap-2">
          <button
            onClick={() => setModal(false)}
            className="px-7 py-2 border-blood/60 cursor-pointer border-2 text-ocean rounded hover:bg-blood/70 hover:text-white transition-colors duration-300"
          >
            Cancel
          </button>
          {loading ? (
            <p className="flex items-center justify-center max-h-10 mb-[1px] px-9 bg-sea text-white rounded">
              <ClipLoader size={20} color="white" />
            </p>
          ) : (
            <button
              onClick={() => setAnswerHandler(id)}
              className="px-11 py-2 cursor-pointer bg-sea rounded hover:bg-sea-hover text-white transition-colors duration-300"
            >
              Yes
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SetAnswerModal
