import { useState,useEffect } from 'react'
import { useAuth } from "../AuthContext";
import '../index.css'
import '../App.css'
import { showToast } from '../components/Toasts/ToastMessages';
import { useToast } from '../components/Toasts/ToastService';
import { useNavigate } from 'react-router-dom';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaTrashAlt,FaShareAlt,FaHeart,FaSortAmountUpAlt,FaSortAmountDown} from "react-icons/fa";
import { FiEdit, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi'
import { PiEyeFill } from "react-icons/pi";
import { GiSightDisabled } from "react-icons/gi";
import { useTranslation } from "react-i18next";
import { colors } from "../utils/colors";

const ip = "127.0.0.1";
const port = 5000;

function MyAds() {
  const toast = useToast();
  const navigate = useNavigate();
  const email = localStorage.getItem("landlordEmail")
  const [roomData,setRoomData] = useState([]);
  const [search,setSearch] = useState("");
  const [copyRoomData,setCopyRoomData] = useState([]);
  const [disabledRoomData,setdisabledRoomData] = useState([]);
  const [copydisabledRoomData,setCopydisabledRoomData] = useState([]);
  const [temp,setTemp] = useState([]);
  const [order, setOrder] = useState(localStorage.getItem('order') || 'ascending');
  const {t} = useTranslation();
  const myads = t("myads");

  useEffect(() => {
    const msg = localStorage.getItem("toastSuccess");
    if (msg) {
      const parsed = JSON.parse(msg);
      showToast(toast, {
        type: parsed.type,
        header: parsed.header,
        message: parsed.message
      });
      localStorage.removeItem("toastSuccess");  // Remove the item after it's used
    }
    const fetchAds = async () => {
      try {
        const res = await fetch("http://localhost:5000/ads/");
        const data = await res.json();
        setRoomData(data); // data is an array of ad objects
        setCopyRoomData(data)

        const res2 = await fetch("http://localhost:5000/disabled_ads/");
        const data2 = await res2.json();
        setdisabledRoomData(data2); // data is an array of ad objects
        setCopydisabledRoomData(data2)
      } catch (err) {
        console.error("Failed to fetch ads:", err);
      }
    };
  
    fetchAds();
  }, []); 
  

  const handleLogin = () => {
    localStorage.removeItem("edit")
    navigate("/form")
  };

  const handleEdit = (id) =>{
    localStorage.setItem("edit",id);
    navigate("/form")
  };

  const handleDisable = async (adhc) =>{
    try {
      const response = await fetch(`http://${ip}:${port}/disable_ad/${adhc}`, {
        method: "POST",
      });

      if (response.ok) {
        localStorage.setItem("toastSuccess", JSON.stringify({
          type: "success",
          header: `${myads.modalTitle1}`,
          message: `${myads.modalVariation3}`
        }));
      } else {
        // Handle the case when the response is not successful
        localStorage.setItem("toastSuccess", JSON.stringify({
          type: "error",
          header: `${myads.modalTitle2}`,
          message: `${myads.modalVariation3}`
        }));
      }
    } catch (error) {
      // Handle error if fetch fails
      localStorage.setItem("toastSuccess", JSON.stringify({
        type: "error",
        header: `${myads.modalTitle2}`,
        message: `${myads.modalVariation3}`
      }));
    }
  }

  const handleEnable = async (adhc) =>{
    try {
      const response = await fetch(`http://${ip}:${port}/enable_ad/${adhc}`, {
        method: "POST",
      });

      if (response.ok) {
        localStorage.setItem("toastSuccess", JSON.stringify({
          type: "success",
          header: `${myads.modalTitle1}`,
          message: `${myads.modalVariation3}`
        }));
      } else {
        // Handle the case when the response is not successful
        localStorage.setItem("toastSuccess", JSON.stringify({
          type: "error",
          header: `${myads.modalTitle2}`,
          message: `${myads.modalVariation3}`
        }));
      }
    } catch (error) {
      // Handle error if fetch fails
      localStorage.setItem("toastSuccess", JSON.stringify({
        type: "error",
        header: `${myads.modalTitle2}`,
        message: `${myads.modalVariation3}`
      }));
    }
  }

  const handleRemove = async (adhc) =>{
    try {
      const response = await fetch(`http://${ip}:${port}/delete_ad/${adhc}`, {
        method: "DELETE",
      });

      if (response.ok) {
        localStorage.setItem("toastSuccess", JSON.stringify({
          type: "success",
          header: `${myads.modalTitle1}`,
          message: `${myads.modalVariation1}`
        }));
      } else {
        // Handle the case when the response is not successful
        localStorage.setItem("toastSuccess", JSON.stringify({
          type: "error",
          header: `${myads.modalTitle2}`,
          message: `${myads.modalVariation2}`
        }));
      }
    } catch (error) {
      // Handle error if fetch fails
      localStorage.setItem("toastSuccess", JSON.stringify({
        type: "error",
        header: `${myads.modalTitle2}`,
        message: `${myads.modalVariation2}`
      }));
    }
  };

  useEffect(() => {
    console.log("Updated copyRoomData:", copyRoomData);
  }, [copyRoomData]);

  useEffect(() => {
    console.log("Updated copyRoomData:", disabledRoomData);
  }, [disabledRoomData]);

  const handleChange = (e) => {
    const {name,value} = e.target;

    if (name=="search") setSearch(value)
  }

  const handleClick = (type) => {
    let sortedData = [...copyRoomData]; // Always start with a fresh copy
    let newTemp = [...copyRoomData]; // Store current state for reverting
    const order = localStorage.getItem("order") || "ascending";
    const currentSortedType = localStorage.getItem("sorted"); // Get current sorted type
  
    if (type === "search") {
      localStorage.removeItem("sorted");
      setTemp(roomData); // Reset temp to full dataset
      const result = roomData.filter((element) =>
        element.name.toLowerCase().includes(search.toLowerCase())
      );
      setCopyRoomData(result.length > 0 ? result : roomData);
    } else if (type === "price") {
      if (currentSortedType === "price") {
        localStorage.removeItem("sorted");
        setCopyRoomData(temp); // Revert to previous state
      } else {
        localStorage.setItem("sorted", "price");
        sortedData.sort((a, b) =>
          order === "ascending" ? a.price - b.price : b.price - a.price
        );
        setTemp(newTemp); // Save current state
        setCopyRoomData(sortedData);
      }
    } else if (type === "LastEdited") {
      if (currentSortedType === "LastEdited") {
        localStorage.removeItem("sorted");
        setCopyRoomData(temp);
      } else {
        localStorage.setItem("sorted", "LastEdited");
        sortedData.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return order === "ascending" ? dateA - dateB : dateB - dateA;
        });
        setTemp(newTemp);
        setCopyRoomData(sortedData);
      }
    } else if (type === "Location") {
      if (currentSortedType === "Location") {
        localStorage.removeItem("sorted");
        setCopyRoomData(temp);
      } else {
        localStorage.setItem("sorted", "Location");
        sortedData.sort((a, b) => {
          const compareDistrict = a.district.localeCompare(b.district);
          const compareCity = a.city.localeCompare(b.city);
          if (order === "ascending") {
            return compareDistrict !== 0 ? compareDistrict : compareCity;
          } else {
            return compareDistrict !== 0 ? -compareDistrict : -compareCity;
          }
        });
        setTemp(newTemp);
        setCopyRoomData(sortedData);
      }
    } else if (type === "order") {
      const newOrder = order === "descending" ? "ascending" : "descending";
      localStorage.setItem("order", newOrder);
      setOrder(newOrder);
  
      // Reapply sorting based on the current sorted type
      if (currentSortedType) {
        sortedData = [...copyRoomData]; // Start with current data
        if (currentSortedType === "price") {
          sortedData.sort((a, b) =>
            newOrder === "ascending" ? a.price - b.price : b.price - a.price
          );
        } else if (currentSortedType === "LastEdited") {
          sortedData.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return newOrder === "ascending" ? dateA - dateB : dateB - dateA;
          });
        } else if (currentSortedType === "Location") {
          sortedData.sort((a, b) => {
            const compareDistrict = a.district.localeCompare(b.district);
            const compareCity = a.city.localeCompare(b.city);
            if (newOrder === "ascending") {
              return compareDistrict !== 0 ? compareDistrict : compareCity;
            } else {
              return compareDistrict !== 0 ? -compareDistrict : -compareCity;
            }
          });
        }
        setCopyRoomData(sortedData);
      }
    } else {
      localStorage.setItem("sorted", "true");
      setSorted(true);
    }
  };


  return (<>
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: colors.light }}>
      <button
  onClick={handleLogin}
  className=" w-1/2 max-w-2xl flex items-center justify-center gap-2 px-4 py-2
             text-white rounded transition-colors duration-200 
             cursor-pointer text-base sm:text-lg md:text-xl mb-5 shadow-md"
  style={{ backgroundColor: colors.primary, border: `2px solid ${colors.secondary}` }}
