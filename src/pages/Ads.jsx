import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import "../index.css";
import "../App.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { showToast } from "../components/Toasts/ToastMessages";
import { useToast } from "../components/Toasts/ToastService";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaTrashAlt,FaShareAlt,FaHeart,FaSortAmountUpAlt,FaSortAmountDown,FaRegHeart} from "react-icons/fa";
import { FiEdit, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi'
import { LuMessageCircleMore } from "react-icons/lu";
import Modal from "../components/Modal";
import { colors } from "../utils/colors";

const ip = "127.0.0.1";
const port = 5000;

function Ads() {
  const toast = useToast();
    const navigate = useNavigate();
    const [roomData,setRoomData] = useState([]);
    const [search,setSearch] = useState("");
    const [copyRoomData,setCopyRoomData] = useState([]);
    const [userType,setUserType] = useState(localStorage.getItem('userType'))
    const [showFilters, setShowFilters] = useState(false);
    const [temp,setTemp] = useState([]);
    const [order, setOrder] = useState(localStorage.getItem('order') || 'ascending');
    const {t} = useTranslation();
    const adsPage = t("adsPage");
    const [errors, setErrors] = useState({});
    const [modal, setModal] = useState(null); // null, 'first', 'third'

    const [filters, setFilters] = useState({
      minprice: "",
      maxprice: "",
      location: "",
      gender: "Indifferent",
      district: "",
      city: "",
      street: "",
      min_age: "",
      max_age: "",
      marital_status: "Yes",
      expense_included: "Yes",
      bath_share: "Shared",
      tags: []
    });
    
    const handleFilterApply = () => {
      const newErrors = {};
    
      if (filters.minprice && isNaN(filters.minprice)) {
        newErrors.minprice = "Preço mínimo deve ser um número.";
      }
    
      if (filters.maxprice && isNaN(filters.maxprice)) {
        newErrors.maxprice = "Preço máximo deve ser um número.";
      }
    
      if (
        filters.minprice &&
        filters.maxprice &&
        parseFloat(filters.minprice) > parseFloat(filters.maxprice)
      ) {
        newErrors.priceRange = "Preço mínimo não pode ser maior que o máximo.";
      }
    
      if (filters.min_age && isNaN(filters.min_age)) {
        newErrors.min_age = "Idade mínima deve ser um número.";
      }
    
      if (filters.max_age && isNaN(filters.max_age)) {
        newErrors.max_age = "Idade máxima deve ser um número.";
      }
    
      if (
        filters.min_age &&
        filters.max_age &&
        parseInt(filters.min_age) > parseInt(filters.max_age)
      ) {
        newErrors.ageRange = "Idade mínima não pode ser maior que a máxima.";
      }
    
      setErrors(newErrors);
    
      if (Object.keys(newErrors).length > 0) return;
    
      const filtered = roomData.filter((ad) => {
        const {
          minprice, maxprice, gender, marital_status, bath_share,
          expense_included, district, city, street, min_age, max_age
        } = filters;
    
        const matchMinPrice = minprice ? ad.price >= parseFloat(minprice) : true;
        const matchMaxPrice = maxprice ? ad.price <= parseFloat(maxprice) : true;
        const matchGender = gender !== "Indifferent" ? ad.gender === gender : true;
        const matchMaritalStatus = marital_status ? ad.marital_status === marital_status : true;
        const matchBathShare = bath_share ? ad.bath_share === bath_share : true;
        const matchExpenseIncluded = expense_included ? ad.expense_included === expense_included : true;
        const matchDistrict = district ? ad.district.toLowerCase().includes(district.toLowerCase()) : true;
        const matchCity = city ? ad.city.toLowerCase().includes(city.toLowerCase()) : true;
        const matchStreet = street ? ad.street.toLowerCase().includes(street.toLowerCase()) : true;
        const matchMinAge = min_age ? ad.min_age >= parseInt(min_age) : true;
        const matchMaxAge = max_age ? ad.max_age <= parseInt(max_age) : true;
    
        return (
          matchMinPrice &&
          matchMaxPrice &&
          matchGender &&
          matchMaritalStatus &&
          matchBathShare &&
          matchExpenseIncluded &&
          matchDistrict &&
          matchCity &&
          matchStreet &&
          matchMinAge &&
          matchMaxAge
        );
      });
    
      setCopyRoomData(filtered);
      showToast(toast, {
        type: "success",
        header: adsPage.success,
        message: adsPage.successMessage
      });
    };
    
    const handleFavourite =()=>{
      showToast(toast, {
        type: "warning",
        header: adsPage.warning,
        message: adsPage.warningMessage
      });
    }

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
        } catch (err) {
          console.error("Failed to fetch ads:", err);
        }
      };
    
      fetchAds();
    }, []); 
    
  
  
    const handleMessage = (e) =>{
      if (userType){
        if (userType==='landlord'){
         setModal("Active")
        }else navigate("/privateMessage/landlord")
      }else{
        setModal('first');
        e.preventDefault(); // prevent navigation
        }
      
    };
  
    const handleInfo = async (adhc) =>{
      console.log(adhc)
      navigate("/adInfo/"+adhc)
    }
  
  
    const handleRemove = async (adhc) =>{
    };
  
    useEffect(() => {
      console.log("Updated copyRoomData:", copyRoomData);
    }, [copyRoomData]);
  
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
        <Modal open={modal == "Active"} onClose={() => setModal(null)}>
          <div className="text-center w-56">
            <div className="mx-auto my-4 w-48">
              <h3 className="text-lg font-black text-gray-800">{adsPage.modalTitle2}</h3>
              <p className="text-sm text-gray-500 my-1">
                {adsPage.cannot}
              </p>
            </div>
          </div>
        </Modal>
        <Modal open={modal == "first"} onClose={() => setModal(null)}>
          <div className="text-center w-56">
            <div className="mx-auto my-4 w-48">
              <h3 className="text-lg font-black text-gray-800">{adsPage.modalTitle}</h3>
              <p className="text-sm text-black my-1">
                {adsPage.modalVariation2}
              </p>
            </div>
          </div>
        </Modal>
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
          <button
                onClick={() => setShowFilters(!showFilters)}
                className="mb-4 px-4 py-2 text-white rounded cursor-pointer transition"
                style={{ backgroundColor: colors.primary, border: `1px solid ${colors.secondary}` }}
                onMouseOver={(e) => e.target.style.backgroundColor = colors.secondary}
                onMouseOut={(e) => e.target.style.backgroundColor = colors.primary}
              >
            {showFilters ? adsPage.hideFilter : adsPage.showFilter}
          </button>

          {/* Dropdown Filter Panel */}
          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded shadow-md border-1 mb-2 transition-all duration-300"
                 style={{ backgroundColor: colors.light, border: `1px solid ${colors.secondary}` }}>
              <div className="col-span-2 md:col-span-4 flex justify-center mt-2">
                <p><b>{adsPage.disclaimer}</b></p>
              </div>
              <select className="border p-2 rounded" 
                      style={{ borderColor: colors.secondary }} 
                      value={filters.gender} 
                      onChange={(e) => setFilters({ ...filters, gender: e.target.value })}>
                <option value="Indifferent">{adsPage.gender}</option>
                <option value="Male">{adsPage.male}</option>
                <option value="Female">{adsPage.female}</option>
              </select>

              <select className="border p-2 rounded" 
                      style={{ borderColor: colors.secondary }} 
                      value={filters.marital_status} 
                      onChange={(e) => setFilters({ ...filters, marital_status: e.target.value })}>
                <option value="Yes">{adsPage.couplesYes}</option>
                <option value="No">{adsPage.couplesNo}</option>
              </select>

              <select className="border p-2 rounded" 
                      style={{ borderColor: colors.secondary }} 
                      value={filters.bath_share} 
                      onChange={(e) => setFilters({ ...filters, bath_share: e.target.value })}>
                <option value="Shared">{adsPage.shared}</option>
                <option value="Private">{adsPage.private}</option>
              </select>
              
              <select className="border p-2 rounded" 
                      style={{ borderColor: colors.secondary }} 
                      value={filters.expense_included} 
                      onChange={(e) => setFilters({ ...filters, expense_included: e.target.value })}>
                <option value="Yes">{adsPage.expensesYes}</option>
                <option value="No">{adsPage.expensesNo}</option>
              </select>


              <input
                type="number"
                placeholder={adsPage.priceMin}
                className="border p-2 rounded"
                style={{ borderColor: colors.secondary }}
                value={filters.minprice}
                onChange={(e) => setFilters({ ...filters, minprice: e.target.value })}
              />
              {errors.minprice && <p className="text-red-500 text-sm">{errors.minprice}</p>}

              <input
                type="number"
                placeholder={adsPage.priceMax}
                className="border p-2 rounded"
                style={{ borderColor: colors.secondary }}
                value={filters.maxprice}
                onChange={(e) => setFilters({ ...filters, maxprice: e.target.value })}
              />


              <input
              type="text"
              placeholder={adsPage.ageMin}
              className="border p-2 rounded"
              style={{ borderColor: colors.secondary }}
              value={filters.min_age}
              onChange={(e) => setFilters({ ...filters, min_age: e.target.value })}
              />

              <input
              type="text"
              placeholder={adsPage.ageMax}
              className="border p-2 rounded"
              style={{ borderColor: colors.secondary }}
              value={filters.max_age}
              onChange={(e) => setFilters({ ...filters, max_age: e.target.value })}
              />

              <input
                type="text"
                placeholder={adsPage.selectDistrict}
                className="border p-2 rounded"
                style={{ borderColor: colors.secondary }}
                value={filters.district}
                onChange={(e) => setFilters({ ...filters, district: e.target.value })}
              />

              <input
                type="text"
                placeholder={adsPage.selectCity}
                className="border p-2 rounded"
                style={{ borderColor: colors.secondary }}
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              />

              <input
                type="text"
                placeholder={adsPage.street}
                className="border p-2 rounded"
                style={{ borderColor: colors.secondary }}
                value={filters.street}
                onChange={(e) => setFilters({ ...filters, street: e.target.value })}
              />


              <input
                type="text"
                placeholder={adsPage.available}
                className="border p-2 rounded"
                style={{ borderColor: colors.secondary }}
                value={filters.available_date}
                onChange={(e) => setFilters({ ...filters, available_date: e.target.value })}
              />

              <div className="col-span-2 md:col-span-4 flex justify-between mt-2">
                <button
                  className="px-4 py-2 text-white cursor-pointer rounded"
                  style={{ backgroundColor: colors.accent }}
                  onMouseOver={(e) => e.target.style.backgroundColor = colors.secondary}
                  onMouseOut={(e) => e.target.style.backgroundColor = colors.accent}
                  onClick={handleFilterApply}
                >
                  {adsPage.applyFilter}
                </button>

                <button
                  className="px-4 py-2 cursor-pointer rounded text-white"
                  style={{ backgroundColor: colors.primary }}
                  onMouseOver={(e) => e.target.style.backgroundColor = colors.secondary}
                  onMouseOut={(e) => e.target.style.backgroundColor = colors.primary}
                  onClick={() => {
                    setFilters({
                      minprice: "",
                      maxprice: "",
                      location: "",
                      gender: "Indifferent",
                      district: "",
                      city: "",
                      street: "",
                      min_age: "",
                      max_age: "",
                      marital_status: "Yes",
                      expense_included: "Yes",
                      bath_share: "Shared",
                      tags: []
                    });
                    setCopyRoomData(roomData);
                  }}
                >
                  {adsPage.resetFilter}
                </button>
              </div>
            </div>
          )}

    <div className="w-full max-w-4xl rounded-lg flex space-y-2 md:space-y-0 md:flex-row flex-col justify-items-center items-center
   md:justify-between px-1">
      <div className="flex">
        <input type='text' name="search" placeholder={adsPage.search} autoComplete='on' onChange={handleChange} 
               className='border-1 rounded' style={{ backgroundColor: colors.light, borderColor: colors.secondary }}></input>
          <button className={`px-4 py-1 rounded right-4 cursor-pointer text-white`}
                  style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.primary}` }}
                  onClick={() => handleClick("search")}><FaMagnifyingGlass /></button>
      </div>
      <div className="flex items-center">
              <p className='mr-1 text-sm sm:text-md'>{adsPage.orderedBy}</p>
              <button
                className={`px-3 py-1 border-t-2 border-l-2 border-b-2 rounded-l cursor-pointer text-sm`}
                style={{ 
                  backgroundColor: localStorage.getItem("sorted")==="price" ? colors.secondary : colors.light,
                  borderColor: colors.secondary,
                  color: localStorage.getItem("sorted")==="price" ? colors.light : colors.dark
                }}
                onClick={() => handleClick("price")}
              >
                {adsPage.price}
              </button>
              <button
                className={`px-3 py-1 border-t-2 border-b-2 cursor-pointer text-sm`}
                style={{ 
                  backgroundColor: localStorage.getItem("sorted")==="Location" ? colors.secondary : colors.light,
                  borderColor: colors.secondary,
                  color: localStorage.getItem("sorted")==="Location" ? colors.light : colors.dark
                }}
                onClick={() => handleClick("Location")}
              >
                {adsPage.location}
              </button>
              <button
                className={`px-3 py-1 border-t-2 border-b-2 border-r-2 rounded-r cursor-pointer text-sm`}
                style={{ 
                  backgroundColor: localStorage.getItem("sorted")==="LastEdited" ? colors.secondary : colors.light,
                  borderColor: colors.secondary,
                  color: localStorage.getItem("sorted")==="LastEdited" ? colors.light : colors.dark
                }}
                onClick={() => handleClick("LastEdited")}
              >
                {adsPage.lastEdited}
              </button>
              <button
                className={`px-2 ml-2 py-1 border-2 rounded cursor-pointer`}
                style={{ 
                  backgroundColor: localStorage.getItem("sorted") ? colors.secondary : colors.light,
                  borderColor: colors.secondary,
                  color: localStorage.getItem("sorted") ? colors.light : colors.dark
                }}
                onClick={() => handleClick("order")}
              >
              {order === 'descending' ? <FaSortAmountDown /> : <FaSortAmountUpAlt />}               
              </button>
              
            </div>
    </div>
        <div className="w-full max-w-4xl shadow-md rounded-t-lg pl-4 pr-4 pb-4 pt-2" style={{backgroundColor: colors.light}}>
          <p><b>{adsPage.enabledTitle}</b></p>
          <div className="w-full max-w-4xl border-1 p-2 shadow-md rounded-lg h-[540px] md:h-[410px] overflow-y-auto" 
               style={{backgroundColor: colors.light, borderColor: colors.secondary}}>        
  
          {copyRoomData.map((ad,index)=>(
            <div key={index} className="flex flex-col md:flex-row w-full max-w-4xl mx-auto shadow-md rounded-lg overflow-hidden md:h-48 mb-3 border-1" 
                 style={{backgroundColor: colors.white, borderColor: colors.secondary}}>
                            <img
                              src={ad.image_url}
                              alt="Room"
                              className="w-full md:w-1/3 h-64 md:h-full object-cover border-2 md:rounded-none rounded-t"
                            />
            
                            <div className="w-full md:w-2/3  p-4 flex flex-col justify-between">
                              {/* Header Row */}
                              <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                                <div className='w-4/6'>
                                  <h3 className="text-lg font-semibold overflow-hidden text-ellipsis whitespace-nowrap">{ad.name}</h3>
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
                                  onClick={() => handleInfo(ad.image_path.split("/")[1].split(".")[0])}
                                  onMouseOver={(e) => e.target.style.backgroundColor = colors.light}
                                  onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
                                >
                                  <FiInfo size={25} className="inline-flex align-middle" style={{color: colors.info}} />
                                  <span className="inline-flex align-middle">{adsPage.details}</span>
                                </button>
                      
                                <button
                                  className="p-2 border rounded transition-colors duration-200 cursor-pointer flex items-center gap-2"
                                  style={{ borderColor: colors.secondary }}
                                  onClick={(e) => handleMessage(e)}
                                  onMouseOver={(e) => e.target.style.backgroundColor = colors.light}
                                  onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
                                >
                                  <LuMessageCircleMore size={25} className="inline-flex align-middle" style={{color: colors.secondary}} />
                                  <span className="inline-flex align-middle">{adsPage.message}</span>
                                </button>
                                <button
                                  className="p-2 border rounded transition-colors duration-200 cursor-pointer flex items-center gap-2"
                                  style={{ borderColor: colors.secondary }}
                                  onClick={() => handleFavourite()}
                                  onMouseOver={(e) => e.target.style.backgroundColor = colors.light}
                                  onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
                                >
                                  <FaHeart size={25} className="inline-flex align-middle" style={{color: colors.accent}} />
                                </button>
                              </div>
  
                            </div>
                          </div>
          ))}
          </div>
        </div>
        </div>
    </>
  );
}

export default Ads;