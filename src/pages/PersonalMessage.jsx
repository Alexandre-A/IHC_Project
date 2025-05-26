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
  <div className="w-full max-w-4xl shadow-md rounded-lg p-6 bg-white space-y-6">
    
    {/* Return with Save */}
    <ReturnWithSave
      previousPage="/messages"
      user={user}
      userType={userType}
      messageRef={messageRef}
      messageRefClone={messageRefClone}
    />

    {/* Header */}
    <div className="flex items-center bg-gray-300 rounded-lg p-4 border">
      {messageData.image_path && (
        <img
          src={`../../backend/${messageData.image_path}`}
          alt={messageData.name}
          className="h-24 w-24 rounded-full object-cover border-2 border-black"
        />
      )}
      <p className="ml-6 text-2xl font-bold">{messageData.name}</p>
    </div>

    {/* Messages */}
    <div className="border rounded-lg bg-white p-4 space-y-2 max-h-[60vh] overflow-y-auto">
      {messageData.messages.map((message, id) => (
        <div
          key={id}
          className={`flex ${message[1] === 'receiver' ? 'justify-start' : 'justify-end'}`}
        >
          <p
            className={`p-2 rounded-lg text-white text-sm max-w-[66%] break-words ${
              message[1] === 'receiver' ? 'bg-gray-600' : 'bg-blue-600'
            }`}
          >
            {message[0]}
          </p>
        </div>
      ))}
    </div>

    {/* Message Input */}
    <div className="flex items-center gap-4">
      <input
        type="text"
        value={currentMessage}
        name="message"
        placeholder={privateMessage.type}
        autoComplete="on"
        onChange={handleChange}
        onKeyDown={(e) => e.key === 'Enter' && handleAddMessage()}
        className="flex-1 border rounded px-4 py-2"
      />
      <button
        className="flex items-center px-4 py-2 rounded border-2 border-gray-800 bg-gray-300 hover:bg-gray-500 hover:text-white transition"
        onClick={handleAddMessage}
      >
        <PiPaperPlaneTiltBold />
      </button>
    </div>

  </div>
</div>

  )
}

export default PersonalMessage