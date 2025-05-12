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
        header: "wow",
        message: "working"
      });
    };
    
    const handleFavourite =()=>{
      showToast(toast, {
        type: "warning",
        header: "wow",
        message: "working"
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
    
  
  
    const handleMessage = () =>{
      if (userType==='landlord'){
       setModal("Active")
      }else navigate("/privateMessage/landlord")
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
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer transition"
          >
            {showFilters ? "Esconder Filtros" : "Mostrar Filtros"}
          </button>

          {/* Dropdown Filter Panel */}
          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded  shadow-md border-1 mb-2 transition-all duration-300">
              <div className="col-span-2 md:col-span-4 flex justify-center mt-2">
                <p><b>Only filled in fields will be applied</b></p>
              </div>
              <select className="border p-2 rounded" value={filters.gender} onChange={(e) => setFilters({ ...filters, gender: e.target.value })}>
                <option value="Indifferent">Género: qualquer</option>
                <option value="Male">Masculino</option>
                <option value="Female">Feminino</option>
              </select>

              <select className="border p-2 rounded" value={filters.marital_status} onChange={(e) => setFilters({ ...filters, marital_status: e.target.value })}>
                <option value="Yes">Casais: sim</option>
                <option value="No">Casais: não</option>
              </select>

              <select className="border p-2 rounded" value={filters.bath_share} onChange={(e) => setFilters({ ...filters, bath_share: e.target.value })}>
                <option value="Shared">Casa de banho: partilhada</option>
                <option value="Private">Privativa</option>
              </select>
              
              <select className="border p-2 rounded" value={filters.expense_included} onChange={(e) => setFilters({ ...filters, expense_included: e.target.value })}>
                <option value="Yes">Despesas incluídas</option>
                <option value="No">Não incluídas</option>
              </select>


              <input
                type="number"
                placeholder="Preço mínimo"
                className="border p-2 rounded"
                value={filters.minprice}
                onChange={(e) => setFilters({ ...filters, minprice: e.target.value })}
              />
              {errors.minprice && <p className="text-red-500 text-sm">{errors.minprice}</p>}

              <input
                type="number"
                placeholder="Preço máximo"
                className="border p-2 rounded"
                value={filters.maxprice}
                onChange={(e) => setFilters({ ...filters, maxprice: e.target.value })}
              />


              <input
              type="text"
              placeholder="Idade mínima"
              className="border p-2 rounded"
              value={filters.min_age}
              onChange={(e) => setFilters({ ...filters, min_age: e.target.value })}
              />

              <input
              type="text"
              placeholder="Idade máxima"
              className="border p-2 rounded"
              value={filters.max_age}
              onChange={(e) => setFilters({ ...filters, max_age: e.target.value })}
              />

              <input
                type="text"
                placeholder="Distrito"
                className="border p-2 rounded"
                value={filters.district}
                onChange={(e) => setFilters({ ...filters, district: e.target.value })}
              />

              <input
                type="text"
                placeholder="Cidade"
                className="border p-2 rounded"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              />

              <input
                type="text"
                placeholder="Rua"
                className="border p-2 rounded"
                value={filters.street}
                onChange={(e) => setFilters({ ...filters, street: e.target.value })}
              />


              <input
                type="text"
                placeholder="Entrar (data)"
                className="border p-2 rounded"
                value={filters.available_date}
                onChange={(e) => setFilters({ ...filters, available_date: e.target.value })}
              />

              <div className="col-span-2 md:col-span-4 flex justify-between mt-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white cursor-pointer rounded hover:bg-blue-600"
                  onClick={handleFilterApply}
                >
                  Aplicar Filtros
                </button>

                <button
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 cursor-pointer rounded"
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
                  Reset Filtros
                </button>
              </div>
            </div>
          )}

    <div className="w-full max-w-4xl rounded-lg flex space-y-2 md:space-y-0 md:flex-row flex-col justify-items-center items-center
   md:justify-between px-1">
      <div className="flex">
        <input type='text' name="search" placeholder={adsPage.search} autoComplete='on' onChange={handleChange} className='border-1 rounded bg-white'></input>
        <button className={`px-4 py-1 rounded right-4 bg-gray-300 border-2 border-gray-800 cursor-pointer hover:text-white hover:bg-gray-500`}
                onClick={() => handleClick("search")}><FaMagnifyingGlass /></button>
      </div>
      <div className="flex items-center">
              <p className='mr-1 text-sm sm:text-md'>{adsPage.orderedBy}</p>
              <button
                className={`px-3 py-1 border-t-2 border-l-2 border-b-2 rounded-l bg-gray-200 hover:bg-gray-300 cursor-pointer text-sm 
                  ${localStorage.getItem("sorted")==="price"?"bg-gray-300":"bg-gray-200"}`}
                onClick={() => handleClick("price")}
              >
                {adsPage.price}
              </button>
              <button
                className={`px-3 py-1 border-t-2 border-b-2 bg-gray-200 hover:bg-gray-300 cursor-pointer text-sm 
                  ${localStorage.getItem("sorted")==="Location"?"bg-gray-300":"bg-gray-200"}`}
                onClick={() => handleClick("Location")}
              >
                {adsPage.location}
              </button>
              <button
                className={`px-3 py-1 border-t-2 border-b-2 border-r-2 rounded-r bg-gray-200 hover:bg-gray-300 cursor-pointer text-sm 
                  ${localStorage.getItem("sorted")==="LastEdited"?"bg-gray-300":"bg-gray-200"}`}
                onClick={() => handleClick("LastEdited")}
              >
                {adsPage.lastEdited}
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
          <p><b>{adsPage.enabledTitle}</b></p>
          <div className="w-full max-w-4xl border-1 p-2 bg-gray-100 shadow-md rounded-lg h-[540px] md:h-[410px] overflow-y-auto">        
  
          {copyRoomData.map((ad,index)=>(
            <div key={index} className="flex flex-col md:flex-row w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden md:h-48 mb-3 border-gray-400 border-1">
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
                                  className="p-2 border rounded hover:bg-gray-200 transition-colors duration-200 cursor-pointer flex items-center gap-2"
                                  onClick={() => handleInfo(ad.image_path.split("/")[1].split(".")[0])}
                                >
                                  <FiInfo size={25} className="inline-flex align-middle" />
                                  <span className="inline-flex align-middle">{adsPage.details}</span>
                                </button>
                      
                                <button
                                  className="p-2 border rounded hover:bg-gray-200 transition-colors duration-200 cursor-pointer flex items-center gap-2"
                                  onClick={() => handleMessage()}
                                >
                                  <LuMessageCircleMore size={25} className="inline-flex align-middle" />
                                  <span className="inline-flex align-middle">{adsPage.message}</span>
                                </button>
                                <button
                                  className="p-2 border rounded hover:bg-gray-200 transition-colors duration-200 cursor-pointer flex items-center gap-2"
                                  onClick={() => handleFavourite()}
                                >
                                  <FaHeart size={25} className="inline-flex align-middle" />
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