// src/pages/EditCategoryPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const VERSION = import.meta.env.VITE_BACKEND_API_VERSION;

const EditCategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    longDescription: "",
    needConsultation: false,
    type: "",
  });
  const [loading, setLoading] = useState(true); // New loading flag

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/api/${VERSION}/products/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        const category = data.data;

        setFormData({
          name: category.name || "",
          shortDescription: category.shortDescription || "",
          longDescription: category.longDescription || "",
          needConsultation: !!category.needConsultation,
          type: category.type || "",
        });
        setLoading(false); // Stop loading once data is set
      } catch (error) {
        console.error("Failed to fetch category", error);
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConsultationChange = (e) => {
    setFormData((prev) => ({ ...prev, needConsultation: e.target.checked }));
  };

  const handleCategoryChange = (type) => {
    setFormData((prev) => ({ ...prev, type }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/api/${VERSION}/products/categories/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Update failed");
      }

      navigate("/categories");
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <>
      <Breadcrumb pageName="Edit Category" />
      <div className="flex gap-5 flex-col sm:flex-row">
        {/* Left Section */}
        <div className="flex flex-col gap-5 w-9/12">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark py-4 px-6.5">
            <div>
              <label className="mb-3 block text-black dark:text-white">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Category Name"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              />
            </div>

            <div>
              <label className="mb-3 block text-black dark:text-white">
                Short Description
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                rows={3}
                placeholder="Short Description"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              />
            </div>

            <div>
              <label className="mb-3 block text-black dark:text-white">
                Long Description
              </label>
              <textarea
                name="longDescription"
                value={formData.longDescription}
                onChange={handleInputChange}
                rows={5}
                placeholder="Long Description"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              />
            </div>

            <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                name="needConsultation"
                checked={formData.needConsultation}
                onChange={handleConsultationChange}
                className="w-3 h-3 accent-primary"
              />
              <label className="ml-2 block text-black dark:text-white">
                Need Consultation?
              </label>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-9 w-1/4">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Category Types
              </h3>
            </div>
            <div className="flex flex-col gap-3 p-5">
              {["MEN_HEALTH", "WOMEN_HEALTH", "RESPIRATORY_AND_DIGESTIVE", "GENERAL_HEALTH"].map((type) => (
                <label
                  key={type}
                  htmlFor={`category-${type}`}
                  className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition 
                    ${formData.type === type ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 bg-white text-gray-700 hover:border-primary'}
                    dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-primary`}
                >
                  <input
                    type="radio"
                    id={`category-${type}`}
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={() => handleCategoryChange(type)}
                    className="hidden"
                  />
                  <div
                    className={`h-5 w-5 flex items-center justify-center rounded-full border-2 
                    ${formData.type === type ? 'border-primary bg-primary' : 'border-gray-400 bg-white'}`}
                  >
                    {formData.type === type && (
                      <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-sm font-medium">
                    {type.replace(/_/g, " ")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark py-4 px-6.5">
            <div className="text-center">
              <button
                onClick={handleSubmit}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCategoryPage;
