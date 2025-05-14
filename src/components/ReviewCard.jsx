import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FaUser } from 'react-icons/fa';
import { colors } from "../utils/colors";



function ReviewCard({name,email,rating,comment}){
    return(
        <div className="max-w-md border rounded-lg shadow-lg p-4 flex flex-col gap-4" style={{backgroundColor: colors.light, borderColor: colors.secondary}}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                <FaUser className="w-6 h-6" style={{color: colors.primary}} />
                <div>
                    <p className="font-semibold" style={{color: colors.dark}}>{name}</p>
                    <p className="text-sm" style={{color: colors.secondary}}>{email}</p>
                </div>
                </div>

                {/* Stars */}
                <div className="flex items-center" style={{color: colors.accent}}>
                {Array.from({ length: 5 }).map((_, index) =>
                    index < rating ? (
                    <AiFillStar key={index} className="w-5 h-5" />
                    ) : (
                    <AiOutlineStar key={index} className="w-5 h-5" />
                    )
                )}
                </div>
            </div>

            {/* Review Text */}
            <p className="text-sm leading-relaxed" style={{color: colors.dark}}>
                {comment}
            </p>
        </div>
    )

}

export default ReviewCard;