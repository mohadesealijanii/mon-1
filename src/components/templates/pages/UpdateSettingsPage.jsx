import React, { useEffect, useState } from "react";
import InputField from "../../modules/InputField";
import toast, { Toaster } from "react-hot-toast";
import { PropagateLoader } from "react-spinners";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import {
  getAllCategories,
  getAllOfTheCats,
  getBanners,
  getSetting,
  updateSetting,
} from "../../../utils/services";

function SettingsPage() {
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 40,
    pageNumber: 1,
  });

  const [formData, setFormData] = useState({
    instagram: "",
    twitter: "",
    description: "",
    imageSize: "",
    audioSize: "",
    videoSize: "",
    documentSize: "",
    version: "",
    versionIos: "",
    privacyPolicy: "",
    termsOfUse: "",
    supportEmail: "",
    phone: "",
    downloadLink: "",
    forceUpdate: false,
    forceUpdateIos: false,
    inReview: false,
    banner1: 0,
    banner2: 0,
    category1: 0,
    category2: 0,
  });

  useEffect(() => {
    if (banners.length > 0 || categories.length > 0) {
      setFormData((prev) => ({
        ...prev,
        banner1: banners.find((b) => b.value === prev.banner1) || 0,
        banner2: banners.find((b) => b.value === prev.banner2) || 0,
        category1: categories.find((c) => c.value === prev.category1) || 0,
        category2: categories.find((c) => c.value === prev.category2) || 0,
      }));
    }
  }, [banners, categories]);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await getSetting();
        console.log(res);
        if (res) {
          const fetchedData = {
            instagram: res.instagram || "",
            twitter: res.twitter || "",
            description: res.description || "",
            imageSize: res.imageSize || "",
            audioSize: res.audioSize || "",
            videoSize: res.videoSize || "",
            documentSize: res.documentSize || "",
            version: res.version || "",
            versionIos: res.versionIos || "",
            privacyPolicy: res.privacyPolicy || "",
            termsOfUse: res.termsOfUse || "",
            supportEmail: res.supportEmail || "",
            phone: res.supportPhone || "",
            downloadLink: res.downloadLink || "",
            forceUpdate: res.forceUpdate || false,
            forceUpdateIos: res.forceUpdateIos || false,
            inReview: res.inReview || false,
            banner1: res.banner1 || 0,
            banner2: res.banner2 || 0,
            category1: res.category1 || 0,
            category2: res.category2 || 0,
          };
          setFormData(fetchedData);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        toast.error("Something went wrong!");
        console.log(error);
      }
    };
    const getCategories = async () => {
      const res = await getAllOfTheCats();
      const categoryOptions = res.data.map((datas) => ({
        label: datas.title,
        value: datas.id,
      }));
      setCategories(categoryOptions);
    };

    const getBanner = async () => {
      const res = await getBanners(pagination);
      const bannerOptions = res.data.map((datas) => ({
        label: datas.name,
        value: datas.id,
      }));
      setBanners(bannerOptions);
    };

    getData();
    getCategories();
    getBanner();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handleChangeDropdown = (e, id) => {
    setFormData((prev) => ({
      ...prev,
      [id]: e.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const editedData = {
        ...formData,
        banner1: formData.banner1?.value ?? formData.banner1 ?? 0,
        banner2: formData.banner2?.value ?? formData.banner2 ?? 0,
        category1: formData.category1?.value ?? formData.category1 ?? 0,
        category2: formData.category2?.value ?? formData.category2 ?? 0,
      };
      console.log(editedData);
      const res = await updateSetting(editedData);
      if (res.status === 200) {
        setLoading(false);
        toast.success("Changes applied successfully!");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-130 shadow-xl rounded-xl flex justify-center bg-white p-6">
      {loading ? (
        <PropagateLoader className="top-50" color="#023047" />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-2xl w-full max-w-2xl space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-sea mb-8">
            Update Settings
          </h2>

          {/* Using a flexible grid layout that stacks on small screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField
              id="instagram"
              label="Instagram"
              value={formData.instagram}
              onChange={handleChange}
              required
            />
            <InputField
              id="twitter"
              label="Twitter"
              value={formData.twitter}
              onChange={handleChange}
              required
            />
            <InputField
              id="description"
              label="About Us"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <InputField
              id="imageSize"
              label="Image Size"
              value={formData.imageSize}
              onChange={handleChange}
              required
            />
            <InputField
              id="audioSize"
              label="Audio Size"
              value={formData.audioSize}
              onChange={handleChange}
              required
            />
            <InputField
              id="videoSize"
              label="Video Size"
              value={formData.videoSize}
              onChange={handleChange}
              required
            />
            <InputField
              id="documentSize"
              label="Document Size"
              value={formData.documentSize}
              onChange={handleChange}
              required
            />
            <InputField
              id="version"
              label="Version"
              value={formData.version}
              onChange={handleChange}
              required
            />
            <InputField
              id="versionIos"
              label="Version iOS"
              value={formData.versionIos}
              onChange={handleChange}
              required
            />
            <InputField
              id="privacyPolicy"
              label="Privacy Policy"
              value={formData.privacyPolicy}
              onChange={handleChange}
              required
            />
            <InputField
              id="termsOfUse"
              label="Terms Of Use"
              value={formData.termsOfUse}
              onChange={handleChange}
              required
            />
            <InputField
              id="supportEmail"
              label="Support Email"
              value={formData.supportEmail}
              onChange={handleChange}
              required
            />
            <InputField
              id="phone"
              label="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <InputField
              id="downloadLink"
              label="Download Link"
              value={formData.downloadLink}
              onChange={handleChange}
              required
            />

            {/* Checkboxes */}
            <div className="col-span-2 flex gap-6">
              <Checkbox
                id="forceUpdate"
                checked={formData.forceUpdate}
                onChange={handleCheckboxChange}
                label="Force Update"
              />
              <Checkbox
                id="forceUpdateIos"
                checked={formData.forceUpdateIos}
                onChange={handleCheckboxChange}
                label="Force Update iOS"
              />
              <Checkbox
                id="inReview"
                checked={formData.inReview}
                onChange={handleCheckboxChange}
                label="In Review"
              />
            </div>

            {/* Dropdowns */}
            <div className="col-span-2 grid grid-cols-2 gap-6">
              <Dropdown
                value={formData.banner1}
                id="banner1"
                options={banners}
                onChange={(e) => handleChangeDropdown(e, "banner1")}
                placeholder="Show Banner 1"
              />
              <Dropdown
                value={formData.banner2}
                id="banner2"
                options={banners}
                onChange={(e) => handleChangeDropdown(e, "banner2")}
                placeholder="Show Banner 2"
              />
              <Dropdown
                value={formData.category1}
                id="category1"
                options={categories}
                onChange={(e) => handleChangeDropdown(e, "category1")}
                placeholder="Show Category 1"
              />
              <Dropdown
                value={formData.category2}
                id="category2"
                options={categories}
                onChange={(e) => handleChangeDropdown(e, "category2")}
                placeholder="Show Category 2"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full mt-8 cursor-pointer bg-sea hover:bg-sea-hover text-white font-semibold py-3 rounded-xl transition-all"
          >
            {loading ? (
              <PropagateLoader className="mt-3" color="#023047" />
            ) : (
              "Update Settings"
            )}
          </button>
        </form>
      )}
      <Toaster />
    </div>
  );
}

export default SettingsPage;
