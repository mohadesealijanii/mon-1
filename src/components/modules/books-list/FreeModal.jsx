import React, { useState } from "react"
import { ClipLoader } from "react-spinners"
import toast from "react-hot-toast"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { Box } from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import { setFree } from "../../../utils/services"
import dayjs from "dayjs"

function FreeModal({ id, title, onClose, setModal, setRefreshTrigger, free }) {
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState({
    start: null,
    end: null,
    id
  })

  const freeHandler = async (id) => {
    // const start = dayjs(date.start).format("DD MMM YYYY")
    // const end = dayjs(date.end).format("DD MMM YYYY")
    const today = new Date()

    today.setHours(0, 0, 0, 0)
    if (!free && (!date.end || !date.start)) {
      toast.error("Please enter data completely")
    } else if (
      !free &&
      (new Date(date.start) > new Date(date.end) ||
        new Date(date.start) < today)
    ) {
      toast.error("Please enter valid date")
    } else {
      try {
        setLoading(true)
        await setFree(date);
        toast.success("Done!")
        setModal(false)
        setRefreshTrigger((prev) => !prev)
      } catch (error) {
        toast.error(error.message)
      }
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 flex justify-center items-start pt-10 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg max-w-120 h-70 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          >
            ✖
          </button>
          {free ? (
            <h2 className="text-md mb-22 text-center">
              Do you want to make "<span className="text-sea">{title}</span>"
              book unavailable for free?
            </h2>
          ) : (
            <h2 className="text-md mb-5 text-center">
              To make the "<span className="text-sea">{title}</span>" book
              available for free, please specify its start and end time:
            </h2>
          )}

          {!free && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 3,
                mb: 7,
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={date.start}
                  onChange={(newValue) =>
                    setDate((prev) => ({ ...prev, start: newValue }))
                  }
                  sx={{
                    width: 200,
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#0ea5e9",
                      },
                  }}
                />
                <DatePicker
                  label="End Date"
                  value={date.end}
                  onChange={(newValue) =>
                    setDate((prev) => ({ ...prev, end: newValue }))
                  }
                  sx={{
                    width: 200,
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#0ea5e9",
                      },
                  }}
                />
              </LocalizationProvider>
            </Box>
          )}

          <div className="flex justify-around gap-2">
            <button
              onClick={onClose}
              className="px-7 py-2 border-blood/40 an border-2 text-ocean rounded hover:bg-blood/50 hover:text-white transition-colors duration-300"
            >
              cancel
            </button>
            {loading ? (
              <p className="flex items-center justify-center max-h-10 px-9 bg-sea text-white rounded">
                <ClipLoader size={20} color="white" />
              </p>
            ) : !free ? (
              <button
                onClick={() => freeHandler(id)}
                className="px-9 py-2 bg-sea hover:bg-sea-hover rounded text-white transition-colors duration-300"
              >
                Confirm
              </button>
            ) : (
              <button
                className="px-9 py-2 bg-sea rounded text-white hover:bg-sea-hover shadow-md hover:shadow-2xl transition-colors duration-300"
                onClick={() => freeHandler(id)}
              >
                yes
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FreeModal
