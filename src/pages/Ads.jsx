import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import "../index.css";
import "../App.css";
import { useTranslation } from "react-i18next";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaSortAmountUpAlt, FaSortAmountDown } from "react-icons/fa";
import { FaHeart, FaRegHeart, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { showToast } from "../components/Toasts/ToastMessages";
import { useToast } from "../components/Toasts/ToastService";
import { PiEyeFill } from "react-icons/pi";

const ip = "127.0.0.1";
const port = 5000;

function Ads() {
  const { t } = useTranslation();
  const { userType: currentUserType } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [ads, setAds] = useState([]);
  const [copyAds, setCopyAds] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(localStorage.getItem('order') || 'ascending');
  const [favorites, setFavorites] = useState([]);
  const adsTexts = t("adsPage");
  const texts = adsTexts;

  useEffect(() => {
      const fetchAds = async () => {
        try {
          const res = await fetch(`http://${ip}:${port}/ads`);
        
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const data = await res.json();

          // Process data if needed
          const processedData = data.map(ad => ({
            ...ad,
            tags: ad.tags || []  // Ensure tags exist
          }));

          setAds(processedData);
          setCopyAds(processedData);
          
          // Load user favorites if logged in
          if (currentUserType && currentUserType !== "guest") {
            try {
              const userEmail = localStorage.getItem("userEmail");
              const favRes = await fetch(`http://${ip}:${port}/favorites/${userEmail}`);
              if (favRes.ok) {
                const favData = await favRes.json();
                setFavorites(favData.map(fav => fav.adId));
              }
            } catch (favError) {
              console.error("Failed to fetch favorites:", favError);
            }
          }
        } catch (error) {
          console.error("Failed to fetch ads: ", error.message || error);
        }
      };

      // get ads
      fetchAds();
  }, [currentUserType]);

  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    setSearch(searchText);

    if (searchText === "") {
      setCopyAds(ads);
    } else {
      const filteredAds = ads.filter(
        (ad) =>
          ad.title?.toLowerCase().includes(searchText) ||
          ad.description?.toLowerCase().includes(searchText)
      );
      setCopyAds(filteredAds);
    }
  };

  const handleClick = (sortType) => {
    if (sortType === "order") {
      const newOrder = order === "ascending" ? "descending" : "ascending";
      setOrder(newOrder);
      localStorage.setItem("order", newOrder);
      return;
    }
    
    localStorage.setItem("sorted", sortType);
    
    const sortedAds = [...copyAds].sort((a, b) => {
      let comparison = 0;
      
      if (sortType === "Price") {
        comparison = parseFloat(a.price) - parseFloat(b.price);
      } else if (sortType === "Location") {
        comparison = a.location?.localeCompare(b.location) || 0;
      } else if (sortType === "LastEdited") {
        comparison = new Date(a.lastEdited) - new Date(b.lastEdited);
      }
      
      return order === "ascending" ? comparison : -comparison;
    });
    
    setCopyAds(sortedAds);
  };

  const handleFavorite = async (id) => {
    if (!currentUserType || currentUserType === "guest") {
      showToast(toast, {
        type: "info",
        header: texts.loginRequired,
        message: texts.loginToFavorite
      });
      return;
    }
    
    try {
      const userEmail = localStorage.getItem("userEmail");
      const method = favorites.includes(id) ? "DELETE" : "POST";
      
      const res = await fetch(`http://${ip}:${port}/favorites`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail, adId: id })
      });
      
      if (res.ok) {
        if (method === "POST") {
          setFavorites(prev => [...prev, id]);
          showToast(toast, {
            type: "success",
            header: texts.success,
            message: texts.addedToFavorites
          });
        } else {
          setFavorites(prev => prev.filter(favId => favId !== id));
          showToast(toast, {
            type: "info",
            header: texts.success,
            message: texts.removedFromFavorites
          });
        }
      }
    } catch (error) {
      console.error("Failed to update favorites:", error);
      showToast(toast, {
        type: "error",
        header: texts.error,
        message: texts.failedToUpdateFavorites
      });
    }
  };

  const handleViewDetails = (id) => {
    // Navigate to ad details
    navigate(`/ad/${id}`);
  };
  
  return (
    <>
      <div className="bg-gray-100 min-h-screen flex flex-col items-center pt-4">
        {/* Search Bar */}
        <div className="w-full max-w-4xl p-4 flex flex-col md:flex-row">
          <div className="relative flex-grow mb-2 md:mb-0">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="w-full p-2 pl-10 border border-gray-300 rounded-md"
              value={search}
              onChange={handleSearch}
            />
            <FaMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="flex items-center ml-0 md:ml-4 mt-2 md:mt-0">
            <button
              className={`px-3 py-1 border-2 border-r-0 rounded-l bg-gray-200 hover:bg-gray-300 cursor-pointer text-sm 
                ${localStorage.getItem("sorted")==="Price"?"bg-gray-300":"bg-gray-200"}`}
              onClick={() => handleClick("Price")}
            >
              {texts.price}
            </button>
            <button
              className={`px-3 py-1 border-t-2 border-b-2 bg-gray-200 hover:bg-gray-300 cursor-pointer text-sm 
                ${localStorage.getItem("sorted")==="Location"?"bg-gray-300":"bg-gray-200"}`}
              onClick={() => handleClick("Location")}
            >
              {texts.location}
            </button>
            <button
              className={`px-3 py-1 border-t-2 border-b-2 border-r-2 rounded-r bg-gray-200 hover:bg-gray-300 cursor-pointer text-sm 
                ${localStorage.getItem("sorted")==="LastEdited"?"bg-gray-300":"bg-gray-200"}`}
              onClick={() => handleClick("LastEdited")}
            >
              {texts.lastEdited}
            </button>
            <button
              className={`px-2 ml-2 py-1 border-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer
                ${localStorage.getItem("sorted")?"bg-gray-300":"bg-gray-200"}`}
              onClick={() => handleClick("order")}
            >
              {order === 'descending' ? <FaSortAmountDown /> : <FaSortAmountUpAlt />}               
            </button>
          </div>
        </div>

        {/* Ads Container */}
        <div className="w-full max-w-4xl bg-white shadow-md rounded-t-lg pl-4 pr-4 pb-4 pt-2">
          <p><b>{texts.availableAds || "Available Advertisements"}</b></p>
          <div className="w-full max-w-4xl border-1 p-2 bg-gray-100 shadow-md rounded-lg h-[540px] md:h-[410px] overflow-y-auto">   
            {copyAds && copyAds.length > 0 ? (
              copyAds.map((ad, index) => (
                <div key={index} className="flex flex-col md:flex-row w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden md:h-48 mb-3 border-gray-400 border-1">
                  <img
                    src={ad.image_url || "https://via.placeholder.com/300"}
                    alt="Room"
                    className="w-full md:w-1/3 h-64 md:h-full object-cover border-2 md:rounded-none rounded-t"
                  />
      
                  <div className="w-full md:w-2/3 p-4 flex flex-col justify-between">
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                      <div className='w-4/6'>
                        <h3 className="text-lg font-semibold overflow-hidden text-ellipsis whitespace-nowrap">{ad.title}</h3>
                        <p className="text-sm text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">{ad.description}</p>
                      </div>
                      <div className="w-2/6">
                        <p className="text-xl font-semibold text-gray-800 flex items-center w-full justify-start md:justify-end">
                          <span className="overflow-hidden text-ellipsis whitespace-nowrap">{ad.price}</span>
                          <span className="ml-1">€</span>
                        </p>

                        <a href={`/profile/${ad.landlordId}`} className="text-sm text-blue-600 hover:underline block text-left md:text-right overflow-hidden text-ellipsis whitespace-nowrap">
                          {ad.landlord || texts.landlord}
                        </a>
                      </div>
                    </div>
      
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {ad.tags && ad.tags.slice(0, 5).map((tag, i) => (
                        <span key={i} className="bg-gray-100 px-3 py-1 text-xs rounded-full border">{tag}</span>
                      ))}
                      {ad.tags && ad.tags.length > 5 && (
                        <span className="bg-gray-100 px-3 py-1 text-xs rounded-full border">{ad.tags.length-5}+</span>
                      )}
                    </div>
      
                    {/* Action Icons */}
                    <div className="flex gap-3 justify-end mt-2">
                      <button
                        className="p-2 border rounded hover:bg-gray-200 transition-colors duration-200 cursor-pointer flex items-center gap-2"
                        onClick={() => handleFavorite(ad.id)}
                      >
                        {favorites.includes(ad.id) ? (
                          <FaHeart size={20} className="inline-flex align-middle text-red-500" />
                        ) : (
                          <FaRegHeart size={20} className="inline-flex align-middle text-gray-500" />
                        )}
                        <span className="inline-flex align-middle">{favorites.includes(ad.id) ? texts.favorited : texts.favorite}</span>
                      </button>
                      <button
                        className="p-2 border rounded hover:bg-gray-200 transition-colors duration-200 cursor-pointer flex items-center gap-2"
                        onClick={() => handleViewDetails(ad.id)}
                      >
                        <PiEyeFill size={20} className="inline-flex align-middle" />
                        <span className="inline-flex align-middle">{texts.viewDetails}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-10">{texts.noAdsMessage}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Ads;