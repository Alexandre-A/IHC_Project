import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import "../index.css";
import "../App.css";
import { useTranslation } from "react-i18next";

const flaskPort = 5000;
const falskIp = "127.0.0.1";

function Ads() {
  const { t } = useTranslation();
  const { userType } = useAuth();
  const texts = t("adsPage");
  const [ads, setAds] = useState([]);

  useEffect(() => {
    // fetch ads from backend
    const fetchAds = async () => {
      try {
        const res = await fetch("http://localhost:5000/ads");
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();

        setAds(data);
      } catch (error) {
        console.error("Failed to fetch ads: ", error.message || error);
      }
    };

    // get ads
    fetchAds();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      {/* Placeholder for Search Bar */}
      <div className="w-full max-w-4xl p-4">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled
        />
      </div>

      {/* Scrollable Results Div */}
      <div className="w-full max-w-4xl flex-grow overflow-y-auto bg-white shadow-md rounded-md p-4">
        {ads.length > 0 ? (
          ads.map((ad, index) => (
            <div
              key={index}
              className="p-4 mb-4 border-b border-gray-200 last:border-b-0"
            >
              <h2 className="text-lg font-semibold">{ad.title}</h2>
              <p className="text-gray-600">{ad.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">{t("noAdsMessage")}</p>
        )}
      </div>
    </div>
  );
}

export default Ads;
