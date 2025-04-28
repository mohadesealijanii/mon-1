import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ClipLoader } from "react-spinners"

function ReusableModal({
  title,
  description,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  children,
}) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 flex justify-center items-start pt-10 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg max-w-120 w-full relative"
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

          <h2 className="text-md mb-5 text-center">
            {title && <span className="text-sea">{title}</span>}
          </h2>
          {description && (
            <p className="text-center text-gray-700 mb-5">{description}</p>
          )}

          {/* Optional custom content (e.g. datepickers, forms...) */}
          {children && <div className="mb-6">{children}</div>}

          <div className="flex justify-around gap-2">
            <button
              onClick={onClose}
              className="px-7 py-2 border-blood/40 border-2 text-ocean rounded hover:bg-blood/50 hover:text-white transition-colors duration-300"
            >
              {cancelText}
            </button>
            {loading ? (
              <div className="px-9 py-2 bg-sea rounded text-white flex items-center justify-center">
                <ClipLoader size={20} color="white" />
              </div>
            ) : (
              <button
                onClick={onConfirm}
                className="px-9 py-2 bg-sea hover:bg-sea-hover rounded text-white transition-colors duration-300"
              >
                {confirmText}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ReusableModal
