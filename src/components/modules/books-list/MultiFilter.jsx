import { useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { getAllCategories } from "../../../utils/services";

export default function CategoryFilter({ setPagination }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        if (data) {
          setCategories(data.map((item) => ({ label: item.title, value: item.title })));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      category: selectedCategories.join(",") || "",
      pageNumber: 1,
    }));
  }, [selectedCategories, setPagination]);

  return (
    <div className="text-sm">
      <MultiSelect
        value={selectedCategories}
        options={categories}
        onChange={(e) => setSelectedCategories(e.value)}
        placeholder="Category"
        display="chip"
        className="h-12"
        filter
        resetFilterOnHide
      />
    </div>
  );
}
