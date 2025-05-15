import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import "../App.css";
import Modal from "../components/Modal";
import { useTranslation } from "react-i18next";
import { FaBuilding, FaMapMarkedAlt, FaComments } from "react-icons/fa";
import { colors, getColorWithOpacity } from "../utils/colors";

function Homepage() {
  const { t } = useTranslation();
  const homepage = t("homepage");

  // Colors are imported from utils/colors.js

  const data = [
    {
      bgColor: colors.primary,
      hoverColor: getColorWithOpacity("primary", 0.9), // Lighter primary
      icon: <FaBuilding size={40} style={{color: colors.accent}} className="mr-3" />,
      heading: homepage.header1,
      paragraph: homepage.paragraph1,
      inverted: false,
      onclick: (userType, setModal) => {
        if (userType !== "landlord") setModal("first");
        else navigate("/myads");
      },
    },
    {
      bgColor: colors.secondary,
      hoverColor: getColorWithOpacity("secondary", 0.9), // Lighter secondary
      icon: <FaMapMarkedAlt size={40} style={{color: colors.accent}} className="mr-3" />,
      heading: homepage.header2,
      paragraph: homepage.paragraph2,
      inverted: true,
      onclick: () => {
        navigate("/ads");
      },
    },
    {
      bgColor: colors.info,
      hoverColor: getColorWithOpacity("info", 0.9), // Lighter info
      icon: <FaComments size={40} style={{color: colors.accent}} className="mr-3" />,
      heading: homepage.header3,
      paragraph: homepage.paragraph3,
      inverted: false,
      onclick: (userType, setModal) => {
        if (userType === null) setModal("third");
        else navigate("/forum");
      },
    },
  ];

  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const [modal, setModal] = useState(null);

  useEffect(() => {
    if (modal !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modal]);

  return (
    <>
      <div className="h-screen w-full flex flex-col items-center justify-center p-4" style={{backgroundColor: colors.light}}>
        <section className="text-center">
          <h1 className="text-5xl font-bold uppercase tracking-wide" style={{color: colors.dark}}>
            <u>Easy Room</u>
          </h1>
          <p className="text-lg mt-2 opacity-80" style={{color: colors.dark}}>
            {homepage.subtitle}
          </p>
        </section>
        <section className="rounded-md grid grid-cols-1 md:grid-cols-3 mt-10 text-white">
          {data.map((data, index) => (
            <Card
              key={index}
              icon={data.icon}
              heading={data.heading}
              paragraph={data.paragraph}
              bgColor={data.bgColor}
              hoverColor={data.hoverColor}
              inverted={data.inverted}
              onClick={() => data.onclick(userType, setModal)}
            />
          ))}
        </section>
      </div>
      <Modal open={modal === "first"} onClose={() => setModal(null)}>
        <div className="text-center w-56">
          <div className="mx-auto my-4 w-48">
            <h3 className="text-lg font-black" style={{color: colors.dark}}>
              {homepage.modalTitle}
            </h3>
            <p className="text-sm my-1" style={{color: getColorWithOpacity("dark", 0.7)}}>
              {homepage.modalVariation1}
            </p>
          </div>
        </div>
      </Modal>
      <Modal open={modal === "third"} onClose={() => setModal(null)}>
        <div className="text-center w-56">
          <div className="mx-auto my-4 w-48">
            <h3 className="text-lg font-black" style={{color: colors.dark}}>
              {homepage.modalTitle}
            </h3>
            <p className="text-sm my-1" style={{color: getColorWithOpacity("dark", 0.7)}}>
              {homepage.modalVariation2}
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}

function Card({ icon, heading, paragraph, bgColor, hoverColor, inverted, onClick }) {
  return (
    <section
      style={{background: bgColor}}
      className="relative z-0 py-15 px-10 cursor-pointer overflow-hidden group transform transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:scale-105 hover:z-50"
      onClick={onClick}
    >
      <div
        style={{background: hoverColor}}
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      />
      {!inverted ? (
        <>
          <h2 className="uppercase font-bold text-3xl mb-8 flex flex-row relative z-10">
            {icon}
            {heading}
          </h2>
          <p className="text-sm leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transform transition-all duration-300 group-hover:-translate-y-2 relative z-10">
            {paragraph}
          </p>
        </>
      ) : (
        <>
          <p className="text-sm leading-relaxed md:mb-25 mb-12 opacity-0 group-hover:opacity-100 transform transition-all duration-300 group-hover:-translate-y-2 relative z-10">
            {paragraph}
          </p>
          <h2 className="uppercase font-bold text-3xl flex flex-row relative z-10">
            {icon}
            {heading}
          </h2>
        </>
      )}
    </section>
  );
}

export default Homepage;
