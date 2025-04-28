import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Dropdown } from "primereact/dropdown";
import {
  createBook,
  getAllCategories,
  updateBook,
} from "../../../utils/services";
import { PropagateLoader } from "react-spinners";

function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
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

function EditBookModal({ editingData, setModal }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    Title: "",
    Version: "",
    BookCategoryId: "",
    Tags: "",
    Authors: "",
    Description: "",
    File: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesList = await getAllCategories();
        setCategories(categoriesList);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const foundCategory = categories.find(
        (cat) => cat.title === editingData.Category
      );
      console.log(editingData);
      if (foundCategory) {
        setFormData({
          Title: editingData.Title,
          Version: editingData.Version,
          BookCategoryId: foundCategory.id,
          Tags: editingData.Tags,
          Authors: editingData.Authors,
          Description: editingData.Description,
          File: null,
        });
        setSelectedCategory(foundCategory);
        setPreviewImage(editingData.ImageUrl || null);
      }
      console.log(editingData);
    }
  }, [categories]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, File: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleResetFile = () => {
    setFormData({ ...formData, File: null });
    setPreviewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.BookCategoryId || !formData.Title || !formData.Version) {
      toast.error("Please enter the book data completely");
      return;
    }

    try {
      setLoading(true);
      const response = editingState
        ? await updateBook(editingState.id, { formData })
        : await createBook({ formData });
      if (response.status === 200) {
        toast.success(
          editingState ? "Book updated successfully" : "Book added successfully"
        );
        setAddBookModal(false);
      }
    } catch (error) {
      console.error("Book Save Error:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center fixed bg-black/60 inset-0 z-7">
      <div className="relative bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4 text-sea">
          Edit Book
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

          {/* Row 2: Authors & Tags */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <InputField
                id="Authors"
                label="Authors"
                value={formData.Authors}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="w-1/2">
              <InputField
                id="Tags"
                label="Tags"
                value={formData.Tags}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Row 3: Category & Image */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <Dropdown
                value={selectedCategory}
                onChange={(e) => {
                  const selected = e.value
                  setSelectedCategory(selected)
                  setFormData({ ...formData, BookCategoryId: selected.id })
                }}
                options={categories}
                optionLabel="title"
                placeholder="Category"
                filter
                className="w-full text-sm max-w-48"
              />
            </div>

            <div className="w-1/2 flex flex-col gap-1">
              <InputField
                id="image"
                label="Image"
                onChange={handleFileChange}
                isFile={true}
              />
              {previewImage && (
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded mt-1 border"
                  />
                  <button
                    type="button"
                    onClick={handleResetFile}
                    className="text-xs text-red-500 mt-1 underline"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Row 4: Description */}
          <div className="relative">
            <textarea
              id="Description"
              name="Description"
              value={formData.Description}
              onChange={handleInputChange}
              placeholder=" "
              className="peer w-full border border-grey/30 rounded-md pl-3 pr-10 pt-6 text-sm
                 focus:outline-none focus:border-sea focus:ring-1 focus:ring-sea
                 hover:border-sea bg-white transition-all"
              required
            />
            <label
              className="absolute left-3 top-[0.9px] text-gray-500 text-sm transition-all duration-300
                 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                 peer-placeholder-shown:text-gray-400
                 peer-focus:top-[-0.5rem] peer-focus:text-sm peer-focus:text-sea bg-white px-1 pointer-events-none"
            >
              Description
            </label>
          </div>
          {/* Submit Button */}
          <div className="mt-4 text-center text-white cursor-pointer bg-sun p-2 h-10 rounded-md hover:bg-orange transition-colors duration-300">
            {loading ? (
              <PropagateLoader color="white" className="pt-1" />
            ) : (
              <button type="submit" className="cursor-pointer">
                Update Book
              </button>
            )}
          </div>
        </form>

        {/* Close Modal Button */}
        <button
          onClick={() => {
            setModal(null)
          }}
          className="absolute cursor-pointer top-2 right-3 text-gray-600 hover:text-gray-800"
        >
          X
        </button>
      </div>
    </div>
  )
}

export default EditBookModal;
