import React, { useState } from "react";
import toast from "react-hot-toast";
import { createChapter } from "../../../utils/services";
import { PropagateLoader } from "react-spinners";

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

function AddChapterModal({
  setAddChapterModal,
  //   pagination,
  //   setPagination,
  setRefreshTrigger,
  BookId,
}) {
  const [formData, setFormData] = useState({
    Title: "",
    Version: "",
    Description: "",
    BookId,
    File: null,
  });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      File: e.target.files[0],
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.Title || !formData.Version || !formData.Description) {
      toast.error("Please enter the chapter data completely");
      return;
    }
    try {
      setLoading(true);
      const res = await createChapter({ formData });
      if (res.status === 200) {
        toast.success("Chapter added successfully");
        setAddChapterModal(false);
        setRefreshTrigger((prev) => !prev);
        setFormData({
          Title: "",
          Version: "",
          Description: "",
          BookId,
          File: null,
        });
      }
    } catch (error) {
      console.error("Create Chapter Error:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center fixed bg-black/60 inset-0 z-7">
      <div className="relative bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4 text-sea">
          Add New Chapter Data
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Title & Version */}
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
                id="Version"
                label="Version"
                value={formData.Version}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Row 3: Category & Image */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <InputField
                id="Description"
                label="Description"
                value={formData.Description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="w-1/2">
              <InputField
                id="image"
                label="Image"
                value={formData.image ? formData.image.name : ""}
                onChange={handleFileChange}
                isFile={true}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4 text-center text-white bg-sun p-2 h-10 rounded-md hover:bg-orange transition-colors duration-300">
            {loading ? (
              <PropagateLoader color="white" className="pt-1" />
            ) : (
              <button>Add Chapter</button>
            )}
          </div>
        </form>

        {/* Close Modal Button */}
        <button
          onClick={() => setAddChapterModal(false)}
          className="absolute top-2 right-3 text-gray-600 hover:text-gray-800"
        >
          X
        </button>
      </div>
    </div>
  );
}

export default AddChapterModal;
