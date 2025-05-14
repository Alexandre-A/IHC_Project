import { useState,useEffect } from 'react'
import { useAuth } from "../AuthContext";
import { useTranslation } from "react-i18next";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import {FiArchive, } from 'react-icons/fi'
import { LuArchiveRestore } from "react-icons/lu";
import { FaAngleUp,FaAngleDown } from "react-icons/fa";
import { FaSortAmountUpAlt,FaSortAmountDown} from "react-icons/fa";

import '../index.css'
import '../App.css'

const ip = "127.0.0.1";
const port = 5000;

function Messages() {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const {t} = useTranslation();
  const messages = t("messages");
  const isLandlord = userType === "landlord";
  const [order, setOrder] = useState(localStorage.getItem('order') || 'ascending');
  const [copyRoomData,setCopyRoomData] = useState([]);
  const [disabledRoomData,setdisabledRoomData] = useState([]);
  const [copydisabledRoomData,setCopydisabledRoomData] = useState([]);

  const [roomData,setRoomData] = useState([]);
  const [search,setSearch] = useState("");
  const [temp,setTemp] = useState([]);
  const [showAccounts, setShowAccounts] = useState(false);



  useEffect(() => {
      const fetchAds = async () => {
        try {
          const res = await fetch("http://localhost:5000/messages/");
          const data = await res.json();
          setRoomData(data); // data is an array of ad objects
          setCopyRoomData(data)
  
          const res2 = await fetch("http://localhost:5000/disabled_messages/");
          const data2 = await res2.json();
          setdisabledRoomData(data2); // data is an array of ad objects
          setCopydisabledRoomData(data2)
        } catch (err) {
          console.error("Failed to fetch ads:", err);
        }
      };
    
      fetchAds();
    }, []); 

    const handleDisable = async (adhc) =>{
      try {
        const response = await fetch(`http://${ip}:${port}/disable_message/${adhc}`, {
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
        const response = await fetch(`http://${ip}:${port}/enable_message/${adhc}`, {
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
      } else if (type === "Name") {
        if (currentSortedType === "Name") {
          localStorage.removeItem("sorted");
          setCopyRoomData(temp);
        } else {
          localStorage.setItem("sorted", "Name");
          sortedData.sort((a, b) => {
            const comparename = a.name.localeCompare(b.name);
            const compareLast = a.last_message.localeCompare(b.last_message);
            if (order === "ascending") {
              return comparename !== 0 ? comparename : compareLast;
            } else {
              return comparename !== 0 ? -comparename : -compareLast;
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
          if (currentSortedType === "LastEdited") {
            sortedData.sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return newOrder === "ascending" ? dateA - dateB : dateB - dateA;
            });
          } else if (currentSortedType === "Name") {
            sortedData.sort((a, b) => {
              const comparename = a.name.localeCompare(b.name);
              const compareLast = a.last_message.localeCompare(b.last_message);
              if (newOrder === "ascending") {
                return comparename !== 0 ? comparename : compareLast;
              } else {
                return comparename !== 0 ? -comparename : -compareLast;
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

    const handlePrivate = (ad) =>{
      console.log("yay")
      navigate("/privateMessage/"+ad.unique_id);

    }

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">{messages.title || "Mensagens"}</h1>
          <div className="w-full rounded-lg flex space-y-2 md:space-y-0 md:flex-row flex-col justify-items-center items-center md:justify-between px-1 mb-4">
            <div className="flex">
              <input 
                type='text' 
                name="search" 
                placeholder={messages.search} 
                autoComplete='on' 
                onChange={handleChange} 
                className='border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <button 
                className={`px-4 py-2 rounded-r bg-blue-600 text-white hover:bg-blue-700 transition duration-150 ease-in-out`}
                onClick={() => handleClick("search")}
              >
                <FaMagnifyingGlass />
              </button>
            </div>
            <div className="flex items-center">
              <p className='mr-2 text-sm sm:text-md font-medium'>{messages.orderedBy}</p>
              <div className="flex rounded-md shadow-sm">
                <button
                  className={`px-3 py-2 border border-r-0 rounded-l focus:outline-none transition-colors duration-200
                    ${localStorage.getItem("sorted")==="Name"?"bg-blue-100 border-blue-500 text-blue-700":"bg-white hover:bg-gray-100 border-gray-300"}`}
                  onClick={() => handleClick("Name")}
                >
                  {messages.name}
                </button>
                <button
                  className={`px-3 py-2 border rounded-r focus:outline-none transition-colors duration-200
                    ${localStorage.getItem("sorted")==="LastEdited"?"bg-blue-100 border-blue-500 text-blue-700":"bg-white hover:bg-gray-100 border-gray-300"}`}
                  onClick={() => handleClick("LastEdited")}
                >
                  {messages.lastEdited}
                </button>
              </div>
              <button
                className={`px-3 py-2 border rounded ml-2 focus:outline-none transition-colors duration-200
                  ${localStorage.getItem("sorted")?"bg-blue-100 border-blue-500 text-blue-700":"bg-white hover:bg-gray-100 border-gray-300"}`}
                onClick={() => handleClick("order")}
              >
                {order === 'descending' ? <FaSortAmountDown /> : <FaSortAmountUpAlt />}               
              </button>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-700 border-b pb-2">{messages.enabledTitle}</h2>
            <div className="w-full border border-gray-200 rounded-lg p-4 bg-white h-[540px] md:h-[410px] overflow-y-auto">

        {copyRoomData.filter((ad)=>!ad.unique_id.includes(localStorage.getItem("userType"))).map((ad,index)=>(
          <div key={index} className="flex flex-row md:flex-row w-full mx-auto bg-white shadow-md rounded-lg overflow-hidden md:h-[160px] mb-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="w-full md:w-1/4 p-3 flex flex-col justify-center items-center bg-blue-50">
              <img
                src={ad.image_url}
                alt="Room"
                className="rounded-full h-36 w-36 object-cover border-2 border-blue-300 shadow-md"
              />
            </div>
            <div className="w-full md:w-3/4 p-4 flex flex-col justify-between cursor-pointer bg-white"
            onClick={()=>handlePrivate(ad)}>
              {/* Header Row */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                <div className='w-4/6'>
                  <h3 className="text-lg font-semibold text-blue-800 overflow-hidden text-ellipsis whitespace-nowrap">{ad.name}</h3>
                  <p className="text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">{ad.last_message}</p>
                </div>
                <div className="w-2/6">
                  <p className="text-md font-medium text-gray-700 flex items-center w-full justify-start md:justify-end">
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">{formatDate(ad.date)}</span>
                  </p>
                </div>
              </div>
              
              {/* Action Icons */}
              <div className="flex gap-3 justify-end mt-3">
                <button
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all duration-200 flex items-center gap-2"
                  onClick={(e) => {e.stopPropagation();
                    handleDisable(ad.unique_id)}}
                >
                  <FiArchive size={20} className="inline-flex align-middle" />
                  <span className="inline-flex align-middle font-medium">{messages.archive}</span>
                </button>
              </div>

                          </div>
                        </div>
        ))}
            </div>
          </div>
          <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAccounts(!showAccounts)}
              className="w-full p-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transition-colors duration-300 flex flex-row items-center justify-center"
            >
              <div className="flex flex-row items-center justify-center gap-2">
                <span className="font-semibold">{messages.disabledTitle}</span>
                {!showAccounts ? <FaAngleDown /> : <FaAngleUp />}
              </div>
            </button>
        {showAccounts && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="w-full border border-gray-200 rounded-lg p-4 bg-white h-[540px] md:h-[180px] overflow-y-auto">
            {showAccounts && disabledRoomData.filter((ad)=>!ad.unique_id.includes(localStorage.getItem("userType"))).map((ad,index)=>(
              <div key={index} className="flex flex-row md:flex-row w-full mx-auto bg-white shadow-sm rounded-lg overflow-hidden md:h-[160px] mb-3 border border-gray-200 opacity-75 hover:opacity-90 transition-opacity duration-200">
                <div className="w-full md:w-1/4 p-3 flex flex-col justify-center items-center bg-gray-100">
                  <img
                    src={ad.image_url}
                    alt="Room"
                    className="rounded-full h-36 w-36 object-cover border-2 border-gray-300 filter grayscale"
                  />
                </div>
                <div className="w-full md:w-3/4 p-4 flex flex-col justify-between">
                  {/* Header Row */}
                  <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                    <div className='w-4/6'>
                      <h3 className="text-lg font-semibold text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap">{ad.name}</h3>
                      <p className="text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">{ad.last_message}</p>
                    </div>
                    <div className="w-2/6">
                      <p className="text-md font-medium text-gray-600 flex items-center w-full justify-start md:justify-end">
                        <span className="overflow-hidden text-ellipsis whitespace-nowrap">{formatDate(ad.date)}</span>
                      </p>
                    </div>
                  </div>
    
                  {/* Action Icons */}
                  <div className="flex gap-3 justify-end mt-3">
                    <button
                      className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-green-50 hover:text-green-600 hover:border-green-300 transition-all duration-200 flex items-center gap-2"
                      onClick={(e) => {e.stopPropagation();
                        handleEnable(ad.unique_id)}}
                    >
                      <LuArchiveRestore size={20} className="inline-flex align-middle" />
                      <span className="inline-flex align-middle font-medium">{messages.activate}</span>
                    </button> 
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Messages