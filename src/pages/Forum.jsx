import { useState } from 'react'
import { useAuth } from "../AuthContext";
import '../index.css'
import '../App.css'
import NavbarInicial from '../components/NavbarIncial'

function Forum() {
  const { userType } = useAuth();
  const isLandlord = userType === "landlord";
  return (
    <div className='bg-gray-100'>
      
    </div>
  )
}

export default Forum