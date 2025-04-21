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

    };

    const handleLoginTennant = () => {
        login("tennant"); // Or "landlord" depending on your logic
      };

    return (
        <div style={{ padding: 50, zIndex: 9999, position: "relative", backgroundColor: "white" }}>
          <h1>Login</h1>
          <button onClick={handleLoginTennant} className="bg-blue-500 text-white px-4 py-2 m-2">
            Login as Tenant
          </button>
          <button onClick={handleLoginLandlord} className="bg-green-500 text-white px-4 py-2 m-2">
            Login as Landlord
          </button>
        </div>
      );
      
  
}

export default LoginPage
