import React from "react";
import { FaUser, FaCog, FaHome } from "react-icons/fa";

function NavbarInicial({ homepage, complete, onNavigateHome }) {
  const texts = {
    forum: "Forum",
    messages: "Messages",
    adds: "Ads",
    myadds: "My Ads",
    profile: "Profile",
    settings: "Settings",
    login: "Login",
    registo: "Registo",
  };

  const links = {
    home: "/",
    forum: "/forum",
    messages: "/messages",
    adds: "/adds",
    myadds: "/myadds",
    profile: "/profile",
    settings: "/settings",
    login: "/login",
    registo: "/registo",
  };

  const currentPath = window.location.pathname;

  const handleHomeClick = () => {
    if (onNavigateHome) {
      onNavigateHome(); // Let parent update homepage state
    }
    window.location.href = links.home;
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
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
              href={links.login}
              className={`hover:text-gray-300 ${currentPath === links.login ? "text-yellow-500" : ""}`}
            >
              {texts.login}
            </a>
            <a
              href={links.registo}
              className={`hover:text-gray-300 ${currentPath === links.registo ? "text-yellow-500" : ""}`}
            >
              {texts.registo}
            </a>
          </>
        ) : (
          <>
            <a
              href={links.forum}
              className={`hover:text-gray-300 ${currentPath === links.forum ? "text-yellow-500" : ""}`}
            >
              {texts.forum}
            </a>
            <a
              href={links.messages}
              className={`hover:text-gray-300 ${currentPath === links.messages ? "text-yellow-500" : ""}`}
            >
              {texts.messages}
            </a>
            <a
              href={links.adds}
              className={`hover:text-gray-300 ${currentPath === links.adds ? "text-yellow-500" : ""}`}
            >
              {texts.adds}
            </a>
            {complete && (
              <a
                href={links.myadds}
                className={`hover:text-gray-300 ${currentPath === links.myadds ? "text-yellow-500" : ""}`}
              >
                {texts.myadds}
              </a>
            )}
          </>
        )}
      </div>

      {/* Right: Icons */}
      <div className="flex space-x-4">
        <a href={links.profile} className="hover:text-gray-300">
          <FaUser className="w-6 h-6" title={texts.profile} />
        </a>
        <a href={links.settings} className="hover:text-gray-300">
          <FaCog className="w-6 h-6" title={texts.settings} />
        </a>
      </div>
    </nav>
  );
}

export default NavbarInicial;

