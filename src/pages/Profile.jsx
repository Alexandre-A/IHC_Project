import { useState,useEffect } from 'react'
import '../index.css'
import '../App.css'
import estudanteImg from '../assets/estudante.png';
import landlordImg from '../assets/senhorio.png';
import { useParams } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import ReviewCard from '../components/ReviewCard';
import { HiOutlineBadgeCheck } from "react-icons/hi";
import Modal from "../components/Modal";
import { colors } from "../utils/colors";




function Profile() {
  const { userType } = useParams();
  const {t} = useTranslation();
  const profile = t("profile");
  const [roomData,setRoomData] = useState([]);
  const type = localStorage.getItem("userType");
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [email, setEmail] = useState(type==='landlord'?"supreme_landlord@gmail.com":"thestudent@gmail.com");
  const [name, setName] = useState(type==='landlord'?"Sr Danilo":"Matteo Rossi");

  // Open and close tag modal
  const openTagModal = () => setIsTagModalOpen(true);
  const closeTagModal = () => {
    const numericRating = Number(rating);
    console.log(rating)
    if (rating===''|| isNaN(numericRating) || numericRating < 0 || numericRating > 5) {
      return;
    }
    if (userType === 'landlord') {
      const updatedData = {
        ...LandlordData,
        review: [
          ...LandlordData.review,
          {
            name: name,
            email: email,
            rating: numericRating,
            comment: comment,
          }
        ]
      };
      setLandlordData(updatedData);
      localStorage.setItem('landlordData', JSON.stringify(updatedData));
    } else {
      const updatedData = {
        ...TenantData,
        review: [
          ...TenantData.review,
          {
            name: name,
            email: email,
            rating: numericRating,
            comment: comment,
          }
        ]
      };
      setTenantData(updatedData);
      localStorage.setItem('tennantData', JSON.stringify(updatedData));
    }
    

    setIsTagModalOpen(false);
    setRating('');
    setComment('');}

  
  
  const [TenantData,setTenantData] = useState({
    photo: estudanteImg,
    name: "Matteo Rossi",
    contact: "936 137 388",
    email:"thestudent@gmail.com",
    nationality: "Italian",
    review: [
      {
        name: "Ana Silva",
        email: "ana.silva@gmail.com",
        rating: 5,
        comment: "Matteo was a wonderful tenant! Always paid rent on time and kept the apartment in excellent condition."
      },
      {
        name: "Carlos M.",
        email: "carlos.monteiro@gmail.com",
        rating: 4,
        comment: "Bom estudante, respeitoso e organizado. Não houve problemas durante o contrato de arrendamento."
      }
    ],
    canMessage: type?(type==='tenant'?false:true):(false),
    canReview: type?(type==='tenant'?false:true):(false),
    canEdit: type?(type==='tenant'?true:false):(false),    
  })

  const [LandlordData, setLandlordData] = useState({
    photo: landlordImg,
    name: "Sr. Danilo",
    contact: "969452366",
    email:"supreme_landlord@gmail.com",
    nationality: "Portuguese",
    review: [
      {
        name: "Laura P.",
        email: "laura.pereira@gmail.com",
        rating: 5,
        comment: "Sr. Danilo was an amazing landlord. Always quick to solve any issues and very fair with the rental terms!"
      },
      {
        name: "João Ferreira",
        email: "joao.ferreira@gmail.com",
        rating: 4,
        comment: "A experiência foi muito boa. O Sr. Danilo é atencioso e manteve o apartamento sempre em boas condições."
      },
      {
        name: "Miguel Santos",
        email: "miguel.santos@gmail.com",
        rating: 5,
        comment: "Excelente senhorio! Sempre disponível para ajudar e muito compreensivo. Recomendo a 100%."
      }
      
    ],
    canMessage: type?(type==='landlord'?false:true):(false),
    canReview: type?(type==='landlord'?false:true):(false),
    canEdit: type?(type==='landlord'?true:false):(false),

    })

  const [pageData,setPageData] = useState(userType==="landlord"? LandlordData: TenantData);

  useEffect(()=>{
    setPageData(userType==="landlord"? LandlordData: TenantData)
  },[LandlordData,TenantData])

  useEffect(() => {
    const savedLandlord = localStorage.getItem('landlordData');
    const savedTennant = localStorage.getItem('tennantData');
  
    if (savedLandlord) {
      setLandlordData(JSON.parse(savedLandlord));
    }
    if (savedTennant) {
      setTenantData(JSON.parse(savedTennant));
    }
  }, []);
  

  useEffect(() => {
      const fetchAds = async () => {
        try {
          const res = await fetch("http://localhost:5000/ads/");
          const data = await res.json();
          setRoomData(data);
        } catch (err) {
          console.error("Failed to fetch ads:", err);
        }
      };
    
      fetchAds();
    }, []); 

    useEffect(()=>{
      console.log(roomData)
    },[roomData])

  return (
    
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Modal open={showValidationModal} onClose={() => setShowValidationModal(false)}>
      <div className="fixed inset-0 bg-black/30 z-60 flex items-center justify-center">   
        <div className="bg-white p-6 rounded-lg shadow-lg text-center w-56">
                <div className="mx-auto my-4 w-48">
                  <h3 className="text-lg font-black text-gray-800">{profile.validationTitle}</h3>
                  <p className="text-sm text-gray-500 my-1">{validationMessage}</p>
                </div>
              </div>
            </div>
                  </Modal>
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-4">
        <div className="border-t-2 border-r-2 border-l-2 bg-white rounded-t flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between pl-4 pr-4 pb-2 pt-2">
          <div className=" flex flex-row justify-between"> 
            <div>
            <div className="relative w-[140px] h-[140px]">
              <img 
                src={pageData.photo} 
                alt="A nice photo"
                className="w-full h-full rounded-full object-cover border-2 border-gray-300 p-1"
              />

              <HiOutlineBadgeCheck 
                className={`absolute bottom-1 right-1 ${userType==='landlord'?"text-blue-500":"text-black"} rounded-full w-10 h-10 p-1 translate-x-1/4 translate-y-1/4`}
              />
            </div>
            </div>

            <div className="flex-1 ml-4 pl-2 ">
              <p className='mt-1'><b>{profile.name}: </b>{pageData.name}</p>
              <p className='my-2'><b>Email: </b>{pageData.email}</p>
              <p className='my-2'><b>{profile.contact}: </b>{pageData.contact}</p>
              <p className=''><b>{profile.nationality}: </b>{pageData.nationality}</p>
            </div>
          </div>
          <div className='flex flex-row justify-center items-baseline '>
            {pageData.canMessage?
            <button className="px-4 rounded bg-gray-300 border-2 border-gray-800 cursor-pointer hover:text-white hover:bg-gray-500">
              + {profile.message}
            </button>:<></>
            }
            {pageData.canEdit?
            <button className="px-4 rounded bg-gray-300 border-2 border-gray-800 cursor-pointer hover:text-white hover:bg-gray-500">
              + {profile.edit}
            </button>:<></>
            }
          </div>
        </div>

        
        <div className="border-2 bg-white flex flex-col justify-center pl-4 pr-4 pb-4 pt-1">

          <p className='my-1 pl-2'><b>{userType==='landlord'?profile.owns:profile.livedIn} </b></p>
          <div className="w-full max-w-4xl border-1 p-2 bg-gray-100 shadow-md rounded-lg h-[440px] overflow-y-auto">        
            {roomData.map((ad, index) => (
              (userType==='landlord' || index % 2 === 0) ? (   
                <div key={index} className="flex flex-col md:flex-row w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden md:h-48 mb-4">
                  <img
                    src={ad.image_url}
                    alt="Room"
                    className="w-full md:w-1/3 h-64 md:h-full object-cover border-2 md:rounded-none rounded-t"
                  />
                  <div className="w-full md:w-2/3 p-4 flex flex-col justify-between">
                    <h3 className="text-lg font-semibold overflow-hidden text-ellipsis whitespace-nowrap">{ad.name}</h3>
                    <p className="text-sm text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">{ad.description}</p>
                    <p className="text-xl font-semibold text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">{ad.price}€</p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {ad.tags?.slice(0, 5).map((tag, i) => (
                        <span key={i} className="bg-gray-100 px-3 py-1 text-xs rounded-full border">{tag}</span>
                      ))}
                      {ad.tags?.length > 5 && (
                        <span className="bg-gray-100 px-3 py-1 text-xs rounded-full border">{ad.tags.length - 5}+</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <></> 
              )
            ))}
          </div>
        </div>

        <div className="border-t-2 border-r-2 border-l-2 rounded-t-lg flex flex-col justify-center pl-4 pr-4 pb-4 pt-2" style={{ backgroundColor: colors.white, borderColor: colors.secondary }}>
          <div className='flex flex-row justify-between'>
            <p className=' pl-2'><b>{profile.reviews}</b></p>
            {pageData.canMessage?
            <button className="px-4 text-sm rounded border-2 cursor-pointer hover:text-white transition-colors duration-200"
            style={{ backgroundColor: colors.light, borderColor: colors.secondary, color: colors.dark }}
            onClick={openTagModal}
            onMouseOver={(e) => e.target.style.backgroundColor = colors.secondary}
            onMouseOut={(e) => e.target.style.backgroundColor = colors.light}>
              + Review
            </button>:<></>}
          </div>
          <div className="w-full max-w-4xl p-2 rounded-lg h-[180px] flex flex-col md:flex-row overflow-y-auto md:overflow-x-auto md:overflow-y-hidden" style={{ backgroundColor: colors.light }}>   
            {pageData.review.map((ad,index)=>(
              <ReviewCard key={index} name={ad.name} email={ad.email} rating={ad.rating} comment={ad.comment}></ReviewCard>
            ))}         
          </div>
        </div>
      </div>
      {isTagModalOpen && (
                  <div className="fixed inset-0 visible bg-black/30 flex items-center transition-colors justify-center z-50">                  <div className="rounded-lg p-6 w-full max-w-md" style={{ backgroundColor: colors.white }}>
                    <h2 className="text-lg font-medium mb-4">Review</h2>
                    <div className="flex space-x-2 mb-4 flex-col">
                      <input
                        type="text"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        placeholder={`${profile.enterRating}`}
                        className={`w-full p-2 border rounded mb-2 ${(isNaN(Number(rating)) || Number(rating) < 0 || Number(rating) > 5||rating==='')?"border-red-600":"border-green-600"}`}
                      />

                      <textarea
                      className="w-full p-2 border rounded"
                      placeholder={`${profile.enterComment}`}
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}>

                      </textarea>
                      
                    </div>
                    <button
                      onClick={closeTagModal}
                      className="w-full p-2 cursor-pointer text-white rounded transition-colors duration-200"
                      style={{ backgroundColor: colors.secondary }}
                      onMouseOver={(e) => e.target.style.backgroundColor = colors.primary}
                      onMouseOut={(e) => e.target.style.backgroundColor = colors.secondary}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
    </div>
  )
}

export default Profile