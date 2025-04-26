import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FaUser } from 'react-icons/fa';



function ReviewCard({name,email,rating,comment}){
    return(
        <div className="max-w-md border border-gray-300 bg-white rounded-lg shadow-lg p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                <FaUser className="w-6 h-6" />
                <div>
                    <p className="font-semibold text-gray-800">{name}</p>
                    <p className="text-sm text-gray-500">{email}</p>
                </div>
                </div>

                {/* Stars */}
                <div className="flex items-center text-yellow-400">
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
            <p className="text-sm text-gray-600 leading-relaxed">
                {comment}
            </p>
        </div>
    )

}

export default ReviewCard;