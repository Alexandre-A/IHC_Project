import React, { useState,useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Modal from "../components/Modal";
import districtCityMap from '../../backend/jsons/districtCityMap.json';
import { FaHeart, FaCamera, FaShareAlt } from 'react-icons/fa';
import ads from '../../backend/jsons/ads.json';
import { useTranslation } from "react-i18next";
import { FiXCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi'



const AdFormPage = () => {
  // State for form fields
  const ip = "127.0.0.1";
  const port = 5000;
  const pattern = /[0-9][0-9]\/[0-9][0-9]\/[0-9][0-9][0-9][0-9]/;
  const {t} = useTranslation();
  const adFormPt1 = t("adFormPt1");
  const adFormPt3 = t("adFormPt3");
  const adId = localStorage.getItem("edit");

  const [formData, setFormData] = useState({
    date: new Date().toISOString(),
    name: "",
    price: "",
    available_date: "",
    gender: "Indifferent",
    quantity: "",
    description: "",
    district: "",
    city: "",
    street: "",
    min_age: "",
    max_age: "",
    marital_status: "Yes",
    expense_included: "Yes",
    bath_share: "Shared",
    tags: [],
    image: null,
    isNew: [true,""]
  });

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await fetch(`http://localhost:5000/ads/${adId}`);
        if (!response.ok) throw new Error("Ad not found");
        const data = await response.json();
  
        setFormData(prev => ({
          ...prev,
          ...data,
          image: data.image_url || null, // just store the string if it exists
          isNew:[false,adId]
        }));
      } catch (error) {
        console.error("Error fetching ad:", error);
      }
    };
  
    if (adId) {
      fetchAd();
    }
  }, [adId]);
  

  /*useEffect(() => {
    if (formData.image) {
      console.log("Image:", formData.image);
    }
  }, [formData.image]);*/

  const navigate = useNavigate();
  const [currentTag, setCurrentTag] = useState("");
  const [activeTab, setActiveTab] = useState("enter");
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");


  // Helper function to update tags while avoiding duplicates
  const updateTags = (newTag, prefix) => {
    setFormData((prevFormData) => {
      // Remove any existing tag with the same prefix (e.g., "Gender: ")
      const filteredTags = prevFormData.tags.filter(
        (tag) => !tag.startsWith(prefix),
      );
      // Add the new tag
      return {
        ...prevFormData,
        tags: [...filteredTags, newTag],
      };
    });
  };

  // Handle input changes for select fields (e.g., Bathroom, Gender)
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Generate tags based on the field
    if (name === "gender") {
      updateTags(`Gender: ${value}`, "Gender: ");
    } else if (name === "bath_share") {
      updateTags(`Bathroom: ${value}`, "Bathroom: ");
    } else if (name === "district") {
      updateTags(`‎ ${value}`, "‎ ");
    } else if (name === "marital_status") {
      updateTags(`Couples: ${value}`, "Couples: ");
    } else if (name === "expense_included") {
      updateTags(`Expenses: ${value}`, "Expenses: ");
    }
  
    // Update state
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "district" && { city: "" }), // Reset city if district changed
    }));
  };
  

  // Handle button clicks for Expenses Included
  const handleButtonChanges = (value,type) => {
    if (type==='expense_included') {updateTags(`Expenses: ${value}`, "Expenses: ");
                                  setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    expense_included: value,
                                  }));}
    else if (type==='marital_status') {updateTags(`Couples: ${value}`, "Couples: ");
                                      setFormData((prevFormData) => ({
                                        ...prevFormData,
                                        marital_status: value,
                                      }));}
  };

  // Handle file input for image
  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle tag addition (manual tags via modal)
  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, currentTag.trim()] });
      setCurrentTag("");
    }
  };

  const handleDataEntry = (e) =>{
    e.preventDefault();
    let changed = false;
    const requiredFields = [
     "description", "name", "price", "available_date",
      "gender", "quantity", "district", "city", "street",
      "min_age", "max_age", "bath_share", "expense_included", "marital_status"
    ];

    const validationFields = [
      "price", "available_date",
      "quantity",
      "min_age", "max_age"
    ];

  
    if (!changed && !formData.image) {
      setValidationMessage(`${adFormPt3.validationMessage1}`);
      setShowValidationModal(true);
      changed = true
    }

    if(!changed){
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        setValidationMessage(`Por favor preencha o campo: ${field}.`);
        setShowValidationModal(true);
        changed = true
        break;
      }
    }}

    for (const field of validationFields){
      if (field!=='available_date'){
        if (!(!isNaN(Number(formData[field])) && 
        formData[field].trim()  !== '')){
          setValidationMessage(`Campo ${field} inválido.`);
          setShowValidationModal(true);
          changed = true
          break;
        }

        if (field==='max_age'){
          if (Number(formData[field])<Number(formData["min_age"])){
            setValidationMessage(`Campo ${field} inválido (Max age inferior a Min age).`);
            setShowValidationModal(true);
            changed = true
            break;
          }
        }
      }
      else{
        if (!pattern.test(formData[field])){
          setValidationMessage(`Campo ${field} inválido.`);
          setShowValidationModal(true);
          changed = true
          break;
        }
      }
    }

    if (changed) {
      setActiveTab("enter");
    } else {
      setActiveTab("confirm");
    }
  }

  useEffect(() => {
    const msg = localStorage.getItem("toastSuccess");
    if (msg) {
      navigate("/myads")}
    if (formData.gender) {
      updateTags(`Gender: ${formData.gender}`, "Gender: ");
    }
    if (formData.marital_status) {
      updateTags(`Couples: ${formData.marital_status}`, "Couples: ");
    }
    if (formData.bath_share) {
      updateTags(`Bathroom: ${formData.bath_share}`, "Bathroom: ");
    }
    if (formData.expense_included){
      updateTags(`Expenses: ${formData.expense_included}`, "Expenses: ")
    }
  }, []);

  const handleRemoveTags = (index) => {
    const updatedTags = [...formData.tags]; // clone the array
    updatedTags.splice(index, 1);           // remove the tag
    setFormData((prev) => ({
      ...prev,
      tags: updatedTags
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);

    formDataToSend.append("email", "supreme_landlord@gmail.com");
    formDataToSend.append("description", formData.description);
    formDataToSend.append("date", formData.date);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("available_date", formData.available_date);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("quantity", formData.quantity);
    formDataToSend.append("district", formData.district);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("street", formData.street);
    formDataToSend.append("min_age", formData.min_age);
    formDataToSend.append("max_age", formData.max_age);
    formDataToSend.append("bath_share", formData.bath_share);
    formDataToSend.append("expense_included", formData.expense_included);
    formDataToSend.append("marital_status", formData.marital_status);
    formData.isNew.forEach((isNew) => formDataToSend.append("isNew[]", isNew));
    formData.tags.forEach((tag) => formDataToSend.append("tags[]", tag));

    if (formData.image) {
      if (typeof formData.image === "string") {
        try {
          const res = await fetch(formData.image);
          const blob = await res.blob();
          const filename = formData.image.split("/").pop(); // extract file name from URL
          const file = new File([blob], filename, { type: blob.type });
          formDataToSend.append("image", file);
        } catch (err) {
          console.error("Failed to fetch image from URL", err);
        }
      } else {
        formDataToSend.append("image", formData.image); // new upload
      }
    }

    if (adId) localStorage.removeItem("edit")
    try {
      const response = await fetch(`http://${ip}:${port}/form`, {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        localStorage.setItem("toastSuccess", JSON.stringify({
          type: "success",
          header: "Sucesso",
          message: "Anúncio criado com sucesso"
        }));
      } else {
        // Handle the case when the response is not successful
        localStorage.setItem("toastSuccess", JSON.stringify({
          type: "error",
          header: "Erro",
          message: "Falha na submissão do anúncio"
        }));
      }
    } catch (error) {
      // Handle error if fetch fails
      localStorage.setItem("toastSuccess", JSON.stringify({
        type: "error",
        header: "Erro",
        message: "Falha na submissão do anúncio"
      }));
    }
};

  const handleReset = () =>{
    setFormData({
      date: new Date().toISOString(), // ADD THIS
      name: "",
      price: "",
      available_date: "",
      gender: "Indifferent",
      quantity: "",
      description: "",
      district: "",
      city: "",
      street: "",
      min_age: "",
      max_age: "",
      marital_status: "Yes",
      expense_included: "Yes",
      bath_share: "Shared",
      tags: [],
      image: null,
      isNew:[true,adId]
    })
    localStorage.removeItem("edit")
  }

  // Open and close tag modal
  const openTagModal = () => setIsTagModalOpen(true);
  const closeTagModal = () => setIsTagModalOpen(false);

  return (
    <div>
      <Modal open={showValidationModal} onClose={() => setShowValidationModal(false)}>
              <div className="text-center w-56">
                <div className="mx-auto my-4 w-48">
                  <h3 className="text-lg font-black text-gray-800">Formulário inválido</h3>
                  <p className="text-sm text-gray-500 my-1">
                    {validationMessage}
                  </p>
                </div>
              </div>
            </Modal>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        {/* Main Content */}
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-4">
          {/* Tabs */}
          <div className="flex mb-4">
            <button
              className={`px-4 py-2 rounded-l ${
                activeTab === "enter" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {adFormPt1.progress1}
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "confirm"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {adFormPt1.progress2}
            </button>
            <button
              className={`px-4 py-2 rounded-r ${
                activeTab === "submit"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {adFormPt1.progress3}
            </button>
            
          </div>

          {/* Tab Content */}
          {activeTab === "enter" && (
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div>
                {/* Image Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Form</label>

                  <label
                    className="w-full h-32 border-2 border-dashed cursor-pointer border-gray-300 flex items-center justify-center relative"
                  >
                    {formData.image ? (
                      <img
                        src={
                    typeof formData.image === "string"
                      ? formData.image
                      : URL.createObjectURL(formData.image)
                  }
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm">Click to upload</span>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Description:
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded ${formData.description.length>0?"border-green-800 bg-green-100/30":"border"}`}
                    rows="4"
                  />
                </div>

                {/* Location */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Location:
                  </label>
                  <div className="flex space-x-2">
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-1/2 p-2 border rounded"
                    >
                      <option value="">Select District</option>
                      {Object.keys(districtCityMap).map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-1/2 p-2 border rounded"
                    >
                      <option value="">Select City</option>
                      {districtCityMap[formData.district]?.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Target Audience */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Who are you looking for:
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="min_age"
                      value={formData.min_age}
                      onChange={handleChange}
                      placeholder="Age:"
                      className={`w-1/2 p-2 border rounded ${
                        formData.min_age.length > 0 
                          ? !isNaN(Number(formData.min_age)) && formData.min_age.trim() !== ''
                            ? 'border-green-800 bg-green-100/30'
                            : 'border-red-800 bg-red-100/30'
                          : 'border'
                      }`}                   />
                    <span className="self-center">to</span>
                    <input
                      type="text"
                      name="max_age"
                      value={formData.max_age}
                      onChange={handleChange}
                      placeholder="Age:"
                      className={`w-1/2 p-2 border rounded ${
                        formData.max_age.length > 0 
                          ? !isNaN(Number(formData.max_age)) && formData.max_age.trim()  !== ''
                            ? 'border-green-800 bg-green-100/30'
                            : 'border-red-800 bg-red-100/30'
                          : 'border'
                      }`} 
                    />
                  </div>
                </div>

                {/* Marital Status */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Couples:
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleButtonChanges("Yes","marital_status")}
                      className={`px-4 py-2 rounded cursor-pointer ${
                        formData.marital_status === "Yes"
                          ? "bg-blue-500 hover:bg-blue-600  text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleButtonChanges("No","marital_status")}
                      className={`px-4 py-2 rounded cursor-pointer ${
                        formData.marital_status === "No"
                          ? "bg-blue-500 hover:bg-blue-600  text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-2 border ${formData.name.length>0?"border-green-800 bg-green-100/30":"border"} rounded`}
                  />
                </div>

                {/* Price and Available Date */}
                <div className="mb-4 flex space-x-2">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      Available
                    </label>
                    <input
                      type="text"
                      name="available_date"
                      value={formData.available_date}
                      onChange={handleChange}
                      placeholder="MM/DD/YYYY"
                      className={`w-full p-2 border rounded ${formData.available_date.length>0?(pattern.test(formData.available_date)?"border-green-800 bg-green-100/30":"border-red-800 bg-red-100/30"):"border"}`}
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      Price
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded ${
                        formData.price.length > 0 
                          ? !isNaN(Number(formData.price)) && formData.price.trim() !== ''
                            ? 'border-green-800 bg-green-100/30'
                            : 'border-red-800 bg-red-100/30'
                          : 'border'
                      }`}
                    />
                  </div>
                </div>

                {/* Gender and Room Number */}
                <div className="mb-4 flex space-x-2">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="Indifferent">Indifferent</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      Quantity
                    </label>
                    <input
                      type="text"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded ${
                        formData.quantity.length > 0 
                          ? !isNaN(Number(formData.quantity)) && formData.quantity.trim() !== ''
                            ? 'border-green-800 bg-green-100/30'
                            : 'border-red-800 bg-red-100/30'
                          : 'border'
                      }`}
                    />
                  </div>
                </div>

                {/* Street */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Street or Avenue
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className={`w-full p-2 border ${formData.street.length>0?"border-green-800 bg-green-100/30":"border"} rounded `}
                  />
                </div>

                {/* Pet Allowance (Expenses Included) */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Accommodation Details
                  </label>
                  <label className="block text-sm font-medium mb-1">
                    Expenses included:
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleButtonChanges("Yes","expense_included")}
                      className={`px-4 py-2 rounded cursor-pointer ${
                        formData.expense_included === "Yes"
                          ? "bg-blue-500 hover:bg-blue-600  text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleButtonChanges("No","expense_included")}
                      className={`px-4 py-2 rounded cursor-pointer ${
                        formData.expense_included === "No"
                          ? "bg-blue-500 hover:bg-blue-600  text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* bath Share (Bathroom) */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Bathroom:
                  </label>
                  <select
                    name="bath_share"
                    value={formData.bath_share}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Shared">Shared</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div className="col-span-1 md:col-span-2 mb-4">
                <label className="block text-sm font-medium mb-1">Tags:</label>
                <button
                  type="button"
                  onClick={openTagModal}
                  className="p-2 bg-blue-500 text-white rounded mb-2 cursor-pointer hover:bg-blue-600"
                >
                  Add/Edit Tags
                </button>
                <div className="mt-2">
                  {formData.tags.length > 0 ? (
                    formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm mr-2 mb-2"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No tags added</p>
                  )}
                </div>
                <div className="mt-2 flex justify-end">

                
            <div className="w-full flex justify-between px-1">
              {!adId?<button
                  onClick={handleReset}
                  className="px-4 py-2 rounded bg-gray-300 border-2 border-gray-800 cursor-pointer hover:text-white hover:bg-gray-500"
                >
                  <span className="text-lg">⟲</span> {adFormPt1.clearAll}
                </button>:<button
                  className="px-4 py-2 rounded"
                >
                
                </button>}

                <button
              onClick={handleDataEntry}
              className={`px-4 py-2 rounded right-4 bg-green-600 border-2 border-green-800 cursor-pointer hover:text-white `}
              >
              {adFormPt1.continue}
            </button>
              </div>
              </div>
              </div>

              {/* Tag Input Modal */}
              {isTagModalOpen && (
                <div className="fixed inset-0 visible bg-black/30 flex items-center transition-colors justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-lg font-medium mb-4">Add Tags</h2>
                    <div className="flex space-x-2 mb-4">
                      <input
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        placeholder="Enter a tag"
                        className="w-full p-2 border rounded"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="p-2 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white rounded"
                      >
                        Add
                      </button>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-2">
                        Current Tags:
                      </h3>
                      {formData.tags.length > 0 ? (
                        formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm mr-2 mb-2 cursor-pointer hover:bg-gray-300"
                            onClick={()=>handleRemoveTags(index)}

                          >
                            {tag + " X"}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500">No tags added yet</p>
                      )}
                    </div>
                    <button
                      onClick={closeTagModal}
                      className="w-full p-2 bg-gray-500 cursor-pointer text-white rounded hover:bg-gray-600"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </form>
            
          )}

          {activeTab === "confirm" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div>
                {/* Image Display */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Form</label>
                  <div className="w-full h-32 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {formData.image ? (
                      <img
                        src={
                    typeof formData.image === "string"
                      ? formData.image
                      : URL.createObjectURL(formData.image)
                  }
                        alt="Preview"
                        className="h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No image uploaded</span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Description:
                  </label>
                  <p className="w-full p-2 border rounded bg-gray-100 overflow-hidden text-ellipsis whitespace-nowrap">
                    {formData.description || "No description provided"}
                  </p>
                </div>

                {/* Location */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Location:
                  </label>
                  <div className="flex space-x-2">
                    <p className="w-1/2 p-2 border rounded bg-gray-100">
                      {formData.district || "No district selected"}
                    </p>
                    <p className="w-1/2 p-2 border rounded bg-gray-100">
                      {formData.city || "No municipality selected"}
                    </p>
                  </div>
                </div>

                {/* Target Audience */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Who are you looking for:
                  </label>
                  <div className="flex space-x-2">
                    <p className="w-1/2 p-2 border rounded bg-gray-100 overflow-hidden text-ellipsis whitespace-nowrap">
                      {formData.min_age || "No age specified"}
                    </p>
                    <span className="self-center">to</span>
                    <p className="w-1/2 p-2 border rounded bg-gray-100 overflow-hidden text-ellipsis whitespace-nowrap">
                      {formData.max_age || "No age specified"}
                    </p>
                  </div>
                </div>

                {/* Marital Status */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Couples:
                  </label>
                  <p className="p-2 border rounded bg-gray-100">
                    {formData.marital_status}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <p className="w-full p-2 border rounded bg-gray-100 overflow-hidden text-ellipsis whitespace-nowrap">
                    {formData.name || "No name provided"}
                  </p>
                </div>

                {/* Price and Available Date */}
                <div className="mb-4 flex space-x-2">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      Available
                    </label>
                    <p className="w-full p-2 border rounded bg-gray-100">
                      {formData.available_date || "No date provided"}
                    </p>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      Price
                    </label>
                    <p className="w-full p-2 border rounded bg-gray-100 overflow-hidden text-ellipsis whitespace-nowrap">
                      {formData.price || "No price provided"}
                    </p>
                  </div>
                </div>

                {/* Gender and Room Number */}
                <div className="mb-4 flex space-x-2">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      Gender
                    </label>
                    <p className="w-full p-2 border rounded bg-gray-100">
                      {formData.gender}
                    </p>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      Quantity
                    </label>
                    <p className="w-full p-2 border rounded bg-gray-100 overflow-hidden text-ellipsis whitespace-nowrap">
                      {formData.quantity || "No room number provided"}
                    </p>
                  </div>
                </div>

                {/* Street */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Street or Avenue
                  </label>
                  <p className="w-full p-2 border rounded bg-gray-100 overflow-hidden text-ellipsis whitespace-nowrap">
                    {formData.street || "No street provided"}
                  </p>
                </div>

                {/* Pet Allowance */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Accommodation Details
                  </label>
                  <label className="block text-sm font-medium mb-1">
                    Expenses included:
                  </label>
                  <p className="p-2 border rounded bg-gray-100">
                    {formData.expense_included}
                  </p>
                </div>

                {/* bath Share */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Bathroom:
                  </label>
                  <p className="w-full p-2 border rounded bg-gray-100">
                    {formData.bath_share}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="col-span-1 md:col-span-2 mb-4">
                <label className="block text-sm font-medium mb-1">Tags:</label>
                <div className="mt-2">
                  {formData.tags.length > 0 ? (
                    formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm mr-2 mb-2"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <p className="p-2 border rounded bg-gray-100">
                      No tags added
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-2 flex justify-start ">

                <button
              onClick={() => setActiveTab("enter")}
              className={`px-4 py-2 rounded right-4 bg-red-600 border-2 border-red-800 cursor-pointer hover:text-white `}
              >
              {adFormPt3.goBack}
            </button>
            
              </div>
              <div className="mt-2 flex justify-end ">

                <button
              onClick={() => setActiveTab("submit")}
              className={`px-4 py-2 rounded right-4 bg-green-600 border-2 border-green-800 cursor-pointer hover:text-white `}
              >
              {adFormPt1.continue}
            </button>
            
              </div>
            </div>
          )}
          {activeTab === "submit" && (
            <div className="flex flex-col items-center space-y-4 bg-gray-200/80 border-2 border-black-20 p-2 rounded">
              <h2 className="text-xl font-semibold">{adFormPt3.adPreview}</h2>
              <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden md:h-48">
                <img
                  src={
                    typeof formData.image === "string"
                      ? formData.image
                      : URL.createObjectURL(formData.image)
                  }
                  alt="Room"
                  className="w-full md:w-1/3 h-64 md:h-full object-cover border-2 md:rounded-none rounded-t"
                />

                <div className="w-full md:w-2/3 p-4 flex flex-col justify-between">
                  {/* Header Row */}
                  <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                    <div>
                      <h3 className="text-lg font-semibold">{formData.name}</h3>
                      <p className="text-sm text-gray-600">{formData.description}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-xl font-semibold text-gray-800">{formData.price}€</p>
                      <a href="#" className="text-sm text-blue-600 hover:underline">Sr. Miguel André</a>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.slice(0, 5).map((tag, i) => (
                      <span key={i} className="bg-gray-100 px-3 py-1 text-xs rounded-full border">{tag}</span>
                    ))}
                    {formData.tags.length >5 && (<span className="bg-gray-100 px-3 py-1 text-xs rounded-full border">{formData.tags.length-5}+</span>)}
                  </div>

                  {/* Action Icons */}
                  <div className="flex gap-3 justify-end mt-2">
                    <button className="p-2 border rounded">
                      <FiInfo size={25} />
                    </button>
                    <button className="p-2 border rounded">
                      <FaShareAlt size={25} />
                    </button>
                    <button className="p-2 border rounded">
                      <FaHeart size={25} />
                    </button>
                  </div>
                </div>
              </div>


              <h2 className="text-xl font-semibold">{adFormPt3.readyMessage}</h2>

              {/* Buttons on opposite ends */}
              <div className="w-full flex justify-between px-4">
                <button
                  onClick={() => setActiveTab("confirm")}
                  className="px-4 py-2 rounded bg-red-600 border-2 border-red-800 cursor-pointer hover:text-white"
                >
                  {adFormPt3.goBack}
                </button>

                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded bg-green-600 hover:text-white border-2 border-green-800 cursor-pointer"
                >
                  {adFormPt3.submit}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdFormPage;
