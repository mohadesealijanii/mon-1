import React, { useState } from "react";
import Input from "../modules/Input";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

function ReusableDeleteModal({
  setModal,
  onConfirm,
  loading,
  headerText,
  inputLabel = "type here",
  requiredText = "DELETE",
  confirmText = "confirm",
  cancelText = "cancel",
}) {
  const [input, setInput] = useState("");

  const handleConfirm = () => {
    if (input === requiredText) {
      onConfirm();
    } else {
      toast.error("Invalid input!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white py-6 px-12 rounded-lg shadow-lg max-w-96 relative">
        <button
          onClick={() => setModal(false)}
          className="absolute cursor-pointer top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✖
        </button>
        <h2 className="text-md mb-2 text-center">{headerText}</h2>

        <div className="flex justify-center mt-5">
          <Input
            label={inputLabel}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="flex justify-around gap-2 mt-12">
          <button
            onClick={() => setModal(false)}
            className="px-7 py-2 cursor-pointer border-sea border-2 text-ocean rounded hover:bg-sea/80 hover:text-white transition-colors duration-300"
          >
            {cancelText}
          </button>

          {loading ? (
            <div className="flex items-center justify-center px-11 bg-blood text-white rounded">
              <ClipLoader size={20} color="white" />
            </div>
          ) : (
            <button
              onClick={handleConfirm}
              className="px-7 cursor-pointer bg-blood/60 rounded hover:bg-blood text-white transition-colors duration-300"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReusableDeleteModal;
