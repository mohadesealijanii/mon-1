import React, { useState } from "react"
import Input from "../Input"
import { changeOrder } from "../../../utils/services"
import toast from "react-hot-toast"
import { ClipLoader } from "react-spinners"

function OrderModal({
  onClose,
  title,
  id,
  setModal,
  initialOrder,
  setRefreshTrigger,
}) {
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(initialOrder)

  const orderHandler = async (id, order) => {
    if (!order) {
      toast.error("Please enter the order")
      return
    }

    try {
      setLoading(true)
      const res = await changeOrder(id, order)
      console.log(res)

      if (res.status === 200) {
        toast.success("Done!")
        setModal(false)
      } else {
        toast.error("Something went wrong")
      }
    } catch (error) {
      toast.error(error.message || "Error happened")
    } finally {
      setLoading(false)
      setRefreshTrigger((prev) => !prev)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white py-6 px-12 rounded-lg shadow-lg max-w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 cursor-pointer right-2 text-gray-600 hover:text-gray-800"
        >
          ✖
        </button>
        <h2 className="text-md mb-2 text-center ">
          please enter the view order of the "
          {<span className="text-sea">{title}</span>}" book
        </h2>
        <div className="flex justify-center mt-5">
          <Input
            label="order"
            value={order}
            onChange={(e) => {
              const val = e.target.value
              if (/^\d*$/.test(val)) {
                setOrder(val)
              }
            }}
          />
        </div>
        <div className="flex justify-around gap-2 mt-12">
          <button
            onClick={onClose}
            className="px-7 py-2 border-blood/60 cursor-pointer border-2 text-ocean rounded hover:bg-blood/70 hover:text-white transition-colors duration-300"
          >
            cancel
          </button>
          {loading ? (
            <p className="flex items-center justify-center max-h-10 mb-[1px] px-9 bg-sea text-white rounded">
              <ClipLoader size={20} color="white" />
            </p>
          ) : (
            <button
              onClick={() => orderHandler(id, order)}
              className="px-7 py-2 cursor-pointer bg-sea rounded hover:bg-sea-hover text-white transition-colors duration-300"
            >
              confirm
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderModal
