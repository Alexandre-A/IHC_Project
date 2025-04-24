import React from "react";
import { useAuth } from "../AuthContext";
import { FaUser, FaCog, FaHome } from "react-icons/fa";

function NavbarInicial({ homepage, complete}) {
  const texts = {
    forum: "Forum",
    messages: "Messages",
    ads: "Ads",
    myads: "My Ads",
    profile: "Profile",
    settings: "Settings",
    login: "Login",
    registo: "Registo",
  };

  const links = {
    home: "/",
    forum: "/forum",
    messages: "/messages",
    ads: "/ads",
    myads: "/myads",
    profile: "/profile",
    settings: "/settings",
    login: "/login",
    registo: "/registo",
  };

  const currentPath = window.location.pathname;

  const handleHomeClick = () => {
    window.location.href = links.home;
    localStorage.removeItem("edit")
  };

  const handleLocalStorage = () => {
    localStorage.removeItem("edit")
  }

  return (
    <div className="sticky top-0 z-50 bg-white shadow-md ">
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center" style={{backgroundColor: 'rgb(28, 10, 0)'}}>
      {/* Left: Home icon */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleHomeClick}
          className="hover:text-gray-300"
          title="Home"
        >
          <FaHome className="w-6 h-6" />
        </button>

        {/* Nav Links */}
        {homepage ? (
          <>
            <a
              onClick={handleLocalStorage}
              href={links.login}
              className={`hover:text-gray-300 ${currentPath === links.login ? "text-yellow-500" : ""}`}
            >
              {texts.login}
            </a>
            <a
              onClick={handleLocalStorage}
              href={links.registo}
              className={`hover:text-gray-300 ${currentPath === links.registo ? "text-yellow-500" : ""}`}
            >
              {texts.registo}
            </a>
          </>
        ) : (
          <>
            <a
              onClick={handleLocalStorage}
              href={links.forum}
              className={`hover:text-gray-300 ${currentPath === links.forum ? "text-yellow-500" : ""}`}
            >
              {texts.forum}
            </a>
            <a
              onClick={handleLocalStorage}
              href={links.messages}
              className={`hover:text-gray-300 ${currentPath === links.messages ? "text-yellow-500" : ""}`}
            >
              {texts.messages}
            </a>
            <a
              onClick={handleLocalStorage}
              href={links.ads}
              className={`hover:text-gray-300 ${currentPath === links.ads ? "text-yellow-500" : ""}`}
            >
              {texts.ads}
            </a>
            {complete =='landlord' && (
              <a
                onClick={handleLocalStorage}
                href={links.myads}
                className={`hover:text-gray-300 ${currentPath === links.myads ? "text-yellow-500" : ""}`}
              >
                {texts.myads}
              </a>
            )}
          </>
        )}
      </div>

      {/* Right: Icons */}
      <div className="flex space-x-4">
        <a
          onClick={handleLocalStorage} href={links.profile} className="hover:text-gray-300">
          <FaUser className="w-6 h-6" title={texts.profile} />
        </a>
        <a
          onClick={handleLocalStorage} href={links.settings} className="hover:text-gray-300">
          <FaCog className="w-6 h-6" title={texts.settings} />
        </a>
      </div>
    </nav>
    </div>
  );
}

export default NavbarInicial;

