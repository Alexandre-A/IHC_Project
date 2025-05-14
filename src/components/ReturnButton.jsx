import React from "react";
import { RiArrowGoBackLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { colors } from "../utils/colors";


function ReturnButton({previousPage}){
    const navigate = useNavigate()
    return(
        <div style={{backgroundColor: colors.light}} className="shadow-md rounded-t-lg py-2 pl-4 pr-4">
        <button
              onClick={() => navigate(previousPage)}
              className={`px-3 rounded cursor-pointer hover:text-white`}
              style={{
                backgroundColor: colors.secondary,
                border: `2px solid ${colors.primary}`,
                color: colors.white 
              }}
              onMouseOver={(e) => {e.target.style.backgroundColor = colors.primary}}
              onMouseOut={(e) => {e.target.style.backgroundColor = colors.secondary}}
        >
    <RiArrowGoBackLine size={28}/>            
    </button>
        </div>
    )
}

export default ReturnButton