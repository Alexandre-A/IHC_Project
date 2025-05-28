import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import districtCityMap from "../../backend/jsons/districtCityMap.json";
import { FaHeart, FaCamera, FaShareAlt } from "react-icons/fa";
import ads from "../../backend/jsons/ads.json";
import { useTranslation } from "react-i18next";
import {
  FiXCircle,
  FiCheckCircle,
  FiInfo,
  FiAlertTriangle,
} from "react-icons/fi";
import ReturnButton from "../components/ReturnButton";
import { colors } from "../utils/colors";

const AdFormPage = () => {
  // State for form fields
  const ip = "127.0.0.1";
  const port = 5000;
  const pattern = /[0-9][0-9]\/[0-9][0-9]\/[0-9][0-9][0-9][0-9]/;
  const { t } = useTranslation();
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
    isNew: [true, ""],
  });

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await fetch(`http://localhost:5000/ads/${adId}`);
        if (!response.ok) throw new Error("Ad not found");
        const data = await response.json();

        setFormData((prev) => ({
          ...prev,
          ...data,
          image: data.image_url || null, // just store the string if it exists
          isNew: [false, adId],
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
  const handleButtonChanges = (value, type) => {
    if (type === "expense_included") {
      updateTags(`Expenses: ${value}`, "Expenses: ");
      setFormData((prevFormData) => ({
        ...prevFormData,
        expense_included: value,
      }));
    } else if (type === "marital_status") {
      updateTags(`Couples: ${value}`, "Couples: ");
      setFormData((prevFormData) => ({
        ...prevFormData,
        marital_status: value,
      }));
    }
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

  const handleDataEntry = (e) => {
    e.preventDefault();
    let changed = false;
    const requiredFields = [
      "description",
      "name",
      "price",
      "available_date",
      "gender",
      "quantity",
      "district",
      "city",
      "street",
      "min_age",
      "max_age",
      "bath_share",
      "expense_included",
      "marital_status",
    ];

    const validationFields = [
      "price",
      "available_date",
      "quantity",
      "min_age",
      "max_age",
    ];

    if (!changed && !formData.image) {
      setValidationMessage(`${adFormPt3.validationMessage1}`);
      setShowValidationModal(true);
      changed = true;
    }

    if (!changed) {
      for (const field of requiredFields) {
        if (!formData[field] || formData[field].trim() === "") {
          setValidationMessage(t("adFormPt3.validationMessage2", { field }));
          setShowValidationModal(true);
          changed = true;
          break;
        }
      }
    }

    for (const field of validationFields) {
      if (field !== "available_date") {
        if (
          !(!isNaN(Number(formData[field])) && formData[field].trim() !== "")
        ) {
          setValidationMessage(t("adFormPt3.validationMessage4", { field }));
          setShowValidationModal(true);
          changed = true;
          break;
        }

        if (field === "max_age") {
          if (Number(formData[field]) < Number(formData["min_age"])) {
            setValidationMessage(t("adFormPt3.validationMessage3", { field }));
            setShowValidationModal(true);
            changed = true;
            break;
          }
        }
      } else {
        if (!pattern.test(formData[field])) {
          setValidationMessage(t("adFormPt3.validationMessage4", { field }));
          setShowValidationModal(true);
          changed = true;
          break;
        }
      }
    }

    if (changed) {
      setActiveTab("enter");
    } else {
      setActiveTab("confirm");
    }
  };

  const steps = [
    { id: 'enter', label: adFormPt1.progress1 },
    { id: 'confirm', label: adFormPt1.progress2 },
    { id: 'submit', label: adFormPt1.progress3 },
  ];

  useEffect(() => {
    const msg = localStorage.getItem("toastSuccess");
    if (msg) {
      navigate("/myads");
    }
    if (formData.gender) {
      updateTags(`Gender: ${formData.gender}`, "Gender: ");
    }
    if (formData.marital_status) {
      updateTags(`Couples: ${formData.marital_status}`, "Couples: ");
    }
    if (formData.bath_share) {
      updateTags(`Bathroom: ${formData.bath_share}`, "Bathroom: ");
    }
    if (formData.expense_included) {
      updateTags(`Expenses: ${formData.expense_included}`, "Expenses: ");
    }
  }, []);

  const handleRemoveTags = (index) => {
    const updatedTags = [...formData.tags]; // clone the array
    updatedTags.splice(index, 1); // remove the tag
    setFormData((prev) => ({
      ...prev,
      tags: updatedTags,
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

    if (adId) localStorage.removeItem("edit");
    try {
      const response = await fetch(`http://${ip}:${port}/form`, {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        localStorage.setItem(
          "toastSuccess",
          JSON.stringify({
            type: "success",
            header: "Sucesso",
            message: "Anúncio criado com sucesso",
          }),
        );
      } else {
        // Handle the case when the response is not successful
        localStorage.setItem(
          "toastSuccess",
          JSON.stringify({
            type: "error",
            header: "Erro",
            message: "Falha na submissão do anúncio",
          }),
        );
      }
    } catch (error) {
      // Handle error if fetch fails
      localStorage.setItem(
        "toastSuccess",
        JSON.stringify({
          type: "error",
          header: "Erro",
          message: "Falha na submissão do anúncio",
        }),
      );
    }
  };

  const handleReset = () => {
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
      isNew: [true, adId],
    });
    localStorage.removeItem("edit");
  };

  const validateSections = () => {
    const errors = {
      basicInfo: false,
      locationInfo: false,
      targetInfo: false,
      accommodationDetails: false,
    };
  
    // BASIC INFO
    if (!formData.name || isNaN(Number(formData.price)) || !pattern.test(formData.available_date) || isNaN(Number(formData.quantity))) {
      errors.basicInfo = true;
    }
  
    // LOCATION INFO
    if (!formData.district || !formData.city || !formData.street) {
      errors.locationInfo = true;
    }
  
    // TARGET INFO
    if (isNaN(Number(formData.min_age)) || isNaN(Number(formData.max_age)) || !formData.gender || !formData.marital_status) {
      errors.targetInfo = true;
    }
  
    // ACCOMMODATION DETAILS
    if (!formData.expense_included || !formData.bath_share) {
      errors.accommodationDetails = true;
    }
  
    return errors;
  };
  
  const sectionErrors = validateSections();
  

  // Open and close tag modal
  const openTagModal = () => setIsTagModalOpen(true);
  const closeTagModal = () => setIsTagModalOpen(false);

  return (
    <div>
      <Modal
        open={showValidationModal}
        onClose={() => setShowValidationModal(false)}
      >
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div
            className="p-6 rounded-lg shadow-lg z-60 text-center w-56"
            style={{ backgroundColor: colors.white }}
          >
            <div className="mx-auto my-4 w-48">
              <h3
                className="text-lg font-black"
                style={{ color: colors.primary }}
              >
                {adFormPt1.validationTitle}
              </h3>
              <p className="text-sm my-1" style={{ color: colors.dark }}>
                {validationMessage}
              </p>
            </div>
          </div>
        </div>
      </Modal>
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: colors.light }}
      >
        <div className="w-full max-w-4xl rounded-lg p-4 flex flex-col items-start">
          <ReturnButton previousPage={"/myads"}></ReturnButton>
          {/* Main Content */}
          <div
            className="w-full max-w-4xl shadow-md rounded-r-lg rounded-b-lg p-4"
            style={{ backgroundColor: colors.white }}
          >
            {/* Tabs */}
            <div className="flex items-center mb-2 justify-center w-full max-w-md mx-auto">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {/* Step Indicator */}
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 text-sm font-semibold ${
                activeTab === step.id
                  ? 'bg-secondary text-white'
                  : 'bg-light text-dark border border-secondary'
              }`}
              style={{
                backgroundColor: activeTab === step.id ? colors.secondary : colors.light,
                color: activeTab === step.id ? colors.white : colors.dark,
                borderColor: colors.secondary,
              }}
            >
              {index + 1}
            </div>
            <span className="mt-2 text-xs font-medium text-dark">{step.label}</span>
          </div>
          {/* Connecting Line */}
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 transition-colors duration-200 ${
                steps.findIndex(s => s.id === activeTab) > index
                  ? 'bg-secondary'
                  : 'bg-gray-300'
              }`}
              style={{
                backgroundColor:
                  steps.findIndex(s => s.id === activeTab) > index
                    ? colors.secondary
                    : colors.light,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>

            {/* Tab Content */}
            {activeTab === "enter" && (
            <div className="space-y-6">
              {/* Image Upload Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4" style={{ color: colors.dark }}>
                  {adFormPt1.form}
                </h2>
                <label
                  className={`w-full h-32 border-2 border-dashed border-gray-300 flex items-center justify-center relative transition-all duration-200 ${
                    showValidationModal ? "pointer-events-none opacity-60" : "cursor-pointer hover:border-gray-400"
                  }`}
                >
                  {formData.image ? (
                    <img
                      src={
                        typeof formData.image === "string"
                          ? formData.image
                          : URL.createObjectURL(formData.image)
                      }
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover rounded"
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
                      <span className="text-sm">{adFormPt1.clickUpload}</span>
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

              {/* Basic Information Section */}
              <details className="bg-white rounded-lg shadow-md overflow-hidden">
                <summary className="p-6 cursor-pointer text-lg font-semibold select-none" style={{ color: colors.dark }}>
                  {adFormPt1.basicInfo +"*"}
                </summary>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.dark }}>
                      {adFormPt1.name}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded transition-all duration-200 ${
                        formData.name.length > 0
                          ? "border-green-800 bg-green-100/30"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-green-500`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.dark }}>
                      {adFormPt1.price}
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded transition-all duration-200 ${
                        formData.price.length > 0
                          ? !isNaN(Number(formData.price)) && formData.price.trim() !== ""
                            ? "border-green-800 bg-green-100/30"
                            : "border-red-800 bg-red-100/30"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-green-500`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.dark }}>
                      {adFormPt1.available}
                    </label>
                    <input
                      type="text"
                      name="available_date"
                      value={formData.available_date}
                      onChange={handleChange}
                      placeholder="MM/DD/YYYY"
                      className={`w-full p-2 border rounded transition-all duration-200 ${
                        formData.available_date.length > 0
                          ? pattern.test(formData.available_date)
                            ? "border-green-800 bg-green-100/30"
                            : "border-red-800 bg-red-100/30"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-green-500`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.dark }}>
                      {adFormPt1.quantity}
                    </label>
                    <input
                      type="text"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded transition-all duration-200 ${
                        formData.quantity.length > 0
                          ? !isNaN(Number(formData.quantity)) && formData.quantity.trim() !== ""
                            ? "border-green-800 bg-green-100/30"
                            : "border-red-800 bg-red-100/30"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-green-500`}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.dark }}>
                    {adFormPt1.description}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded transition-all duration-200 ${
                      formData.description.length > 0
                        ? "border-green-800 bg-green-100/30"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-green-500`}
                    rows="4"
                  />
                </div>
              </details>

              {/* Location Details Section */}
              <details className="bg-white rounded-lg shadow-md overflow-hidden">
                <summary className="p-6 cursor-pointer text-lg font-semibold select-none" style={{ color: colors.dark }}>
                  {adFormPt1.locationInfo + "*"}
                </summary>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.dark }}>
                      {adFormPt1.location}
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full p-2 border rounded transition-all duration-200 border-gray-300 focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">{adFormPt1.selectDistrict}</option>
                      {Object.keys(districtCityMap).map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.dark }}>
                      {adFormPt1.selectCity}
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full p-2 border rounded transition-all duration-200 border-gray-300 focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">{adFormPt1.selectCity}</option>
                      {districtCityMap[formData.district]?.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.dark }}>
                      {adFormPt1.street}
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded transition-all duration-200 ${
                        formData.street.length > 0
                          ? "border-green-800 bg-green-100/30"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-green-500`}
                    />
                  </div>
                </div>
              </details>

              {/* Target Audience Section */}
              <details className="bg-white rounded-lg shadow-md overflow-hidden">
                <summary className="p-6 cursor-pointer text-lg font-semibold select-none" style={{ color: colors.dark }}>
                  {adFormPt1.targetInfo +"*"}
                </summary>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.dark }}>
                      {adFormPt1.lookingFor}
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        name="min_age"
                        value={formData.min_age}
                        onChange={handleChange}
                        placeholder={adFormPt1.age}
                        className={`w-1/2 p-2 border rounded transition-all duration-200 ${
                          formData.min_age.length > 0
                            ? !isNaN(Number(formData.min_age)) && formData.min_age.trim() !== ""
                              ? "border-green-800 bg-green-100/30"
                              : "border-red-800 bg-red-100/30"
                            : "border-gray-300"
                        } focus:ring-2 focus:ring-green-500`}
                      />
                      <span className="self-center">to</span>
                      <input
                        type="text"
                        name="max_age"
                        value={formData.max_age}
                        onChange={handleChange}
                        placeholder={adFormPt1.age}
                        className={`w-1/2 p-2 border rounded transition-all duration-200 ${
                          formData.max_age.length > 0
                            ? !isNaN(Number(formData.max_age)) && formData.max_age.trim() !== ""
                              ? "border-green-800 bg-green-100/30"
                              : "border-red-800 bg-red-100/30"
                            : "border-gray-300"
                        } focus:ring-2 focus:ring-green-500`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.dark }}>
                      {adFormPt1.gender}
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-2 border rounded transition-all duration-200 border-gray-300 focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Indifferent">{adFormPt1.indifferent}</option>
                      <option value="Male">{adFormPt1.male}</option>
                      <option value="Female">{adFormPt1.female}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.dark }}>
                      {adFormPt1.couples}
                    </label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleButtonChanges("Yes", "marital_status")}
                        className={`px-4 py-2 rounded transition-all duration-200 ${
                          formData.marital_status === "Yes"
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {adFormPt1.yes}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleButtonChanges("No", "marital_status")}
                        className={`px-4 py-2 rounded transition-all duration-200 ${
                          formData.marital_status === "No"
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {adFormPt1.no}
                      </button>
                    </div>
                  </div>
                </div>
              </details>

              {/* Accommodation Details Section */}
              <details className="bg-white rounded-lg shadow-md overflow-hidden">
                <summary className="p-6 cursor-pointer text-lg font-semibold select-none" style={{ color: colors.dark }}>
                  {adFormPt1.accommodationDetails +"*"}
                </summary>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.dark }}>
                      {adFormPt1.expenses}
                    </label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleButtonChanges("Yes", "expense_included")}
                        className={`px-4 py-2 rounded transition-all duration-200 ${
                          formData.expense_included === "Yes"
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {adFormPt1.yes}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleButtonChanges("No", "expense_included")}
                        className={`px-4 py-2 rounded transition-all duration-200 ${
                          formData.expense_included === "No"
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {adFormPt1.no}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.dark }}>
                      {adFormPt1.bathroom}
                    </label>
                    <select
                      name="bath_share"
                      value={formData.bath_share}
                      onChange={handleChange}
                      className="w-full p-2 border rounded transition-all duration-200 border-gray-300 focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Shared">{adFormPt1.shared}</option>
                      <option value="Private">{adFormPt1.private}</option>
                    </select>
                  </div>
                </div>
              </details>

              {/* Tags Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4" style={{ color: colors.dark }}>
                  Tags
                </h2>
                <button
                  type="button"
                  onClick={openTagModal}
                  className="w-full p-2 rounded transition-all duration-200 border"
                  style={{
                    backgroundColor: colors.white,
                    color: colors.secondary,
                    borderColor: colors.secondary,
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = colors.light)}
                  onMouseOut={(e) => (e.target.style.backgroundColor = colors.white)}
                >
                  {adFormPt1.addTags}
                </button>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.length > 0 ? (
                    formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm cursor-pointer hover:bg-gray-300 transition-all duration-200"
                        onClick={() => handleRemoveTags(index)}
                      >
                        {tag} ✕
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No tags added</p>
                  )}
                </div>
                <div className="mt-4 flex justify-between">
                  {!adId ? (
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 rounded cursor-pointer bg-gray-300 border-2 border-gray-800 hover:bg-gray-500 hover:text-white transition-all duration-200"
                    >
                      <span className="text-lg">⟲</span> {adFormPt1.clearAll}
                    </button>
                  ) : (
                    <div></div>
                  )}
                  <button
                    onClick={handleDataEntry}
                    className="px-4 py-2 rounded border-2 cursor-pointer transition-colors duration-200"
                    style={{
                      backgroundColor: colors.light,
                      borderColor: colors.success,
                      color: colors.dark,
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = colors.success)
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = colors.light)
                    }
                  >
                    {adFormPt1.continue}
                  </button>
                </div>
              </div>

              {/* Tag Input Modal */}
              {isTagModalOpen && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 transition-opacity duration-200">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                    <h2 className="text-lg font-semibold mb-4" style={{ color: colors.dark }}>
                      {adFormPt1.addTags}
                    </h2>
                    <div className="flex space-x-2 mb-4">
                      <input
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyDown={(e)=>{
                          if (e.key==="Enter") handleAddTag();
                      }}
                        placeholder={adFormPt1.enterTags}
                        className="w-full p-2 border rounded transition-all duration-200 border-gray-300 focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        type="button"
                        onClick={()=>handleAddTag()}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-200"
                      >
                        {adFormPt1.add}
                      </button>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-2" style={{ color: colors.dark }}>
                        {adFormPt1.currentTags}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.length > 0 ? (
                          formData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm cursor-pointer hover:bg-gray-300 transition-all duration-200"
                              onClick={() => handleRemoveTags(index)}
                            >
                              {tag} ✕
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No tags added yet</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={closeTagModal}
                      className="w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-all duration-200"
                    >
                      {adFormPt1.done}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

{activeTab === "confirm" && (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white shadow rounded-lg">
      {/* Left Column */}
      <div className="space-y-4">
        {/* Image */}
        <div className="rounded border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Form</h3>
          <div className="w-full h-40 border-2 border-dashed border-gray-300 flex items-center justify-center bg-white rounded">
            {formData.image ? (
              <img
                src={
                  typeof formData.image === "string"
                    ? formData.image
                    : URL.createObjectURL(formData.image)
                }
                alt="Preview"
                className="h-full object-cover rounded"
              />
            ) : (
              <span className="text-gray-400">No image uploaded</span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="rounded border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            {adFormPt1.description}
          </h3>
          <p className="text-sm text-gray-800">
            {formData.description || "No description provided"}
          </p>
        </div>

        {/* Location */}
        <div className="rounded border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            {adFormPt1.location}
          </h3>
          <div className="flex gap-2">
            <p className="w-1/2 text-sm bg-white border border-gray-300 p-2 rounded">
              {formData.district || "No district selected"}
            </p>
            <p className="w-1/2 text-sm bg-white border border-gray-300 p-2 rounded">
              {formData.city || "No municipality selected"}
            </p>
          </div>
        </div>

        {/* Target Audience */}
        <div className="rounded border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            {adFormPt1.lookingFor}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm bg-white border p-2 rounded w-1/2 text-center">
              {formData.min_age || "N/A"}
            </span>
            <span className="text-sm text-gray-500">to</span>
            <span className="text-sm bg-white border p-2 rounded w-1/2 text-center">
              {formData.max_age || "N/A"}
            </span>
          </div>
        </div>

        {/* Marital Status */}
        <div className="rounded border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            {adFormPt1.couples}
          </h3>
          <p className="text-sm bg-white border p-2 rounded">
            {formData.marital_status || "Not specified"}
          </p>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        {/* Name */}
        <div className="rounded border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            {adFormPt1.name}
          </h3>
          <p className="text-sm bg-white border p-2 rounded">
            {formData.name || "No name provided"}
          </p>
        </div>

        {/* Available Date & Price */}
        <div className="rounded border border-gray-200 bg-gray-50 p-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">
                {adFormPt1.available}
              </h3>
              <p className="text-sm bg-white border p-2 rounded">
                {formData.available_date || "No date provided"}
              </p>
            </div>
            <div className="w-1/2">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">
                {adFormPt1.price}
              </h3>
              <p className="text-sm bg-white border p-2 rounded">
                {formData.price || "No price provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Gender & Room Number */}
        <div className="rounded border border-gray-200 bg-gray-50 p-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">
                {adFormPt1.gender}
              </h3>
              <p className="text-sm bg-white border p-2 rounded">
                {formData.gender || "Not specified"}
              </p>
            </div>
            <div className="w-1/2">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">
                {adFormPt1.quantity}
              </h3>
              <p className="text-sm bg-white border p-2 rounded">
                {formData.quantity || "No room number provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Street */}
        <div className="rounded border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            {adFormPt1.street}
          </h3>
          <p className="text-sm bg-white border p-2 rounded">
            {formData.street || "No street provided"}
          </p>
        </div>

        {/* Expenses Included */}
        <div className="rounded border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            {adFormPt1.expenses}
          </h3>
          <p className="text-sm bg-white border p-2 rounded">
            {formData.expense_included || "Not specified"}
          </p>
        </div>

        {/* Bathroom Sharing */}
        <div className="rounded border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            {adFormPt1.bathroom}
          </h3>
          <p className="text-sm bg-white border p-2 rounded">
            {formData.bath_share || "Not specified"}
          </p>
        </div>
      </div>
    </div>

    {/* Tags */}
    <div className="mt-4 p-4 bg-white rounded shadow border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
      {formData.tags?.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No tags added</p>
      )}
    </div>

    {/* Navigation Buttons */}
    <div className="mt-6 flex justify-between">
      <button
        onClick={() => setActiveTab("enter")}
        className="px-4 py-2 cursor-pointer rounded border-2 text-sm font-medium transition-colors duration-200"
        style={{
          backgroundColor: colors.light,
          borderColor: colors.warning,
          color: colors.dark,
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = colors.warning)}
        onMouseOut={(e) => (e.target.style.backgroundColor = colors.light)}
      >
        {adFormPt3.goBack}
      </button>
      <button
        onClick={() => setActiveTab("submit")}
        className="px-4 cursor-pointer py-2 rounded border-2 text-sm font-medium transition-colors duration-200"
        style={{
          backgroundColor: colors.light,
          borderColor: colors.success,
          color: colors.dark,
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = colors.success)}
        onMouseOut={(e) => (e.target.style.backgroundColor = colors.light)}
      >
        {adFormPt1.continue}
      </button>
    </div>
  </>
)}

            {activeTab === "submit" && (
              <div className="flex flex-col items-center space-y-4 border-2 border-black-20 p-2 rounded" style={{backgroundColor: colors.light}}>
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
                        <h3 className="text-lg font-semibold">
                          {formData.name}
                        </h3>
                        <p className="text-sm text-gray-600 overflow-hidden text-ellipsis max-w-[330px] whitespace-nowrap">                          {formData.description}
                        </p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-xl font-semibold text-gray-800">
                          {formData.price}€
                        </p>
                        <a
                          href="#"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Sr. Danilo
                        </a>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.slice(0, 5).map((tag, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 px-3 py-1 text-xs rounded-full border"
                        >
                          {tag}
                        </span>
                      ))}
                      {formData.tags.length > 5 && (
                        <span className="bg-gray-100 px-3 py-1 text-xs rounded-full border">
                          {formData.tags.length - 5}+
                        </span>
                      )}
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

                <h2 className="text-xl font-semibold">
                  {adFormPt3.readyMessage}
                </h2>

                {/* Buttons on opposite ends */}
                <div className="w-full flex justify-between px-4">
                  <button
                    onClick={() => setActiveTab("confirm")}
                    className="px-4 py-2 rounded border-2 cursor-pointer transition-colors duration-200"
                    style={{
                      backgroundColor: colors.light,
                      borderColor: colors.warning,
                      color: colors.dark,
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = colors.warning)
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = colors.light)
                    }
                  >
                    {adFormPt3.goBack}
                  </button>

                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 rounded border-2 cursor-pointer transition-colors duration-200"
                    style={{
                      backgroundColor: colors.light,
                      borderColor: colors.success,
                      color: colors.dark,
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = colors.success)
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = colors.light)
                    }
                  >
                    {adFormPt3.submit}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdFormPage;
