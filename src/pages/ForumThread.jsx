import { useEffect, useState } from 'react'
import '../index.css'
import '../App.css'
import Modal from '../components/Modal';
import { useTranslation } from "react-i18next";
import { FaBuilding, FaMapMarkedAlt, FaComments } from 'react-icons/fa';
import { useParams,useNavigate } from 'react-router-dom';
import ReturnButton from '../components/ReturnButton';
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import { colors } from "../utils/colors";


  
function ForumThread() {
  const {t} = useTranslation();
  const forumThread = t("forumThread");
  const { thread } = useParams();

  const navigate = useNavigate();
  const userType = localStorage.getItem("userType"); //null ,'landlord' ,'tennant'
  const [modal, setModal] = useState(null); // null, 'first', 'third'
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [changes, setChanges] = useState(false);



  const [messageData, setMessageData] = useState({
    id: "",
    title: "",
    content: "",
    author: "",
    authorId: "",
    authorType: "",
    category: "",
    datePosted: "",
    likes: 0,
    replies: 0,
    tags: [
        
        ],
    messages: [
        
      ]
    });

  // Fetch existing data only once when the component mounts
useEffect(() => {
    const fetchPrivateMessage = async () => {
      try {
        console.log(thread)
        const res = await fetch("http://localhost:5000/getThread/" + thread);
        const data = await res.json();
        setMessageData(data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
  
    fetchPrivateMessage();
  }, [thread]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "search") setCurrentMessage(value);
    if (name==="image") setSelectedImage(e.target.files[0]);
  };

  useEffect(()=>{
    console.log(selectedImage)
  },[selectedImage])


  const handleAddMessage = async () => {
  const trimmedMessage = currentMessage.trim();
  const hasMessage = trimmedMessage.length > 0;
  const hasImage = selectedImage instanceof File;

  if (!hasMessage && !hasImage) return;

  const newDate = new Date().toISOString();

  // Prepare updated messages preview (this is for local rendering)
  const newMessageEntry = [
    userType === 'landlord' ? "images/senhorio.png" : "images/estudante.png",
    userType === 'landlord' ? "Sr. Danilo" : "Matteo Rossi",
    hasMessage ? trimmedMessage : "",
    hasImage ? `uploads/${selectedImage.name}` : "",
    newDate
  ];

  const updatedMessages = [...messageData.messages, newMessageEntry];

  // Update state immediately (local UI)
  setMessageData((prev) => ({
    ...prev,
    datePosted: newDate,
    replies: prev.replies + 1,
    messages: updatedMessages
  }));

  setCurrentMessage("");
  setSelectedImage(null);
  setChanges(true);

  // Prepare form data for backend
  const formData = new FormData();
  formData.append("id", messageData.id);
  formData.append("title", messageData.title);
  formData.append("content", messageData.content);
  formData.append("author", messageData.author);
  formData.append("authorId", messageData.authorId);
  formData.append("authorType", messageData.authorType);
  formData.append("category", messageData.category);
  formData.append("datePosted", newDate);
  formData.append("likes", messageData.likes);
  formData.append("replies", messageData.replies + 1);
  formData.append("tags", JSON.stringify(messageData.tags));
  formData.append("messages", JSON.stringify(updatedMessages));

  if (hasImage) {
    formData.append("image", selectedImage);
  }

  try {
    const response = await fetch("http://localhost:5000/sendThreadMessage", {
      method: "POST",
      body: formData, // no need to set Content-Type manually
    });

    if (!response.ok) {
      console.error("Failed to send thread message");
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

  

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl rounded-lg p-4 flex flex-col items-start">
          <ReturnButton previousPage={"/forum"}></ReturnButton>       
            {/* Main Content */}
            <div className="w-full max-w-4xl bg-white shadow-md rounded-r-lg rounded-b-lg p-4">
            
    
            
            <div className="border-3 bg-gray-300 shadow-inner flex flex-row  pl-4 pr-4 pb-2 pt-2">
            
                <p className='flex ml-10 text-2xl font-bold  items-center  '>{messageData.title}</p>
            </div>
    
            <div className="border-b-2 border-r-2 border-l-2 h-128 bg-white overflow-y-auto">
              {messageData.messages.map(
                ([avatarSrc, authorName, text, attachment,date], idx) => (
                  <div key={idx} className={`flex items-start space-x-4 border-1 p-4 ${idx%2==0?"bg-white":"bg-gray-200"}`}>
                    {/* 1) Avatar */}
                    <img
                      src={"../../backend/"+avatarSrc}
                      alt={`${authorName} avatar`}
                      className="w-12 h-12 rounded-full object-cover"
                    />

                    {/* 2) Main content */}
                    <div className="flex-1 space-y-1">
                      <div className='flex flex-row justify-between'>
                      {/* Name */}
                      <p className="font-semibold text-gray-800">{authorName}</p>
                      <p className="font-semibold text-gray-800">{formatDate(date)}</p>

                      </div>

                      {/* Message body */}
                      {text && text.length >0 &&
                      <p className="text-gray-700">{text}</p>
                      }

                      {/* 4) Optional attachment */}
                      {attachment && attachment.toLowerCase() !== "no image" && (
                        <>
                        <img
                          src={"../../backend/"+attachment}
                          alt="attachment"
                          className="mt-2 max-w-xs rounded shadow-sm"
                        />
                        </>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>

    
            <div className="border-b-2 border-r-2 border-l-2 flex flex-col gap-2 pl-4 pr-4 pb-3 pt-3" style={{ backgroundColor: colors.white, borderColor: colors.secondary }}>
            <div className="flex flex-row justify-center gap-2">
              <input
                type='text'
                value={currentMessage}
                name="search"
                placeholder={forumThread.type}
                autoComplete='on'
                onChange={(e)=>handleChange(e)}
                className='border rounded w-4/6'
                style={{ borderColor: colors.secondary }}
              />
              <input 
                type="file" 
                name='image' 
                className='border rounded w-2/6 cursor-pointer' 
                style={{ backgroundColor: colors.light, borderColor: colors.secondary }} 
                accept="image/*" 
                onChange={(e)=>{handleChange(e)}} 
              />
              <button
                className={`px-4 py-1 rounded border-2 cursor-pointer transition-colors duration-200`}
                style={{ backgroundColor: colors.secondary, borderColor: colors.primary, color: colors.white }}
                onClick={()=>handleAddMessage()}
                onMouseOver={(e) => e.target.style.backgroundColor = colors.primary}
                onMouseOut={(e) => e.target.style.backgroundColor = colors.secondary}
              >
                <PiPaperPlaneTiltBold />
              </button>
            </div>

            {selectedImage && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Image selected: {selectedImage.name}</p>
              </div>
            )}
          </div>
          </div>
        </div>
        </div>
  )
}

export default ForumThread