import { useState,useEffect } from 'react'
import { useAuth } from "../AuthContext";
import '../index.css'
import '../App.css'
import { showToast } from '../components/Toasts/ToastMessages';
import { useToast } from '../components/Toasts/ToastService';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from "react-icons/fa";

function MyAds() {
  const { userType } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

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
  }, []); 
  
  

  const handleLogin = () => {
    navigate("/form")
  };


  return (
    <div className="flex justify-center items-center min-h-[30vh] p-4">
  <button
    onClick={handleLogin}
    className="w-1/2  flex items-center justify-center gap-2 px-4 py-2
               bg-gray-500 hover:bg-gray-600 text-white rounded 
               transition-colors duration-200 cursor-pointer text-base sm:text-lg md:text-xl"
  >
    <span className="text-2xl sm:text-3xl md:text-4xl leading-none font-semibold">+</span>
    <span className="text-xl sm:text-2xl md:text-3xl leading-none font-semibold">Novo Anúncio</span>
  </button>
</div>




  )
}

export default MyAds