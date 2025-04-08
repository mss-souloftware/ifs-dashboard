import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const VERSION = import.meta.env.VITE_BACKEND_API_VERSION;

const AddCategory: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        shortDescription: '',
        longDescription: '',
        needConsultation: false, // New field for consultation
        type: '' as 'MEN_HEALTH' | 'WOMEN_HEALTH' | 'RESPIRATORY_AND_DIGESTIVE' | 'GENERAL_HEALTH', // Only one of the four options can be selected
    });

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle category selection
    const handleCategoryChange = (type: 'MEN_HEALTH' | 'WOMEN_HEALTH' | 'RESPIRATORY_AND_DIGESTIVE' | 'GENERAL_HEALTH') => {
        setFormData((prev) => ({
            ...prev,
            type: type, // Set the selected category type
        }));
    };

    // Handle consultation checkbox
    const handleConsultationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, needConsultation: e.target.checked });
    };

    // Submit product data
    const handleSubmit = async () => {
        if (!formData.type) {
            alert('Please select a category.');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/${VERSION}/products/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    shortDescription: formData.shortDescription,
                    longDescription: formData.longDescription,
                    needConsultation: formData.needConsultation, // Send the consultation status
                    type: formData.type, // Send the selected category type
                }),
            });

            const result = await response.json();
            if (result.status.success) {
                alert('Category created successfully!');
            } else {
                alert('Failed to create category: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error creating category:', error);
            alert('Error creating category. Please try again.');
        }
    };

    return (
        <>
            <Breadcrumb pageName="Add New Category" />
            <div className="flex gap-5 flex-col sm:flex-row">
                {/* Left Section - Category Form */}
                <div className="flex flex-col gap-5 w-9/12">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark py-4 px-6.5">
                        {/* Category Name */}
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
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        {/* Short Description */}
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Short Description
                            </label>
                            <textarea
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleInputChange}
                                placeholder="Short Description"
                                rows={3}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        {/* Long Description */}
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Long Description
                            </label>
                            <textarea
                                name="longDescription"
                                value={formData.longDescription}
                                onChange={handleInputChange}
                                placeholder="Long Description"
                                rows={5}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        {/* Consultation Checkbox */}
                        <div className="mt-4">
                            <label className="mb-3 block text-black dark:text-white">
                                Need Consultation?
                            </label>
                            <input
                                type="checkbox"
                                name="needConsultation"
                                checked={formData.needConsultation}
                                onChange={handleConsultationChange}
                                className="w-5 h-5 accent-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Section - Category Selection */}
                <div className="flex flex-col gap-9 w-1/4">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Categories Types
                            </h3>
                        </div>
                        <div className="flex flex-col gap-3 p-5">
                            {['MEN_HEALTH', 'WOMEN_HEALTH', 'RESPIRATORY_AND_DIGESTIVE', 'GENERAL_HEALTH'].map((category) => (
                                <label
                                    key={category}
                                    htmlFor={`category-${category}`}
                                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition 
                                    ${formData.type === category ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 bg-white text-gray-700 hover:border-primary'}
                                    dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-primary`}
                                >
                                    <input
                                        type="radio"
                                        id={`category-${category}`}
                                        name="category"
                                        value={category}
                                        checked={formData.type === category}
                                        onChange={() => handleCategoryChange(category as 'MEN_HEALTH' | 'WOMEN_HEALTH' | 'RESPIRATORY_AND_DIGESTIVE' | 'GENERAL_HEALTH')}
                                        className="hidden"
                                    />
                                    <div
                                        className={`h-5 w-5 flex items-center justify-center rounded-full border-2 transition-all
                                        ${formData.type === category ? 'border-primary bg-primary' : 'border-gray-400 bg-white'}
                                        `}
                                    >
                                        {formData.type === category && (
                                            <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
                                        )}
                                    </div>
                                    <span className="text-sm font-medium">
                                        {category.replace(/_/g, ' ').toUpperCase()}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark py-4 px-6.5">
                        <div className="text-center">
                            <button
                                onClick={handleSubmit}
                                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                            >
                                Publish
                            </button>
                            <Link
                                to="#"
                                className="text-center text-sm text-primary mt-4 inline-block hover:underline"
                            >
                                Delete Product
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddCategory;
