import React, {useEffect, useState,useRef} from "react";
import { useNavigate,useLocation } from 'react-router-dom';
import { FaUser, FaCog, FaHome } from "react-icons/fa";
import LanguageSelector from "./language-selector";
import { useTranslation } from "react-i18next";
import LoginModal from "./LoginModal";
import { showToast } from '../components/Toasts/ToastMessages';
import { useToast } from '../components/Toasts/ToastService';
import Modal from '../components/Modal';
import { colors } from "../utils/colors";
import userIcon from '../assets/senhorio.png';
import userIcon2 from '../assets/estudante.png';


function NavbarInicial({ homepage, complete}) {
  const {t} = useTranslation();
  const navbar = t("navbar");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [tabChosen, setTabChosen] = useState("SignIn");
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const [modal, setModal] = useState(null); // null, 'first', 'third'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  

  const links = {
    home: "/",
    forum: "/forum",
    messages: "/messages",
    ads: "/ads",
    myads: "/myads",
    profile: "/profile/" + localStorage.getItem("userType"),
    settings: "/settings",
    login: "/login",
    registo: "/registo",
    form: "/form",
    private: "/privateMessage/:user",
    adInfo: "/adInfo/:ad"
  };

  const currentPath = window.location.pathname;

  const handleHomeClick = () => {
    window.location.href = links.home;
    localStorage.removeItem("edit")
    localStorage.removeItem("Placeholder")
  };

  const handleLocalStorage = (tab) => {
    localStorage.removeItem("edit")
    localStorage.removeItem("Placeholder")
  }

  const handleLogout = () => {
    localStorage.removeItem("userType")
    navigate(links.home)
    showToast(toast, {
      type: "success",
      header: navbar.modalTitle1,
      message: navbar.modalVariation1
    });
  }

  return (
    <div className="sticky top-0 z-50 bg-white shadow-md ">
      <Modal open={modal == "first"} onClose={() => setModal(null)}>
              <div className="text-center w-56">
                <div className="mx-auto my-4 w-48">
                  <h3 className="text-lg font-black text-gray-800">{navbar.modalTitle}</h3>
                  <p className="text-sm text-black my-1">
                    {navbar.modalVariation2}
                  </p>
                </div>
              </div>
            </Modal>
      <Modal open={modal == "third"} onClose={() => setModal(null)}>
        <div className="text-center w-56">
          <div className="mx-auto my-4 w-48">
            <h3 className="text-lg font-black text-gray-800">{navbar.modalTitle}</h3>
            <p className="text-sm text-black my-1">
              {navbar.modalVariation3}
            </p>
          </div>
        </div>
      </Modal>
      <LoginModal 
                isOpen={isLoginOpen} 
                onClose={() => setIsLoginOpen(false)} 
                tabChosen={tabChosen} 
                setTabChosen={setTabChosen}
            />
            <nav className="text-white p-4 flex justify-between items-center" style={{backgroundColor: '#2C3E50'}}> 
              {/* Left: Home icon */}
              <div className="flex items-center space-x-4 text-sm sm:text-base">

        {/* Nav Links */}
        {homepage ? (
          <>
              <button
                      onClick={handleHomeClick}
                      className="cursor-pointer hover:text-[#F39C12]" 
                      style={{color: 'white'}}
                      title="Home"
                    >
              <FaHome className="w-6 h-6" />
            </button>
            <button onClick={() => { setTabChosen("SignIn"); setIsLoginOpen(true); }}
              className="cursor-pointer hover:text-gray-300">
                    {navbar.login}
                </button>
                <button onClick={() => { setTabChosen("SignUp"); setIsLoginOpen(true); }}
                  className="cursor-pointer hover:text-gray-300">
                    {navbar.registo}
                </button>
          </>
        ) : (
          <>
            <a
              onClick={(e)=> {
                if (!localStorage.getItem("userType")) {
                  setModal('third');
                  e.preventDefault(); // prevent navigation
                  return;
                }
                setModal("")
                handleLocalStorage("messages")}}
              href={links.forum}
              className={`hover:text-[#F39C12] ${currentPath === links.forum || location.pathname.startsWith("/forum/") ? "text-[#F39C12]" : ""}`}
            >
              {navbar.forum}
            </a>
            <a
              onClick={(e)=> {
                if (!localStorage.getItem("userType")) {
                  setModal('first');
                  e.preventDefault(); // prevent navigation
                  return;
                }
                setModal("")
                handleLocalStorage("messages")}}
              href={localStorage.getItem("userType")?links.messages:""}
              className={`hover:text-[#F39C12] ${currentPath === links.messages || location.pathname.startsWith("/privateMessage/") ? "text-[#F39C12]" : ""}`}
            >
              {navbar.messages}
            </a>
            <a
              onClick={()=> handleLocalStorage("ads")}
              href={links.ads}
              className={`hover:text-[#F39C12] ${currentPath === links.ads || location.pathname.startsWith("/adInfo/") ? "text-[#F39C12]" : ""}`}
            >
              {navbar.ads}
            </a>
            {complete =='landlord' && (
              <a
                onClick={()=> handleLocalStorage("myads")}
                href={links.myads}
                className={`hover:text-[#F39C12] ${currentPath === links.myads || currentPath === links.form ? "text-[#F39C12]" : ""}`}
              >
                {navbar.myads}
              </a>
            )}
          </>
        )}
      </div>

      {/* Right: Icons */}
      <div className="flex space-x-4">
        <LanguageSelector></LanguageSelector>
        

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="relative flex justify-center items-center border focus:outline-none shadow
            text-white rounded-full cursor-pointer"
            style={{ borderColor: colors.accent }}
          >
            {!localStorage.getItem("userType") ? (
              <FaUser className="w-8 h-8 p-1" title={navbar.profile} />
            ) : (
              localStorage.getItem("userType")=='landlord' ? (
                <img
                  src={userIcon}
                  alt="AUser Icon 1"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <img
                  src={userIcon2}
                  alt="User Icon 2"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )
            )}
          </button>


          {isDropdownOpen && (
            <div className="absolute top-full right-0 min-w-full w-max bg-white shadow-md mt-1 rounded text-black z-50 cursor-pointer">
              <ul className="text-left border rounded">
                {!localStorage.getItem("userType") ? (
                  <>
                    <button
                      className="px-4 py-1 hover:bg-gray-100 border-b hover:text-[#F39C12]"
                      onClick={() => {
                        setTabChosen("SignIn");
                        setIsLoginOpen(true);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {navbar.login}
                    </button>
                    <button
                      className="px-4 py-1 hover:bg-gray-100 border-b hover:text-[#F39C12]"
                      onClick={() => {
                        setTabChosen("SignUp");
                        setIsLoginOpen(true);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {navbar.registo}
                    </button>
                  </>
                ) : (
                  <>
                    <li
                      className="px-4 py-1 hover:bg-gray-100 hover:text-[#F39C12] border-b"
                      onClick={() => {
                        navigate(links.profile);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {navbar.profile}
                    </li>
                    <li
                      className="px-4 py-1 hover:bg-gray-100 hover:text-[#F39C12] border-b"
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                    >
                      {navbar.logOut}
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
        {/*
        <a
          onClick={()=> handleLocalStorage("")} href={links.settings} className="hover:text-gray-300">
          <FaCog className="w-6 h-6" title={navbar.settings} />
        </a>
         */}
      </div>
    </nav>
    </div>
  );
}

export default NavbarInicial;

