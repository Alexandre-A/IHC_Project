import React, {useEffect, useState} from "react";
import { useNavigate,useLocation } from 'react-router-dom';
import { FaUser, FaCog, FaHome } from "react-icons/fa";
import LanguageSelector from "./language-selector";
import { useTranslation } from "react-i18next";
import LoginModal from "./LoginModal";
import { showToast } from '../components/Toasts/ToastMessages';
import { useToast } from '../components/Toasts/ToastService';
import Modal from '../components/Modal';


function NavbarInicial({ homepage, complete}) {
  const {t} = useTranslation();
  const navbar = t("navbar");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [tabChosen, setTabChosen] = useState("SignIn");
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const [modal, setModal] = useState(null); // null, 'first', 'third'
  const userType = localStorage.getItem("userType")



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
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center" style={{backgroundColor: 'rgb(28, 10, 0)'}}>
      {/* Left: Home icon */}
      <div className="flex items-center space-x-4 text-sm sm:text-base ">
        <button
          onClick={handleHomeClick}
          className="hover:text-gray-300 cursor-pointer"
          title="Home"
        >
          <FaHome className="w-6 h-6" />
        </button>

        {/* Nav Links */}
        {homepage ? (
          <>
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
              className={`hover:text-gray-300 ${currentPath === links.forum  ||location.pathname.startsWith("/forum/")? "text-yellow-500" : ""}`}
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
              className={`hover:text-gray-300 ${currentPath === links.messages ||location.pathname.startsWith("/privateMessage/") ? "text-yellow-500" : ""}`}
            >
              {navbar.messages}
            </a>
            <a
              onClick={()=> handleLocalStorage("ads")}
              href={links.ads}
              className={`hover:text-gray-300 ${currentPath === links.ads ||location.pathname.startsWith("/adInfo/") ? "text-yellow-500" : ""}`}
            >
              {navbar.ads}
            </a>
            {complete =='landlord' && (
              <a
                onClick={()=> handleLocalStorage("myads")}
                href={links.myads}
                className={`hover:text-gray-300 ${currentPath === links.myads || currentPath === links.form ? "text-yellow-500" : ""}`}
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
        

        <button className="relative flex justify-center items-center  border focus:outline-none shadow
        text-white rounded-full focus:ring ring-white group cursor-pointer">
          <FaUser className="w-6 h-6 p-1" title={navbar.profile} />
          <div className="absolute hidden group-focus:block top-full right-0 min-w-full w-max bg-white shadow-md mt-1 rounded text-black">
            <ul className="text-left border rounded">
              {!localStorage.getItem("userType")?
              <>
              <li className="px-4 py-1 hover:bg-gray-100 border-b"
              onClick={() => { setTabChosen("SignIn"); setIsLoginOpen(true); }}>{navbar.login}</li>
              <li className="px-4 py-1 hover:bg-gray-100 border-b"
              onClick={() => { setTabChosen("SignUp"); setIsLoginOpen(true); }}>{navbar.registo}</li>
              </>:<>
              <li className="px-4 py-1 hover:bg-gray-100 border-b"
              onClick={()=>navigate(links.profile)}>{navbar.profile}</li>
              <li className="px-4 py-1 hover:bg-gray-100 border-b"
              onClick={handleLogout}>{navbar.logOut}</li>
              </>
              }

            </ul>

          </div>
        </button>
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

