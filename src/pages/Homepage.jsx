import { useState } from 'react'
import { useAuth } from "../AuthContext";
import '../index.css'
import '../App.css'
import NavbarInicial from '../components/NavbarIncial'

function Homepage() {
  const { userType } = useAuth();
  const isLandlord = userType === "landlord";
  return (
    <div>
      <NavbarInicial
        homepage={false}
        complete={isLandlord}
        onNavigateHome={() => {}}
      />
      {/* Your content goes here */}
    </div>
  )
}

export default Homepage