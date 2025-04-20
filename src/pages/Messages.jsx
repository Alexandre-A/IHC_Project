import { useState } from 'react'
import { useAuth } from "../AuthContext";
import '../index.css'
import '../App.css'
import NavbarInicial from '../components/NavbarIncial'

function Messages() {
  const { userType } = useAuth();
  const isLandlord = userType === "landlord";
  return (
    <div>
      
    </div>
  )
}

export default Messages