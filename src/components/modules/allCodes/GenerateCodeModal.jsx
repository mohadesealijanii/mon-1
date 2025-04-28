import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { generateCode } from "../../../utils/services";
import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";

function InputField({ id, label, type = "text", value, onChange }) {
  return (
    <div className="relative w-full">
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="no-spinner peer w-full border border-grey/30 rounded-md pl-3 pr-10 pt-6 text-sm 
                   focus:outline-none focus:border-sea focus:ring-1 focus:ring-sea 
                   hover:border-sea bg-white transition-all"
        required
      />
      <label
        htmlFor={id}
        className="absolute left-3 top-[1px] text-gray-500 text-sm transition-all duration-300 
                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                   peer-placeholder-shown:text-gray-400
                   peer-focus:top-[-0.7rem] peer-focus:text-sm peer-focus:text-sea bg-white px-1 pointer-events-none"
      >
        {label}
      </label>
    </div>
  );
}

function GenerateCodeModal({ isOpen, onClose, onSubmit, setRefreshTrigger }) {
  const [count, setCount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!count || isNaN(count) || Number(count) <= 0) {
      toast.error("Enter valid data");
      console.log("jj");
      return;
    }
    try {
      setLoading(true);
      const res = await generateCode(count);
      if (res.status === 200) {
        setRefreshTrigger((prev) => !prev);
        toast.success("Done!");
        onClose();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong!");
      console.log(error);
    }
    onSubmit(count);
  };

  if (!isOpen) return null;

  return (
    <div className="flex justify-center items-center fixed bg-black/60 inset-0 z-50">
      <div className="relative bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4 text-sea">
          Generate Codes
        </h2>

        <div className="space-y-4">
          <InputField
            id="count"
            label="Count"
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
        </div>

        <div className="mt-4 cursor-pointer text-center text-white bg-sun p-2 h-10 rounded-md hover:bg-orange transition-colors duration-300">
          {loading ? (
            <PropagateLoader className="mt-2" color="white" />
          ) : (
            <button className="cursor-pointer" onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute cursor-pointer top-2 right-3 text-gray-600 hover:text-gray-800"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
}

export default GenerateCodeModal;
