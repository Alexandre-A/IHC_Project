import React, { useState } from "react";
import Navbar from "../components/NavbarIncial"; // Adjust the import path based on your project structure

const ip = "127.0.0.1";
const port = 5000;

const AdFormPage = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    availableDate: "",
    gender: "Indifferent",
    quantity: "",
    description: "",
    district: "",
    city: "",
    street: "",
    minAge: "",
    maxAge: "",
    maritalStatus: "Yes",
    expenseIncluded: "None",
    bathShare: "Shared",
    tags: [],
    image: null,
  });

  const [currentTag, setCurrentTag] = useState("");
  const [activeTab, setActiveTab] = useState("enter");
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

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
    } else if (name === "bathShare") {
      updateTags(`Bathroom: ${value}`, "Bathroom: ");
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle button clicks for Expenses Included
  const handleexpenseIncludedChange = (value) => {
    updateTags(`Expenses: ${value}`, "Expenses: ");
    setFormData((prevFormData) => ({
      ...prevFormData,
      expenseIncluded: value,
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("email", "supreme_landlord@gmail.com");
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("date", formData.date);
    formDataToSend.append("image", formData.image);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("availableDate", formData.availableDate);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("quantity", formData.quantity);
    formDataToSend.append("district", formData.district);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("street", formData.street);
    formDataToSend.append("minAge", formData.minAge);
    formDataToSend.append("maxAge", formData.maxAge);
    formDataToSend.append("bathShare", formData.bathShare);
    formDataToSend.append("expenseIncluded", formData.expenseIncluded);
    formDataToSend.append("maritalStatus", formData.maritalStatus);
    formData.tags.forEach((tag) => formDataToSend.append("tags[]", tag));

    try {
      const response = await fetch(`http://${ip}:${port}/newAd`, {
        method: "POST",
        body: formDataToSend,
      });
      if (response.ok) {
        console.log("Form submitted successfully");
      } else {
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Open and close tag modal
  const openTagModal = () => setIsTagModalOpen(true);
  const closeTagModal = () => setIsTagModalOpen(false);

  // Navbar props
  const navbarProps = {
    texts: {
      forum: "Forum",
      messages: "Messages",
      adds: "Ads",
      myadds: "My Ads",
      profile: "Profile",
      settings: "Settings",
    },
    complete: true,
    links: {
      forum: "/forum",
      messages: "/messages",
      adds: "/adds",
      myadds: "/myadds",
      profile: "/profile",
      settings: "/settings",
    },
  };

  return (
    <div>
      <Navbar {...navbarProps} />

      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        {/* Main Content */}
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-4">
          {/* Tabs */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setActiveTab("enter")}
              className={`px-4 py-2 rounded ${
                activeTab === "enter" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Enter Data
            </button>
            <button
              onClick={() => setActiveTab("confirm")}
              className={`px-4 py-2 rounded ${
                activeTab === "confirm"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Confirm Data
            </button>
            <button
              onClick={() => setActiveTab("submit")}
              className={`px-4 py-2 rounded ${
                activeTab === "submit"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Submission
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
                  <div className="w-full h-32 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {formData.image ? (
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="Preview"
                        className="h-full object-cover"
                      />
                    ) : (
                      <label className="cursor-pointer">
                        <svg
                          className="w-8 h-8 text-gray-400"
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
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
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
                    className="w-full p-2 border rounded"
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
                      <option value="">District</option>
                      <option value="Lisbon">Lisbon</option>
                      <option value="Porto">Porto</option>
                      {/* Add more districts */}
                    </select>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-1/2 p-2 border rounded"
                    >
                      <option value="">Municipality</option>
                      <option value="Lisbon">Lisbon</option>
                      <option value="Porto">Porto</option>
                      {/* Add more cities */}
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
                      name="minAge"
                      value={formData.minAge}
                      onChange={handleChange}
                      placeholder="Age:"
                      className="w-1/2 p-2 border rounded"
                    />
                    <span className="self-center">to</span>
                    <input
                      type="text"
                      name="maxAge"
                      value={formData.maxAge}
                      onChange={handleChange}
                      placeholder="Age:"
                      className="w-1/2 p-2 border rounded"
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
                      onClick={() =>
                        setFormData({ ...formData, maritalStatus: "Yes" })
                      }
                      className={`px-4 py-2 rounded ${
                        formData.maritalStatus === "Yes"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, maritalStatus: "No" })
                      }
                      className={`px-4 py-2 rounded ${
                        formData.maritalStatus === "No"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
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
                    className="w-full p-2 border rounded"
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
                      name="availableDate"
                      value={formData.availableDate}
                      onChange={handleChange}
                      placeholder="MM/DD/YYYY"
                      className="w-full p-2 border rounded"
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
                      className="w-full p-2 border rounded"
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
                      className="w-full p-2 border rounded"
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
                    className="w-full p-2 border rounded"
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
                      onClick={() => handleexpenseIncludedChange("Yes")}
                      className={`px-4 py-2 rounded ${
                        formData.expenseIncluded === "Yes"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleexpenseIncludedChange("No")}
                      className={`px-4 py-2 rounded ${
                        formData.expenseIncluded === "No"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
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
                    name="bathShare"
                    value={formData.bathShare}
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
                  className="p-2 bg-blue-500 text-white rounded mb-2"
                >
                  Add Tags
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
              </div>

              {/* Tag Input Modal */}
              {isTagModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                        className="p-2 bg-blue-500 text-white rounded"
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
                            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm mr-2 mb-2"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500">No tags added yet</p>
                      )}
                    </div>
                    <button
                      onClick={closeTagModal}
                      className="w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
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
                        src={URL.createObjectURL(formData.image)}
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
                  <p className="w-full p-2 border rounded bg-gray-100">
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
                    <p className="w-1/2 p-2 border rounded bg-gray-100">
                      {formData.minAge || "No age specified"}
                    </p>
                    <span className="self-center">to</span>
                    <p className="w-1/2 p-2 border rounded bg-gray-100">
                      {formData.maxAge || "No age specified"}
                    </p>
                  </div>
                </div>

                {/* Marital Status */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Couples:
                  </label>
                  <p className="p-2 border rounded bg-gray-100">
                    {formData.maritalStatus}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <p className="w-full p-2 border rounded bg-gray-100">
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
                      {formData.availableDate || "No date provided"}
                    </p>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      Price
                    </label>
                    <p className="w-full p-2 border rounded bg-gray-100">
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
                    <p className="w-full p-2 border rounded bg-gray-100">
                      {formData.quantity || "No room number provided"}
                    </p>
                  </div>
                </div>

                {/* Street */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Street or Avenue
                  </label>
                  <p className="w-full p-2 border rounded bg-gray-100">
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
                    {formData.expenseIncluded}
                  </p>
                </div>

                {/* bath Share */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Bathroom:
                  </label>
                  <p className="w-full p-2 border rounded bg-gray-100">
                    {formData.bathShare}
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
            </div>
          )}

          {activeTab === "submit" && (
            <form onSubmit={handleSubmit} className="col-span-1 md:col-span-2">
              <button
                type="submit"
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdFormPage;
