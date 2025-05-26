import { useState } from "react";
import { FiInfo } from "react-icons/fi";
import { LuMessageCircleMore } from "react-icons/lu";
import { FaHeart, FaShareAlt } from "react-icons/fa";

const PaginatedAds = ({ copyRoomData, adsPage, userType, handleInfo, handleMessage, handleFavourite, handleShare }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const totalPages = Math.ceil(copyRoomData.length / itemsPerPage);
  const paginatedData = copyRoomData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full border border-gray-200 rounded-lg p-2 bg-white">
      {paginatedData.map((ad, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row w-full mx-auto bg-white shadow-md rounded-lg overflow-hidden md:h-52 mb-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="w-full md:w-1/3 bg-blue-50">
            <img
              src={ad.image_url}
              alt="Room"
              className="w-full h-64 md:h-full object-cover"
            />
          </div>

          <div className="w-full md:w-2/3 p-4 flex flex-col justify-between">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-2">
              <div className="w-4/6">
                <h3 className="text-lg font-semibold text-blue-800 whitespace-nowrap">
                  {ad.name}
                </h3>
                <p className="text-sm text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
                  {ad.description}
                </p>
              </div>
              <div className="w-2/6">
                <p className="text-xl font-bold text-blue-700 flex items-center w-full justify-start md:justify-end">
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {ad.price}
                  </span>
                  <span className="ml-1">€</span>
                </p>
                <a
                  href="/profile/landlord"
                  className="text-sm text-blue-600 hover:underline block text-left md:text-right overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  Sr. Danilo
                </a>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {ad.tags.slice(0, 5).map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-50 px-3 py-1 text-xs rounded-full border border-blue-200 text-blue-700"
                >
                  {tag}
                </span>
              ))}
              {ad.tags.length > 5 && (
                <span className="bg-blue-50 px-3 py-1 text-xs rounded-full border border-blue-200 text-blue-700">
                  {ad.tags.length - 5}+
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end mt-2">
              <button
                className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 flex items-center gap-2"
                onClick={() =>
                  handleInfo(ad.image_path.split("/")[1].split(".")[0])
                }
              >
                <FiInfo size={20} className="text-blue-600" />
                <span className="font-medium">{adsPage.details}</span>
              </button>

              <button
                className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-green-50 hover:text-green-600 hover:border-green-300 transition-all duration-200 flex items-center gap-2"
                onClick={(e) => handleMessage(e)}
              >
                <LuMessageCircleMore size={20} className="text-green-600" />
                <span className="font-medium">{adsPage.message}</span>
              </button>

              <button
                className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all duration-200 flex items-center gap-2"
                onClick={() => handleFavourite()}
              >
                <FaHeart size={20} className="text-red-500" />
                <span className="font-medium">{adsPage.favorite}</span>
              </button>

              <button
                className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200 flex items-center gap-2"
                onClick={() =>
                  userType !== "guest" &&
                  userType &&
                  handleShare(ad.image_path.split("/")[1].split(".")[0])
                }
              >
                <FaShareAlt size={20} className="text-indigo-500" />
                <span className="font-medium">
                  {userType ? adsPage.share : adsPage.mustLog}
                </span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="cursor-pointer px-3 py-1 bg-gray-100 border rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`cursor-pointer px-3 py-1 border rounded ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((p) => Math.min(totalPages, p + 1))
          }
          disabled={currentPage === totalPages}
          className="cursor-pointer px-3 py-1 bg-gray-100 border rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginatedAds;
