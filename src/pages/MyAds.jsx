import { useState,useEffect } from 'react'
import { useAuth } from "../AuthContext";
import '../index.css'
import '../App.css'
import { showToast } from '../components/Toasts/ToastMessages';
import { useToast } from '../components/Toasts/ToastService';

function MyAds() {
  const { userType } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const msg = localStorage.getItem("toastSuccess");
    if (msg) {
      const parsed = JSON.parse(msg);
      showToast(toast, {
        type: parsed.type,
        header: parsed.header,
        message: parsed.message
      });
      localStorage.removeItem("toastSuccess");
    }
  }, []);
  
  

  const handleLogin = () => {
    showToast(toast, {
      type: "info",
      header: "Authenticated",
      message: "You are logged in successfully",
      //timeout: 10000 //optional
    });
  };

  const handleFail = () => {
    showToast(toast, {
      type: "error",
      header: "Action Failed",
      message: "This action failed miserably"
    });
  };

  const handleActivate = () => {
    showToast(toast, {
      type: "success",
      header: "Activated",
      message: "Item activated successfully"
    });
  };

  return (
    <div className="flex gap-4 p-4">
  <button onClick={handleLogin} className="bg-blue-500 px-4 py-2 rounded text-white">Login Toast</button>
  <button onClick={handleFail} className="bg-red-500 px-4 py-2 rounded text-white">Fail Toast</button>
  <button onClick={handleActivate} className="bg-green-500 px-4 py-2 rounded text-white">Activate Toast</button>
</div>
  )
}

export default MyAds