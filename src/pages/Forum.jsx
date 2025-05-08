import { useState } from 'react'
import { useAuth } from "../AuthContext";
import { FaMagnifyingGlass } from "react-icons/fa6";
import '../index.css'
import '../App.css'
import NavbarInicial from '../components/NavbarIncial'

function Forum() {
  const { userType } = useAuth();
  const isLandlord = userType === "landlord";
  return (
        <div className='min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4'>
            <div className="w-full max-w-4xl rounded-lg flex space-y-2 md:space-y-0 md:flex-row flex-col justify-items-center items-center md:justify-between px-1">
                <div className='flex'>
                    <input type='text' name='search'  placeholder='Search' autoComplete='on' onChange={console.log("a")} className='border-1 rounded bg-white'></input>
                    <button className={`px-4 py-1 rounded right-4 bg-gray-300 border-2 border-gray-800 cursor-pointer hover:text-white hover:bg-gray-500`}
                        onClick={() => handleClick("search")}><FaMagnifyingGlass /></button>
                </div>
            </div>
        </div>
  )
}

export default Forum
