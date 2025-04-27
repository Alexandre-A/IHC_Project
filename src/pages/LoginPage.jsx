import { useState } from 'react'
import { useAuth } from "../AuthContext";
import { useNavigate } from 'react-router-dom';

import '../index.css'
import '../App.css'
import NavbarInicial from '../components/NavbarIncial'

function LoginPage() {
    const { login } = useAuth();  // Get the login function from the context

    const handleLoginLandlord = () => {
      login("landlord"); // Or "landlord" depending on your logic
      localStorage.removeItem("loggedInEmail")
      localStorage.setItem("loggedInEmail","supreme_landlord@gmail.com")
    };

    const handleLoginTennant = () => {
        login("tennant"); // Or "landlord" depending on your logic
        localStorage.removeItem("loggedInEmail")
        localStorage.setItem("loggedInEmail","tennant@gmail.com")
      };

    return (
        <div style={{ padding: 50, zIndex: 9999, position: "relative"}} className='bg-gray-100'>
          <h1>Login</h1>
          <button onClick={handleLoginTennant} className="bg-blue-500 text-white px-4 py-2 m-2">
            Login as Tenant
          </button>
          <button onClick={handleLoginLandlord} className="bg-green-500 text-white px-4 py-2 m-2">
            Login as Landlord
          </button>
          <a href="/profile/landlord" className="text-sm text-blue-600 hover:underline">Sr. Danilo</a>

        </div>
      );
      
  
}

export default LoginPage
