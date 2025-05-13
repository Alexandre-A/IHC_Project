import { useEffect, useState,useMemo } from 'react'
import '../index.css'
import '../App.css'
import { useTranslation } from 'react-i18next';
import { useParams,useNavigate } from 'react-router-dom';
import ReturnButton from '../components/ReturnButton';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import Detail from '../components/Detail';
import { FaTrashAlt,FaShareAlt,FaHeart,FaSortAmountUpAlt,FaSortAmountDown,FaRegHeart} from "react-icons/fa";
import { LuMessageCircleMore } from "react-icons/lu";
import Modal from '../components/Modal';
import { showToast } from "../components/Toasts/ToastMessages";
import { useToast } from "../components/Toasts/ToastService";
import ReviewCard from '../components/ReviewCard';

const defaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadowUrl,
});

function AdInfo() {
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation()
  const adInfo = t("adInfo");
  const adFormPt1 = t("adFormPt1");
  const { ad } = useParams();
  const [userType,setUserType] = useState(localStorage.getItem('userType'))
  const [modal, setModal] = useState(null); // null, 'first', 'third'
  const [pageData, setPageData] = useState({
    review: [
      {
        name: "Emily Chen",
        email: "emily.chen@example.com",
        rating: 5,
        comment: "One of the best rental experiences I've had. The apartment was spotless and well-equipped."
      },
      {
        name: "Carlos Mendes",
        email: "carlos.mendes@gmail.com",
        rating: 3,
        comment: "A localização era ótima, mas houve alguns problemas com o aquecedor durante o inverno."
      },
      {
        name: "James O'Hara",
        email: "james.ohara@example.com",
        rating: 2,
        comment: "The place was okay, but communication with the landlord could have been much better."
      },
      {
        name: "Ana Beatriz",
        email: "ana.b@gmail.com",
        rating: 5,
        comment: "Apartamento impecável! Tive uma estadia maravilhosa e o proprietário foi sempre muito gentil."
      },
      {
        name: "Tomás Oliveira",
        email: "tomas.oliveira@gmail.com",
        rating: 3,
        comment: "A estadia foi razoável, mas achei o apartamento menor do que nas fotos."
      },
      {
        name: "Helen Moore",
        email: "helen.moore@example.com",
        rating: 5,
        comment: "Absolutely loved staying here! Quiet neighborhood and the host was very thoughtful."
      },
      {
        name: "Sofia Lima",
        email: "sofia.lima@gmail.com",
        rating: 4,
        comment: "Gostei muito do apartamento, limpo e bem localizado. O senhorio foi educado e prestativo."
      },
      {
        name: "Robert Klein",
        email: "robert.klein@example.com",
        rating: 2,
        comment: "The location was good, but the place was dusty and not well maintained."
      },
      {
        name: "Mariana Nunes",
        email: "mariana.nunes@gmail.com",
        rating: 4,
        comment: "Boa experiência no geral. Tive um pequeno problema com a internet, mas foi resolvido rapidamente."
      },
      {
        name: "Isabela Rocha",
        email: "isabela.rocha@gmail.com",
        rating: 5,
        comment: "Tudo perfeito! O Sr. Danilo cuidou de todos os detalhes para garantir uma estadia confortável."
      }
    ],
  });
  const displayedReviews = useMemo(() => {
    const shuffled = [...pageData.review].sort(() => 0.5 - Math.random());
    const guaranteed = shuffled.slice(0, 2);
    const remaining = shuffled.slice(2);
    return [
      ...guaranteed,
      ...remaining.filter(() => Math.random() < 0.1),
    ];
  }, [pageData.review]); // Only re-run if reviews change
  
  


  const [formData, setFormData] = useState({
    date: new Date().toISOString(),
    name: "",
    price: "",
    available_date: "",
    gender: "Indifferent",
    quantity: "",
    description: "",
    district: "",
    city: "",
    street: "",
    min_age: "",
    max_age: "",
    marital_status: "Yes",
    expense_included: "Yes",
    bath_share: "Shared",
    tags: [],
    image: null,
    isNew: [true, ""]
  });

  const [coordinates, setCoordinates] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(18); 

  const handleMessage = () =>{
    if (userType==='landlord'){
     setModal("Active")
    }else navigate("/privateMessage/landlord")
  };
  
  const handleFavourite =()=>{
    showToast(toast, {
      type: "warning",
      header: adInfo.warning,
      message: adInfo.warningMessage
    });
  }
  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await fetch(`http://localhost:5000/ads/${ad}`);
        if (!response.ok) throw new Error("Ad not found");
        const data = await response.json();
  
        setFormData(prev => ({
          ...prev,
          ...data,
          image: data.image_url || null,
          isNew: [false, ad]
        }));
  
        let usedFallback = false;

      let address = `${data.street}, ${data.city}, ${data.district}, Portugal`;
      let geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      let geoData = await geoRes.json();

      if (!geoData.length) {
        console.warn("Full address not found, falling back to city + district");
        address = `${data.city}, ${data.district}, Portugal`;
        geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        geoData = await geoRes.json();
        usedFallback = true;
      }

      if (geoData.length > 0) {
        setCoordinates([parseFloat(geoData[0].lat), parseFloat(geoData[0].lon)]);
        setZoomLevel(usedFallback ? 14 : 18); // lower zoom if fallback was used
      }

  
      } catch (error) {
        console.error("Error fetching ad or geolocation:", error);
      }
    };
  
    fetchAd();
  }, []);
  

    return(<>
    <Modal open={modal == "Active"} onClose={() => setModal(null)}>
                <div className="text-center w-56">
                  <div className="mx-auto my-4 w-48">
                    <h3 className="text-lg font-black text-gray-800">{adInfo.modalTitle2}</h3>
                    <p className="text-sm text-gray-500 my-1">
                      {adInfo.cannot}
                    </p>
                  </div>
                </div>
              </Modal>
     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-4xl rounded-xl shadow-lg bg-white p-6 space-y-6">
        <div className='flex flex-row justify-between'>
        <ReturnButton previousPage={"/ads"} />
          <div className="flex gap-3 justify-end shadow-md rounded-t-lg py-2 pl-4 pr-4">
            <button
              className="p-2 border rounded hover:bg-gray-200 transition-colors duration-200 cursor-pointer flex items-center gap-2"
              onClick={() => handleMessage()}
            >
              <LuMessageCircleMore size={25} className="inline-flex align-middle" />
              <span className="inline-flex align-middle"></span>
            </button>
            <button
              className="p-2 border rounded hover:bg-gray-200 transition-colors duration-200 cursor-pointer flex items-center gap-2"
              onClick={() => handleFavourite()}
            >
              <FaHeart size={25} className="inline-flex align-middle" />
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 border-b pb-2 break-words whitespace-normal">
          {formData.name || "Ad Details"}
        </h1>

        {/* Image + Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full aspect-video border rounded-xl bg-gray-50 overflow-hidden flex items-center justify-center">
            {formData.image ? (
              <img
                src={
                  typeof formData.image === "string"
                    ? formData.image
                    : URL.createObjectURL(formData.image)
                }
                alt="Ad Visual"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400">No image uploaded</span>
            )}
          </div>
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-700 break-words whitespace-normal">
              {formData.description || "No description provided"}
            </p>
            <p className="text-sm text-gray-600 break-words whitespace-normal">
              <b>{adFormPt1.available}:</b>{" "}
              {formData.available_date || "No date provided"}
            </p>
            <p className="text-sm text-gray-600 break-words whitespace-normal">
              <b>{adFormPt1.price}:</b>{" "}
              {formData.price + "€" || "No price provided"}
            </p>
            <a href="/profile/landlord" className=" text-blue-600 hover:underline block text-left overflow-hidden text-ellipsis whitespace-nowrap">
              Sr. Danilo
            </a>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {/* Left Details */}
          <div className="space-y-4">
            <Detail label={adFormPt1.lookingFor}>
              {formData.min_age} - {formData.max_age || "Not specified"} {adInfo.years}
            </Detail>
            <Detail label={adFormPt1.couples} value={formData.marital_status} />
            <Detail label={adFormPt1.gender} value={formData.gender} />
            <Detail label={adFormPt1.quantity} value={formData.quantity || "Not specified"} />
            <Detail label={adFormPt1.expenses} value={formData.expense_included} />
            <Detail label={adFormPt1.bathroom} value={formData.bath_share} />
          </div>

          {/* Location + Map */}
          <div className="space-y-4">
            <Detail label={adFormPt1.location}>
              {formData.district}, {formData.city}
            </Detail>
            <Detail label={adFormPt1.street} value={formData.street || "No street provided"} />

            <div className="rounded-lg overflow-hidden shadow border">
              {coordinates ? (
                <MapContainer center={coordinates} zoom={zoomLevel} className="w-full h-64">
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={coordinates} />
                </MapContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
                  Loading map or location not found...
                </div>
              )}
            </div>

            {zoomLevel === 14 && (
              <p className="text-red-600 text-sm italic text-center mt-1">
                📍 {adInfo.errorMap}
              </p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold mb-1">Tags:</label>
          <div className="flex flex-wrap gap-2">
            {formData.tags.length > 0 ? (
              formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No tags added</p>
            )}
          </div>
        </div>
        <div className="border-2 rounded bg-white flex flex-col justify-center pl-4 pr-4 pb-4 pt-1">
          <div className='flex flex-row justify-between'>
            <p className=' pl-2'><b>{adInfo.reviews}</b></p>
            <button className="px-4 text-sm rounded bg-gray-300 border-2 border-gray-800 cursor-pointer hover:text-white hover:bg-gray-500"
            onClick={()=>handleFavourite()}>
              + Review
            </button>
          </div>
          <div className="w-full max-w-4xl p-2 rounded-lg h-[180px] flex flex-col md:flex-row overflow-y-auto md:overflow-x-auto md:overflow-y-hidden">   
          {displayedReviews.map((ad, index) => (
            <ReviewCard
              key={index}
              name={ad.name}
              email={ad.email}
              rating={ad.rating}
              comment={ad.comment}
            />
          ))}


          </div>
        </div>
      </div>
    </div>

    </>)
}

export default AdInfo