import React from "react";
import { RiArrowGoBackLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";


function ReturnButton({previousPage}){
    const navigate = useNavigate()
    return(
        <div className=" bg-white shadow-md rounded-t-lg py-2 pl-4 pr-4">
        <button
              onClick={() => navigate(previousPage)}
              className={`px-3  rounded  bg-gray-300 border-2 border-gray-800 cursor-pointer hover:text-white hover:bg-gray-500`}
        >
    <RiArrowGoBackLine size={28}/>            
    </button>
        </div>
    )
}

export default ReturnButton