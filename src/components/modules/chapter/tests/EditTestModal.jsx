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
  );
}

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";
import { updateAsset } from "../../../../utils/services";

function EditTestModal({
  setModal,
  setRefreshTrigger,
  editingData,
  selectedTest,
}) {
  const [formData, setFormData] = useState({
    Title: "",
    Description: "",
    Time: "",
    FileName: "",
    Asset: 3,
    BookChapterId: editingData?.bookChapterId,
  });

  const [loading, setLoading] = useState(false);

  // مقداردهی اولیه از editingData
  useEffect(() => {
    if (editingData) {
      setFormData({
        Title: editingData.title || "",
        Description: editingData.description || "",
        Time: editingData.time || "",
        FileName: editingData.fileName || "",
        Asset: 3,
        BookChapterId: editingData.bookChapterId,
      });
    }
  }, [editingData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.Title || !formData.Description || !formData.Time) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const res = await updateAsset(selectedTest.id, formData); // یا هر API درست
      if (res.status === 200) {
        toast.success("Test updated successfully");
        setModal(false);
        setRefreshTrigger((prev) => !prev);
      }
    } catch (error) {
      toast.error("Update failed");
      console.error("Update Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center fixed bg-black/60 inset-0 z-7">
      <div className="relative bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4 text-sea">
          Edit Test
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <InputField
                id="Title"
                label="Title"
                value={formData.Title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="w-1/2">
              <InputField
                id="Description"
                label="Description"
                value={formData.Description}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <InputField
                id="Time"
                label="Time"
                value={formData.Time}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="w-1/2">
              <InputField
                id="FileName"
                label="File Name"
                value={formData.FileName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="mt-4 text-center text-white bg-sea p-2 h-10 rounded-md hover:bg-sea-hover transition-colors duration-300">
            {loading ? (
              <PropagateLoader color="white" className="pt-1" />
            ) : (
              <button type="submit">Update Test</button>
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
  );
}

export default EditTestModal;
