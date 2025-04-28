import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import InputField from "../InputField";
import toast from "react-hot-toast";

const GetExcelModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!serialStart.length !== 10 || !serialEnd.length !== 10) {
      toast.error("Length of the serial must be included 10 numbers!");
      return;
    }
    // cosnt res = await fetch getCodesReserve(pagination)
  };

  if (!isOpen) return null;

  return (
    <div className="flex justify-center items-center fixed bg-black/60 inset-0 z-7">
      <div className="relative bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4 text-sea">
          Get Excel
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">

                  <div className="flex gap-4">
            <div className="w-1/2">
              <InputField
                id="serialStart"
                label="Serial Start"
                value={formData.serialStart}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-1/2">
              <InputField
                id="serialEnd"
                label="Serial End"
                value={formData.serialEnd}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              type="submit"
              className="text-white cursor-pointer  w-full bg-sun p-2 h-10 rounded-md hover:bg-orange transition-colors duration-300"
            >
              Get
            </button>
          </div>
        </form>

        <button
          onClick={onClose}
          className="absolute cursor-pointer top-2 right-3 text-gray-600 hover:text-gray-800"
        >
          <FaTimes size={18} />
        </button>
      </div>
    </div>
  );
};

export default GetExcelModal;
