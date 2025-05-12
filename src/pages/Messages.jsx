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


  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
  <div className="w-full max-w-4xl rounded-lg flex space-y-2 md:space-y-0 md:flex-row flex-col justify-items-center items-center
 md:justify-between px-1">
    <div className="flex">
      <input type='text' name="search" placeholder={messages.search} autoComplete='on' onChange={handleChange} className='border-1 rounded bg-white'></input>
      <button className={`px-4 py-1 rounded right-4 bg-gray-300 border-2 border-gray-800 cursor-pointer hover:text-white hover:bg-gray-500`}
              onClick={() => handleClick("search")}><FaMagnifyingGlass /></button>
    </div>
    <div className="flex items-center">
            <p className='mr-1 text-sm sm:text-md'>{messages.orderedBy}</p>
            <button
              className={`px-3 py-1 border-t-2 border-l-2 border-b-2 rounded-l bg-gray-200 hover:bg-gray-300 cursor-pointer text-sm 
                ${localStorage.getItem("sorted")==="Name"?"bg-gray-300":"bg-gray-200"}`}
              onClick={() => handleClick("Name")}
            >
              {messages.name}
            </button>
            <button
              className={`px-3 py-1 border-t-2 border-b-2 border-r-2 rounded-r bg-gray-200 hover:bg-gray-300 cursor-pointer text-sm 
                ${localStorage.getItem("sorted")==="LastEdited"?"bg-gray-300":"bg-gray-200"}`}
              onClick={() => handleClick("LastEdited")}
            >
              {messages.lastEdited}
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
      <div className="w-full max-w-4xl bg-white shadow-md rounded-t-lg pl-4 pr-4 pb-4 pt-2">
        <p><b>{messages.enabledTitle}</b></p>
        <div className="w-full max-w-4xl border-1 p-2 bg-gray-100 shadow-md rounded-lg h-[540px] md:h-[410px] overflow-y-auto">        

        {copyRoomData.filter((ad)=>!ad.unique_id.includes(localStorage.getItem("userType"))).map((ad,index)=>(
          <div key={index} className="flex flex-row md:flex-row w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden md:h-[160px] mb-3 border-black border">
                          <div className="w-full md:w-1/4 p-2 flex flex-col justify-between">
                            <img
                              src={ad.image_url}
                              alt="Room"
                              className=" ml-2 border-black justify-center rounded-full h-36 w-36 object-cover border-3"
                            />
                          </div>
                          <div className="w-full md:w-3/4 p-4 flex flex-col justify-between cursor-pointer"
                          onClick={()=>handlePrivate(ad)}>
                            {/* Header Row */}
                            <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                              <div className='w-4/6'>
                                <h3 className="text-lg font-semibold overflow-hidden text-ellipsis whitespace-nowrap">{ad.name}</h3>
                                <p className=" text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">{ad.last_message}</p>
                              </div>
                              <div className="w-2/6">
                                <p className="text-xl font-semibold text-gray-800 flex items-center w-full justify-start md:justify-end">
                                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">{ad.date}</span>
                                </p>
                              </div>
                            </div>
          
          
                            {/* Action Icons */}
                            <div className="flex gap-3 justify-end">
                              <button
                                className="p-2 border rounded hover:bg-gray-200 transition-colors duration-200 cursor-pointer flex items-center gap-2"
                                onClick={(e) => {e.stopPropagation();
                                  handleDisable(ad.unique_id)}}
                              >
                                <FiArchive size={25} className="inline-flex align-middle" />
                                <span className="inline-flex align-middle">{messages.archive}</span>
                              </button>
                            </div>

                          </div>
                        </div>
        ))}
        </div>
      </div>
      <div className="w-full max-w-4xl bg-white shadow-md rounded-b-lg pl-4 pr-4 pb-4">
        <button
          type="button"
          onClick={() => setShowAccounts(!showAccounts)}
          className="w-full p-2 bg-gray-500 border-t border-l border-r border-black text-white rounded-t hover:bg-gray-600 flex flex-row items-center justify-center"
        >
          <div className="flex flex-row items-center justify-center gap-2">
            <b>{messages.disabledTitle}</b>
            {!showAccounts ? <FaAngleDown /> : <FaAngleUp />}
          </div>
        </button>
        {showAccounts?
        <div className="w-full max-w-4xl border-1  rounded-b p-2 bg-gray-100 shadow-md  h-[540px] md:h-[180px] overflow-y-auto">        

        {showAccounts && disabledRoomData.filter((ad)=>!ad.unique_id.includes(localStorage.getItem("userType"))).map((ad,index)=>(
          <div key={index} className="flex flex-row md:flex-row w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden md:h-[160px] mb-3 border-gray-700 border-1 opacity-65">
                          <div className="w-full md:w-1/4 p-2 flex flex-col justify-between">
                            <img
                              src={ad.image_url}
                              alt="Room"
                              className=" ml-2 border-black justify-center rounded-full h-36 w-36 object-cover border-3"
                            />
                          </div>
                          <div className="w-full md:w-3/4 p-4 flex flex-col justify-between">
                            {/* Header Row */}
                            <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                              <div className='w-4/6'>
                                <h3 className="text-lg font-semibold overflow-hidden text-ellipsis whitespace-nowrap">{ad.name}</h3>
                                <p className="text-sm text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">{ad.last_message}</p>
                              </div>
                              <div className="w-2/6">
                                <p className="text-xl font-semibold text-gray-800 flex items-center w-full justify-start md:justify-end">
                                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">{ad.date}</span>
                                </p>

                              </div>
                            </div>
          
                            {/* Action Icons */}
                            <div className="flex gap-3 justify-end mt-2">
                              <button
                                className="p-2 border rounded hover:bg-gray-200 transition-colors duration-200 cursor-pointer flex items-center gap-2"
                                onClick={(e) => {e.stopPropagation();
                                  handleEnable(ad.unique_id)}}
                              >
                                <LuArchiveRestore size={25} className="inline-flex align-middle" />
                                <span className="inline-flex align-middle">{messages.activate}</span>
                              </button> 
                            </div>
                          </div>
                        </div>
        ))}
        </div>:<></>
        }
      </div>
    </div>
  </>
  )
}

export default Messages