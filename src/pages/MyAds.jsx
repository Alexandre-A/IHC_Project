import { useState,useEffect, use } from 'react'
import { useAuth } from "../AuthContext";
import '../index.css'
import '../App.css'
import { showToast } from '../components/Toasts/ToastMessages';
import { useToast } from '../components/Toasts/ToastService';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt,FaShareAlt,FaHeart } from "react-icons/fa";
import { FiEdit, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi'

const ip = "127.0.0.1";
const port = 5000;

function MyAds() {
  const { userType } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const email = localStorage.getItem("landlordEmail")
  const [roomData,setRoomData] = useState([]);

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
      } catch (err) {
        console.error("Failed to fetch ads:", err);
      }
    };
  
    fetchAds();
  }, []); 
  
  const handleLogin = () => {
    navigate("/form")
  };

  const handleEdit = (id) =>{
    console.log(id)
    localStorage.setItem("edit",id);
    navigate("/form")
  };

  const handleRemove = async (adhc) =>{
    try {
      const response = await fetch(`http://${ip}:${port}/delete_ad/${adhc}`, {
        method: "DELETE",
      });

      if (response.ok) {
        localStorage.setItem("toastSuccess", JSON.stringify({
          type: "success",
          header: "Sucesso",
          message: "Anúncio eliminado com sucesso"
        }));
      } else {
        // Handle the case when the response is not successful
        localStorage.setItem("toastSuccess", JSON.stringify({
          type: "error",
          header: "Erro",
          message: "Falha na eliminação do anúncio"
        }));
      }
    } catch (error) {
      // Handle error if fetch fails
      localStorage.setItem("toastSuccess", JSON.stringify({
        type: "error",
        header: "Erro",
        message: "Falha na eliminação do anúncio"
      }));
    }
  };


  return (<>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <button
    onClick={handleLogin}
    className="w-1/2  flex items-center justify-center gap-2 px-4 py-2
               bg-gray-500 hover:bg-gray-600 text-white rounded 
               transition-colors duration-200 cursor-pointer text-base sm:text-lg md:text-xl mb-5 shadow-md border-2 border-black"
  >
    <span className="text-2xl sm:text-3xl md:text-4xl leading-none font-semibold">+</span>
    <span className="text-xl sm:text-2xl md:text-3xl leading-none font-semibold">Novo Anúncio</span>
  </button>
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-4">
        {roomData.map((ad,index)=>(
          <div key={index} className="flex flex-col md:flex-row w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden md:h-48 mb-3 border-gray-400 border-1">
                          <img
                            src={ad.image_url}
                            alt="Room"
                            className="w-full md:w-1/3 h-64 md:h-full object-cover border-2 md:rounded-none rounded-t"
                          />
          
                          <div className="w-full md:w-2/3 p-4 flex flex-col justify-between">
                            {/* Header Row */}
                            <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                              <div>
                                <h3 className="text-lg font-semibold">{ad.name}</h3>
                                <p className="text-sm text-gray-600">{ad.description}</p>
                              </div>
                              <div className="text-left md:text-right">
                                <p className="text-xl font-semibold text-gray-800">{ad.price}€</p>
                                <a href="#" className="text-sm text-blue-600 hover:underline">Sr. Miguel André</a>
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
                                onClick={() => handleEdit(ad.image_path.split("/")[1].split(".")[0])}
                              >
                                <FiEdit size={25} className="inline-flex align-middle" />
                                <span className="inline-flex align-middle">Edit</span>
                              </button>
                              <button
                                className="p-2 border rounded hover:bg-gray-200 transition-colors duration-200 cursor-pointer flex items-center gap-2"
                                onClick={() => handleRemove(ad.image_path.split("/")[1].split(".")[0])}
                              >
                                <FaTrashAlt size={25} className="inline-flex align-middle" />
                                <span className="inline-flex align-middle">Delete</span>
                              </button>
                            </div>

                          </div>
                        </div>
        ))}
</div>
</div>
</>




  )
}

export default MyAds