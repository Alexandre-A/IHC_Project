import { useEffect, useState, useRef } from 'react'
import { useAuth } from "../AuthContext";
import '../index.css'
import '../App.css'
import NavbarInicial from '../components/NavbarIncial'
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/language-selector';
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import { useParams } from 'react-router-dom';
import ReturnButton from '../components/ReturnButton';
import { useNavigate } from "react-router-dom";



function PersonalMessage() {
  const {t} = useTranslation()
  const privateMessage = t("privateMessage")
  const userType = localStorage.getItem("userType")
  const { user } = useParams();
  const [currentMessage, setCurrentMessage] = useState("");
  const [changes,setChanges] = useState(false);
  
  
  const [messageData, setMessageData] = useState({
    unique_id: "",
    date: "",
    image_path: "",
    name: "",
    is_banned: "",
    last_message: "",
    messages: [],
    topic_of_interest: ""
});

const [reciprocateData, setReciprocateData] = useState({
    unique_id: "",
    date: "",
    image_path: "",
    name: "",
    is_banned: "",
    last_message: "",
    messages: [],
    topic_of_interest: ""
});



const messageRef = useRef(messageData); // Use ref to store the message data without causing re-renders
const messageRefClone = useRef(reciprocateData);

// Fetch existing data only once when the component mounts
useEffect(() => {
  const fetchPrivateMessage = async () => {
    try {
      const res = await fetch("http://localhost:5000/getMessage/" + user);
      const data = await res.json();
      setMessageData(data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  fetchPrivateMessage();

  if (userType==='landlord'&&user==='tenant'){
    const fetchPrivateMessage2 = async () => {
        try {
          const res = await fetch("http://localhost:5000/getMessage/" + userType);
          const data = await res.json();
          setReciprocateData(data);
        } catch (err) {
          console.error("Failed to fetch messages:", err);
        }
      };
    
      fetchPrivateMessage2()
  } else if (userType==='tenant'&&user==='landlord'){
    const fetchPrivateMessage2 = async () => {
        try {
          const res = await fetch("http://localhost:5000/getMessage/" + userType);
          const data = await res.json();
          setReciprocateData(data);
        } catch (err) {
          console.error("Failed to fetch messages:", err);
        }
      };
    
      fetchPrivateMessage2()
  }
}, [user]);

useEffect(() => {
  messageRef.current = messageData; // Update messageRef whenever messageData changes
  messageRefClone.current = reciprocateData;
  console.log("Image Path:", messageData.image_path);
  console.log("Image Path:", messageData);
}, [messageData]);

// Send data when the page is about to be unloaded or navigated away from
useEffect(() => {
  const handleBeforeUnload = () => {
    const blob = new Blob([JSON.stringify(messageRef.current)], { type: "application/json" });
    navigator.sendBeacon("http://localhost:5000/sendMessage", blob);

    if((user==='landlord'&&userType==='tenant')||(user==='tenant'&&userType==='landlord')){
      localStorage.setItem("ifConditionTriggered", "true");
        const blob2 = new Blob([JSON.stringify(messageRefClone.current)], { type: "application/json" });
        navigator.sendBeacon("http://localhost:5000/sendMessage", blob2);}
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  // Cleanup: Remove the event listener when the component is unmounted or the page is closed/navigated away
  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, []); // Empty dependency array to ensure this effect runs only once when the component mounts


useEffect(() => {
  if (localStorage.getItem("ifConditionTriggered")) {
    console.log("✅ IF statement ran on last unload.");
    localStorage.removeItem("ifConditionTriggered");
  }
}, []);

const handleChange = (e) => {
  const { name, value } = e.target;
  if (name === "search") setCurrentMessage(value);
};

const handleAddMessage = async () => {
  const trimmedMessage = currentMessage.trim();
  if (!trimmedMessage) return;

  // ✅ Always update messageData (sender's own messages)
  setMessageData((prev) => ({
    ...prev,
    last_message: trimmedMessage,
    messages: [...prev.messages, [trimmedMessage, "sender"]],
  }));

  // ✅ Always update reciprocateData (receiver's perspective)
  if ((user === 'landlord' && userType === 'tenant') || (user === 'tenant' && userType === 'landlord')) {
    setReciprocateData((prev) => ({
      ...prev,
      last_message: trimmedMessage,
      messages: [...prev.messages, [trimmedMessage, "receiver"]],
    }));
  }

  setCurrentMessage(""); // ✅ Clear after both updates
  setChanges(true);
};



  /* Notes to remember:
  sendBeacon() is a special browser API that allows you to send small amounts of data to a server 
  in the background, even during page unload — like when the user is refreshing, closing the tab, 
  or navigating away.

  Most fetch or AJAX requests get canceled if you try to send them while the page is unloading.

    But sendBeacon() is built to work in exactly that scenario. It tells the browser:

    “Hey, here's some data to send to the server. You don’t need to wait for a response — just do it when you can.”
  */



    function ReturnWithSave({ previousPage, user, userType, messageRef, messageRefClone }) {
      const navigate = useNavigate();
    
      const handleClick = () => {
        console.log("HANDLE CLICK FIRED");
        console.log("changes:", changes);
        console.log("messageData:", messageData);
        console.log("reciprocateData:", reciprocateData);
      
        if (changes) {
          // Manual sync
          messageRef.current = messageData;
          messageRefClone.current = reciprocateData;
      
          console.log("SENDING messageRef:", messageRef.current);
          console.log("SENDING messageRefClone:", messageRefClone.current);
      
          const blob = new Blob([JSON.stringify(messageRef.current)], {
            type: "application/json",
          });
          navigator.sendBeacon("http://localhost:5000/sendMessage", blob);
      
          const shouldSendClone =
            (user === "landlord" && userType === "tenant") ||
            (user === "tenant" && userType === "landlord");
      
          if (shouldSendClone) {
            const blob2 = new Blob([JSON.stringify(messageRefClone.current)], {
              type: "application/json",
            });
            navigator.sendBeacon("http://localhost:5000/sendMessage", blob2);
          }
        } else {
          console.log("Skipping send due to changes === false");
        }
      
        navigate(previousPage);}
    
      return (
        <div onClick={handleClick}>
          <ReturnButton previousPage={previousPage} />
        </div>
      );
    }
    
    // ...later in the same file, inside your render:
    <ReturnWithSave
      previousPage="/messages"
      user={user}
      userType={userType}
      messageRef={messageRef}
      messageRefClone={messageRefClone}
    />

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl  shadow-md rounded-lg p-4 flex flex-col items-start">
        <ReturnWithSave
          previousPage="/messages"
          user={user}
          userType={userType}
          messageRef={messageRef}
          messageRefClone={messageRefClone}
        />        
        {/* Main Content */}
        <div className="w-full max-w-4xl bg-white shadow-md rounded-r-lg rounded-b-lg p-4">
        

        
        <div className="border-2 bg-white flex flex-row  pl-4 pr-4 pb-2 pt-2">
        {messageData.image_path ? (
          <img
            src={"../../backend/"+messageData.image_path}
            alt={messageData.name}
            className="ml-2 border-black rounded-full h-24 w-24 object-cover border-3"
          />
        ) : null}

            <p className='flex ml-10 text-2xl font-bold  items-center  '>{messageData.name}</p>
        </div>

        <div className="border-b-2 border-r-2 border-l-2 bg-white flex flex-col justify-center pl-4 pr-4 pb-4 pt-4">
        {messageData.messages.map((message,id)=>(
                message[1]==='receiver'?(
                
                <div key={id} className='flex justify-start'>
                    <p className='border-3 pl-1 pr-1 rounded border-black text-white bg-gray-600 w-2/6 mb-1 text-wrap wrap-break-word'>{message[0]}</p>
                </div>):
                (<div key={id} className='flex justify-end'>
                    <p className='border-3 pl-1 pr-1 rounded border-black w-2/6 mb-1 text-white bg-blue-600 text-wrap wrap-break-word'>{message[0]}</p>
                </div>)
            ))}
          
        </div>

        <div className="border-b-2 border-r-2 border-l-2 bg-white flex flex-row justify-center pl-4 pr-4 pb-3 pt-3">
            <input type='text'value={currentMessage} name="search" placeholder={privateMessage.type} autoComplete='on' onChange={handleChange} className='border-1 rounded bg-white w-4/6'
            onKeyDown={(e)=>{
                if (e.key==="Enter") handleAddMessage();
            }}></input>
                  <button className={`px-4 py-1 rounded right-4 bg-gray-300 border-2 border-gray-800 cursor-pointer hover:text-white hover:bg-gray-500 `}
                          onClick={handleAddMessage}><PiPaperPlaneTiltBold /></button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default PersonalMessage