>
  <span className="text-2xl sm:text-3xl md:text-4xl leading-none font-semibold">+</span>
  <span className="text-xl sm:text-2xl md:text-3xl leading-none font-semibold">{myads.newAd}</span>
</button>

  <div className="w-full max-w-4xl rounded-lg flex space-y-2 md:space-y-0 md:flex-row flex-col justify-items-center items-center
 md:justify-between px-1">
    <div className="flex">
      <input type='text' name="search" placeholder={myads.search} autoComplete='on' onChange={handleChange} 
             className='border-1 rounded' style={{ backgroundColor: colors.white, borderColor: colors.secondary }}></input>
      <button className="px-4 py-1 rounded right-4 cursor-pointer text-white"
              style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.primary}` }}
              onClick={() => handleClick("search")}><FaMagnifyingGlass /></button>
    </div>
    <div className="flex items-center">
            <p className='mr-1 text-sm sm:text-md'>{myads.orderedBy}</p>
            <button
              className={`px-3 py-1 border-t-2 border-l-2 border-b-2 rounded-l cursor-pointer text-sm`}
              style={{ 
                backgroundColor: localStorage.getItem("sorted")==="price" ? colors.secondary : colors.light,
                borderColor: colors.secondary,
                color: localStorage.getItem("sorted")==="price" ? colors.white : colors.dark
              }}
              onClick={() => handleClick("price")}
            >
              {myads.price}
            </button>
            <button
              className={`px-3 py-1 border-t-2 border-b-2 cursor-pointer text-sm`}
              style={{ 
                backgroundColor: localStorage.getItem("sorted")==="Location" ? colors.secondary : colors.light,
                borderColor: colors.secondary,
                color: localStorage.getItem("sorted")==="Location" ? colors.white : colors.dark
              }}
              onClick={() => handleClick("Location")}
            >
              {myads.location}
            </button>
            <button
              className={`px-3 py-1 border-t-2 border-b-2 border-r-2 rounded-r cursor-pointer text-sm`}
              style={{ 
                backgroundColor: localStorage.getItem("sorted")==="LastEdited" ? colors.secondary : colors.light,
                borderColor: colors.secondary,
                color: localStorage.getItem("sorted")==="LastEdited" ? colors.white : colors.dark
              }}
              onClick={() => handleClick("LastEdited")}
            >
              {myads.lastEdited}
            </button>
            <button
              className={`px-2 ml-2 py-1 border-2 rounded cursor-pointer`}
              style={{ 
                backgroundColor: localStorage.getItem("sorted") ? colors.secondary : colors.light,
                borderColor: colors.secondary,
                color: localStorage.getItem("sorted") ? colors.white : colors.dark
              }}
              onClick={() => handleClick("order")}
            >
            {order === 'descending' ? <FaSortAmountDown /> : <FaSortAmountUpAlt />}               
            </button>
            
          </div>
  </div>
      <div className="w-full max-w-4xl shadow-md rounded-t-lg pl-4 pr-4 pb-4 pt-2" style={{ backgroundColor: colors.light }}>
        <p><b>{myads.enabledTitle + " ("+copyRoomData.length+")"}</b></p>
        <div className="w-full max-w-4xl border-2 p-2 shadow-md rounded-lg h-[540px] md:h-[350px] overflow-y-auto"
             style={{ backgroundColor: colors.light, borderColor: colors.primary }}>        

        {copyRoomData.map((ad,index)=>(
          <div key={index} className="flex flex-col md:flex-row w-full max-w-4xl mx-auto shadow-md rounded-lg overflow-hidden md:h-48 mb-3 border-1"
               style={{ backgroundColor: colors.white, borderColor: colors.secondary }}>
                          <img
                            src={ad.image_url}
                            alt="Room"
                            className="w-full md:w-1/3 h-64 md:h-full object-cover border-2 md:rounded-none rounded-t"
                          />
          
                          <div className="w-full md:w-2/3  p-4 flex flex-col justify-between">
                            {/* Header Row */}
                            <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                              <div className='w-4/6'>
                                <h3 className="text-lg font-semibold whitespace-nowrap">{ad.name}</h3>
                                <p className="text-sm text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">{ad.description}</p>
                              </div>
                              <div className="w-2/6">
                                <p className="text-xl font-semibold text-gray-800 flex items-center w-full justify-start md:justify-end">
                                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">{ad.price}</span>
                                  <span className="ml-1">€</span>
                                </p>

                                <a href="/profile/landlord" className="text-sm text-blue-600 hover:underline block text-left md:text-right overflow-hidden text-ellipsis whitespace-nowrap">
                                  Sr. Danilo
                                </a>
                              </div>
                            </div>
          
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mt-2">
                              {ad.tags.slice(0, 5).map((tag, i) => (
                                <span key={i} className="bg-gray-100 px-3 py-1 text-xs rounded-full border">{tag}</span>
                              ))}
                              {ad.tags.length >5 && (<span className="bg-gray-100 px-3 py-1 text-xs rounded-full border">{ad.tags.length-5}+</span>)}
                            </div>
          
                            {/* Action Icons */}
                            <div className="flex gap-3 justify-end mt-2">
                              <button
                                className="p-2 border rounded transition-colors duration-200 cursor-pointer flex items-center gap-2"
                                style={{ borderColor: colors.secondary }}
                                onClick={() => handleDisable(ad.image_path.split("/")[1].split(".")[0])}
                                onMouseOver={(e) => e.target.style.backgroundColor = colors.light}
                                onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
                              >
                                <GiSightDisabled size={25} className="inline-flex align-middle" style={{ color: colors.warning }} />
                                <span className="inline-flex align-middle">{myads.disable}</span>
                              </button>
                    
                            <button
                              className="p-2 border rounded transition-colors duration-200 cursor-pointer flex items-center gap-2"
                              style={{ borderColor: colors.secondary }}
                              onClick={() => handleEdit(ad.image_path.split("/")[1].split(".")[0])}
                              onMouseOver={(e) => e.target.style.backgroundColor = colors.light}
                              onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
                            >
                              <FiEdit size={25} className="inline-flex align-middle" style={{ color: colors.secondary }} />
                              <span className="inline-flex align-middle">{myads.edit}</span>
                            </button>
                            <button
                              className="p-2 border rounded transition-colors duration-200 cursor-pointer flex items-center gap-2"
                              style={{ borderColor: colors.secondary }}
                              onClick={() => handleRemove(ad.image_path.split("/")[1].split(".")[0])}
                              onMouseOver={(e) => e.target.style.backgroundColor = colors.light}
                              onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
                            >
                              <FaTrashAlt size={25} className="inline-flex align-middle" style={{ color: colors.warning }} />
                              <span className="inline-flex align-middle">{myads.delete}</span>
                            </button>
                            </div>

                          </div>
                        </div>
        ))}
        </div>
      </div>
      <div className="w-full max-w-4xl shadow-md rounded-b-lg pl-4 pr-4 pb-4" style={{ backgroundColor: colors.light }}>
        <p><b>{myads.disabledTitle + " ("+disabledRoomData.length+")"}</b></p>
        <div className="w-full max-w-4xl border-2 p-2 shadow-md rounded-lg h-[540px] md:h-[250px] overflow-y-auto"
             style={{ backgroundColor: colors.light, borderColor: colors.primary }}>        

        {disabledRoomData.map((ad,index)=>(
          <div key={index} className="flex flex-col md:flex-row w-full max-w-4xl mx-auto shadow-md rounded-lg overflow-hidden md:h-48 mb-3 border-1 opacity-65"
               style={{ backgroundColor: colors.white, borderColor: colors.secondary }}>
                          <img
                            src={ad.image_url}
                            alt="Room"
                            className="w-full md:w-1/3 h-64 md:h-full object-cover border-2 md:rounded-none rounded-t"
                          />
          
                          <div className="w-full md:w-2/3 p-4 flex flex-col justify-between">
                            {/* Header Row */}
                            <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                              <div className='w-4/6'>
                                <h3 className="text-lg font-semibold whitespace-nowrap">{ad.name}</h3>
                                <p className="text-sm text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">{ad.description}</p>
                              </div>
                              <div className="w-2/6">
                                <p className="text-xl font-semibold text-gray-800 flex items-center w-full justify-start md:justify-end">
                                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">{ad.price}</span>
                                  <span className="ml-1">€</span>
                                </p>

                                <a href="/profile/landlord" className="text-sm text-blue-600 hover:underline block text-left md:text-right overflow-hidden text-ellipsis whitespace-nowrap">
                                  Sr. Danilo
                                </a>
                              </div>
                            </div>
          
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mt-2">
                              {ad.tags.slice(0, 5).map((tag, i) => (
                                <span key={i} className="bg-gray-100 px-3 py-1 text-xs rounded-full border">{tag}</span>
                              ))}
                              {ad.tags.length >5 && (<span className="bg-gray-100 px-3 py-1 text-xs rounded-full border">{ad.tags.length-5}+</span>)}
                            </div>
          
                            {/* Action Icons */}
                            <div className="flex gap-3 justify-end mt-2">
                              <button
                                className="p-2 border rounded transition-colors duration-200 cursor-pointer flex items-center gap-2"
                                style={{ borderColor: colors.secondary }}
                                onClick={() => handleEnable(ad.image_path.split("/")[1].split(".")[0])}
                                onMouseOver={(e) => e.target.style.backgroundColor = colors.light}
                                onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
                              >
                                <PiEyeFill size={25} className="inline-flex align-middle" style={{ color: colors.success }} />
                                <span className="inline-flex align-middle">{myads.enable}</span>
                              </button> 
                            </div>
                          </div>
                        </div>
        ))}
        </div>
      </div>
    </div>
  </>




  )
}

export default MyAds