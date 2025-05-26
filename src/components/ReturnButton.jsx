import React from "react";
import { RiArrowGoBackLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { colors } from "../utils/colors";


function ReturnButton({previousPage}){
    const navigate = useNavigate()
    return(
        <div
        style={{ backgroundColor: colors.white }}
        className="shadow-md rounded-t-lg py-2 pl-4 pr-4"
      >
        <button
          onClick={() => navigate(previousPage)}
          className="px-3 rounded cursor-pointer flex items-center justify-center border-2 transition-colors duration-200"
          style={{
            backgroundColor: colors.secondary,
            borderColor: colors.primary,
            color: colors.white,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.primary;
            e.currentTarget.style.color = colors.white;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.secondary;
            e.currentTarget.style.color = colors.white;
          }}
        >
          <RiArrowGoBackLine size={28} />
        </button>
      </div>
      
    )
}

export default ReturnButton