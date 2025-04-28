import React, { useEffect, useState } from "react";
import InputField from "../../modules/InputField";
import { createEmailConfig, getEmailConfig } from "../../../utils/services";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { PropagateLoader } from "react-spinners";

function EmailSettingPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    host: "",
    port: "",
    subject: "",
    body: "",
  });
  const [visiblePass, setVisiblePass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialFormData, setInitialFormData] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  useEffect(() => {
    const getEmailData = async () => {
      try {
        setLoading(true);
        const res = await getEmailConfig();
        if (res) {
          const fetchedData = {
            email: res.email || "",
            password: res.password || "",
            host: res.host || "",
            port: res.port || "",
            subject: res.subject || "",
            body: res.body || "",
          };
          setFormData(fetchedData);
          setInitialFormData(fetchedData);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        toast.error("Something went wrong!");
        console.log(error);
      }
    };
    getEmailData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (JSON.stringify(formData) === JSON.stringify(initialFormData)) {
      toast.error("No changes detected!");
      return;
    }

    try {
      setLoading(true);
      const res = await createEmailConfig(formData);
      if (res.status === 200) {
        toast.success("Changes applied successfully!");
        getEmailConfig();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong!");
      console.log(error);
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
            Update Email Config
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              id="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="flex relative">
              <InputField
                id="password"
                label="Password"
                type={visiblePass ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                onClick={() => setVisiblePass((prev) => !prev)}
                type="button"
                className="absolute right-4 top-3 cursor-pointer"
              >
                {visiblePass ? (
                  <FaRegEye size={20} className="text-sea" />
                ) : (
                  <FaRegEyeSlash size={20} className="text-sea" />
                )}
              </button>
            </div>
            <InputField
              id="host"
              label="Host"
              value={formData.host}
              onChange={handleChange}
              required
            />
            <InputField
              id="port"
              label="Port"
              type="number"
              value={formData.port}
              onChange={handleChange}
              required
            />
            <InputField
              id="subject"
              label="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <InputField
              id="body"
              label="Body"
              value={formData.body}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-8 cursor-pointer bg-sea hover:bg-sea-hover text-white font-semibold py-3 rounded-xl transition-all"
          >
            {loading ? (
              <PropagateLoader className="mt-3" color="#023047" />
            ) : (
              "Update"
            )}
          </button>
        </form>
      )}
      <Toaster />
    </div>
  );
}

export default EmailSettingPage;
