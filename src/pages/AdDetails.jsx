import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaHeart, FaRegHeart, FaUserCircle, FaMapMarkerAlt, FaCalendarAlt, FaTransgender, FaBed, FaBath, FaEuroSign, FaTags } from 'react-icons/fa';
import { showToast } from '../components/Toasts/ToastMessages';
import { useToast } from '../components/Toasts/ToastService';
import Modal from '../components/Modal';

const ip = "127.0.0.1";
const port = 5000;

function AdDetails() {
  const { adId } = useParams();
  const { userType } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();
  const adDetailsText = t("adDetails") || {};
  
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch ad details on load
  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://${ip}:${port}/ads/${adId}`);
        
        if (!response.ok) {
          throw new Error('Ad not found');
        }
        
        const data = await response.json();
        setAd(data);
        
        // Check if this ad is in favorites
        const storedFavorites = JSON.parse(localStorage.getItem("userFavorites") || "[]");
        setIsFavorite(storedFavorites.includes(adId));
      } catch (err) {
        console.error('Error fetching ad details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (adId) {
      fetchAdDetails();
    }
  }, [adId]);

  const handleFavorite = () => {
    if (!userType) {
      showToast(toast, {
        type: "info",
        header: adDetailsText.loginRequired || "Login Required",
        message: adDetailsText.loginToFavorite || "You need to be logged in to add to favorites"
      });
      return;
    }

    try {
      const storedFavorites = JSON.parse(localStorage.getItem("userFavorites") || "[]");
      let updatedFavorites;
      
      if (isFavorite) {
        // Remove from favorites
        updatedFavorites = storedFavorites.filter(id => id !== adId);
        setIsFavorite(false);
        showToast(toast, {
          type: "info",
          header: adDetailsText.success || "Success",
          message: adDetailsText.removedFromFavorites || "Removed from favorites"
        });
      } else {
        // Add to favorites
        updatedFavorites = [...storedFavorites, adId];
        setIsFavorite(true);
        showToast(toast, {
          type: "success",
          header: adDetailsText.success || "Success",
          message: adDetailsText.addedToFavorites || "Added to favorites"
        });
      }
      
      localStorage.setItem("userFavorites", JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const handleContact = async () => {
    if (!userType) {
      showToast(toast, {
        type: "info",
        header: adDetailsText.loginRequired || "Login Required",
        message: adDetailsText.loginToContact || "You need to be logged in to contact the landlord"
      });
      return;
    }
    
    if (!message.trim()) {
      showToast(toast, {
        type: "error",
        header: adDetailsText.error || "Error",
        message: adDetailsText.enterMessage || "Please enter a message"
      });
      return;
    }

    try {
      // Create conversation data
      const conversationData = {
        unique_id: `${userType}_${ad.email.split('@')[0]}`,
        date: new Date().toISOString(),
        image_path: ad.image_path,
        name: ad.email === "supreme_landlord@gmail.com" ? "Sr. Danilo" : ad.email,
        is_banned: "false",
        last_message: message,
        messages: [
          [message, "sender"]
        ],
        topic_of_interest: ad.name
      };
      
      // Send the message
      const response = await fetch(`http://${ip}:${port}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(conversationData)
      });
      
      if (response.ok) {
        showToast(toast, {
          type: "success",
          header: adDetailsText.success || "Success",
          message: adDetailsText.messageSent || "Message sent successfully"
        });
        setMessage('');
        setShowContactModal(false);
        
        // Navigate to messages
        setTimeout(() => {
          navigate('/messages');
        }, 1500);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showToast(toast, {
        type: "error",
        header: adDetailsText.error || "Error",
        message: adDetailsText.messageFailed || "Failed to send message"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{adDetailsText.loading || "Loading ad details..."}</p>
        </div>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">{adDetailsText.notFound || "Ad Not Found"}</h2>
          <p className="text-gray-600 mb-6">{adDetailsText.notFoundMessage || "Sorry, we couldn't find the ad you were looking for. It may have been removed or the link is incorrect."}</p>
          <button 
            onClick={() => navigate('/ads')}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            <FaArrowLeft className="inline mr-2" /> {adDetailsText.backToAds || "Back to Ads"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-8 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back button */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/ads')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft />
            <span>{adDetailsText.backToAds || "Back to Ads"}</span>
          </button>
        </div>
        
        {/* Main content */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image and main details */}
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="md:w-1/2 h-80 md:h-auto">
              <img 
                src={ad.image_url} 
                alt={ad.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Main details */}
            <div className="md:w-1/2 p-6">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-800">{ad.name}</h1>
                <div className="flex items-center">
                  <button 
                    onClick={handleFavorite}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                  >
                    {isFavorite ? (
                      <FaHeart className="text-red-500 text-xl" />
                    ) : (
                      <FaRegHeart className="text-xl" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="mt-4 flex items-center space-x-2 text-gray-500">
                <FaMapMarkerAlt />
                <span>{ad.district}, {ad.city}</span>
              </div>
              
              <p className="text-3xl font-bold text-gray-800 mt-4">
                <FaEuroSign className="inline text-xl" /> {ad.price}
              </p>
              
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <FaCalendarAlt />
                  <span>{adDetailsText.available || "Available"}: {ad.available_date}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-700">
                  <FaTransgender />
                  <span>{adDetailsText.gender || "Gender"}: {ad.gender}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-700">
                  <FaBed />
                  <span>{adDetailsText.beds || "Beds"}: {ad.quantity}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-700">
                  <FaBath />
                  <span>{adDetailsText.bathroom || "Bathroom"}: {ad.bath_share}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {adDetailsText.contactLandlord || "Contact Landlord"}
                </button>
              </div>
            </div>
          </div>
          
          {/* Description and additional details */}
          <div className="p-6 border-t">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{adDetailsText.description || "Description"}</h2>
            <p className="text-gray-700">{ad.description}</p>
            
            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{adDetailsText.details || "Details"}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">{adDetailsText.street || "Street"}:</span>
                  <span>{ad.street}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">{adDetailsText.couples || "Couples"}:</span>
                  <span>{ad.marital_status}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">{adDetailsText.expenses || "Expenses"}:</span>
                  <span>{ad.expense_included}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">{adDetailsText.ageRange || "Age Range"}:</span>
                  <span>{ad.min_age} - {ad.max_age}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{adDetailsText.tags || "Tags"}</h2>
              <div className="flex flex-wrap gap-2">
                {ad.tags && ad.tags.map((tag, i) => (
                  <span 
                    key={i} 
                    className="bg-gray-100 px-3 py-1 text-sm rounded-full border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-8 flex items-center space-x-4 border-t pt-4">
              <FaUserCircle className="text-gray-400 text-4xl" />
              <div>
                <p className="font-medium">{adDetailsText.postedBy || "Posted by"}: Sr. Danilo</p>
                <p className="text-sm text-gray-500">{new Date(ad.date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Modal */}
      <Modal open={showContactModal} onClose={() => setShowContactModal(false)}>
        <div className="p-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">{adDetailsText.contactLandlord || "Contact Landlord"}</h2>
          <p className="mb-4 text-gray-600">{adDetailsText.aboutProperty || "About"}: {ad.name}</p>
          
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={adDetailsText.enterMessage || "Enter your message here..."}
            className="w-full p-3 border rounded-md mb-4 h-32"
          ></textarea>
          
          <div className="flex justify-end">
            <button
              onClick={() => setShowContactModal(false)}
              className="px-4 py-2 mr-2 border rounded-md hover:bg-gray-100"
            >
              {adDetailsText.cancel || "Cancel"}
            </button>
            <button
              onClick={handleContact}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {adDetailsText.send || "Send"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AdDetails;