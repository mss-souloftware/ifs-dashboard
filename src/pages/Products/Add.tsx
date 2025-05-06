import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Link } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const VERSION = import.meta.env.VITE_BACKEND_API_VERSION;

const AddProduct: React.FC = () => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    thumbnail: '',
    categoryId: null as number | null,
    directCheckout: false,
    consultationQuestions: [] as any[],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/${VERSION}/products/categories`);
        const data = await response.json();
        if (data.status.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (categoryId: number) => {
    setFormData((prev) => ({ ...prev, categoryId }));
  };

  const handleDirectCheckout = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, directCheckout: e.target.checked });
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...formData.consultationQuestions];
    updatedQuestions[index].questionText = value;
    setFormData({ ...formData, consultationQuestions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      consultationQuestions: [
        ...formData.consultationQuestions,
        {
          questionText: '',
          answers: [
            {
              text: '',
              isCorrect: false,
              message: '',
              followUpQuestions: [],
            },
          ],
        },
      ],
    });
  };

  const handleAnswerChange = (qIndex: number, aIndex: number, key: string, value: any) => {
    const updatedQuestions = [...formData.consultationQuestions];
    updatedQuestions[qIndex].answers[aIndex][key] = value;
    setFormData({ ...formData, consultationQuestions: updatedQuestions });
  };

  const handleAddAnswer = (qIndex: number) => {
    const updatedQuestions = [...formData.consultationQuestions];
    updatedQuestions[qIndex].answers.push({
      text: '',
      isCorrect: false,
      message: '',
      followUpQuestions: [],
    });
    setFormData({ ...formData, consultationQuestions: updatedQuestions });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Please sign in first.');
      return;
    }

    if (!formData.categoryId) {
      alert('Please select a category.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/${VERSION}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoryId: formData.categoryId,
          thumbnail: formData.thumbnail,
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          directCheckout: Boolean(formData.directCheckout),
          consultationQuestions: formData.consultationQuestions,
        }),
      });

      const result = await response.json();
      if (result.status.success) {
        alert('Product created successfully!');
      } else {
        alert('Failed to create product: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error creating product. Please try again.');
    }
  };

  return (
    <>
      <Breadcrumb pageName="Add New Product" />
      <div className="flex gap-5 flex-col sm:flex-row">
        <div className="flex flex-col gap-5 w-9/12">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark py-4 px-6.5">
            <div>
              <label className="mb-3 block text-black dark:text-white">Product Title</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Product Name"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              />
            </div>
            <div className="mt-4">
              <label className="mb-3 block text-black dark:text-white">Product Description</label>
              <textarea
                rows={6}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Product Description"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              ></textarea>
            </div>
            <div>
              <label className="mb-3 block text-black dark:text-white">Product Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="9.99$"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              />
            </div>
            <div>
              <label className="mb-3 block text-black dark:text-white">Thumbnail URL</label>
              <input
                type="text"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleInputChange}
                placeholder="Image URL"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              />
            </div>
            <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                name="directCheckout"
                checked={formData.directCheckout}
                onChange={handleDirectCheckout}
                className="w-3 h-3 accent-primary"
              />
              <label className="ml-2 block text-black dark:text-white">Consultant Product?</label>
            </div>
            {formData.directCheckout && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-black dark:text-white mb-2">Consultation Questions</h4>
                {formData.consultationQuestions.map((q, qIndex) => (
                  <div key={qIndex} className="mb-4 p-4 border rounded">
                    <input
                      type="text"
                      placeholder="Question text"
                      value={q.questionText}
                      onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                      className="mb-2 w-full rounded border px-3 py-2"
                    />
                    {q.answers.map((a, aIndex) => (
                      <div key={aIndex} className="mb-3 pl-4 border-l">
                        <input
                          type="text"
                          placeholder="Answer text"
                          value={a.text}
                          onChange={(e) => handleAnswerChange(qIndex, aIndex, 'text', e.target.value)}
                          className="mb-1 w-full rounded border px-3 py-1"
                        />
                        <input
                          type="text"
                          placeholder="Message"
                          value={a.message}
                          onChange={(e) => handleAnswerChange(qIndex, aIndex, 'message', e.target.value)}
                          className="mb-1 w-full rounded border px-3 py-1"
                        />
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={a.isCorrect}
                            onChange={(e) => handleAnswerChange(qIndex, aIndex, 'isCorrect', e.target.checked)}
                          />
                          Correct answer
                        </label>
                      </div>
                    ))}
                    <button onClick={() => handleAddAnswer(qIndex)} className="text-sm text-primary mt-1">+ Add Answer</button>
                  </div>
                ))}
                <button onClick={handleAddQuestion} className="text-sm text-primary mt-2">+ Add Question</button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-9 w-1/4">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Product Categories</h3>
            </div>
            <div className="flex flex-col gap-3 p-5">
              {categories.map((category) => (
                <label key={category.id} htmlFor={`category-${category.id}`} className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition ${formData.categoryId === category.id ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 bg-white text-gray-700 hover:border-primary'} dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-primary`}>
                  <input
                    type="radio"
                    id={`category-${category.id}`}
                    name="category"
                    value={category.id}
                    checked={formData.categoryId === category.id}
                    onChange={() => handleCategoryChange(category.id)}
                    className="hidden"
                  />
                  <div className={`h-5 w-5 flex items-center justify-center rounded-full border-2 transition-all ${formData.categoryId === category.id ? 'border-primary bg-primary' : 'border-gray-400 bg-white'}`}>
                    {formData.categoryId === category.id && (
                      <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-sm font-medium">{category.name}</span>
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

export default AddProduct;