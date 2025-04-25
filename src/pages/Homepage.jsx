import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../index.css'
import '../App.css'
import { SedanSVG } from '../assets/SedanSVG';
import Modal from '../components/Modal';
import { Forum } from '../assets/Forum';

  
function Homepage() {
  const Bright_orange= "rgb(28, 10, 0)";
  const Dark_cyan="rgb(63, 35, 5)";
  const Very_dark_cyan= "rgb(96, 54, 1)";

  const data = [
    {
      bgcolour: Bright_orange,
      icon: <SedanSVG className="mb-8"/>,
      heading: "Área de Senhorio",
      paragraph: "Área destinada à publicação e edição de anúncios",
      inverted: false,
      onclick: (userType, setModal) => {
        if (userType !== "landlord") setModal("first");
        else navigate("/myads");
        },
      },
    {
      bgcolour: Dark_cyan,
      icon: <SedanSVG className="mb-8"/>,
      heading: "Explorar",
      paragraph: "Àrea destinada à procura de alojamento e consulta de detalhes dos mesmos",
      inverted: true,
      onclick: () => {navigate("/ads")},
      },
    {
      bgcolour: Very_dark_cyan,
      icon: <Forum className="mb-8"/>,
      heading: "Fórum",
      paragraph: "Àrea destinada à partilha pública de informação entre users",
      inverted: false,
      onclick: (userType, setModal) => {
        if (userType === null) setModal("third");
        else navigate("/forum");
      },
      }
  ]
  
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType"); //null ,'landlord' ,'tennant'
  const [modal, setModal] = useState(null); // null, 'first', 'third'

  useEffect(() => {
    if (modal !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modal]);
  
  return (
    <>
      <div className='h-screen w-full flex flex-col items-center justify-start p-4  bg-gray-100' >
        <section className="mt-10 mb-10 text-center">
          <h1 className="text-5xl font-bold uppercase tracking-wide">Easy Room</h1>
          <p className="text-lg mt-2 opacity-80">Your trusted platform for housing solutions</p>
        </section>
        <section className='rounded-md overflow-hidden grid grid-cols-1 md:grid-cols-3 mt-10 text-white'>
          {/* Card */}
          {data.map((data, index) => (
            <Card 
              key={index} 
              icon={data.icon} 
              heading={data.heading} 
              paragraph={data.paragraph} 
              bgcolour={data.bgcolour} 
              inverted={data.inverted} 
              onClick={() => data.onclick(userType, setModal)}
            />
          ))}
        </section>
      </div>
      <Modal open={modal == "first"} onClose={() => setModal(null)}>
        <div className="text-center w-56">
          <div className="mx-auto my-4 w-48">
            <h3 className="text-lg font-black text-gray-800">Acesso Inválido</h3>
            <p className="text-sm text-gray-500 my-1">
              É necessário fazer login com conta de senhorio para aceder à secção Publicar Anúncio
            </p>
          </div>
        </div>
      </Modal>
      <Modal open={modal == "third"} onClose={() => setModal(null)}>
        <div className="text-center w-56">
          <div className="mx-auto my-4 w-48">
            <h3 className="text-lg font-black text-gray-800">Acesso Inválido</h3>
            <p className="text-sm text-gray-500 my-1">
              É necessário fazer login com conta de senhorio ou inquilino para aceder à secção Publicar Anúncio
            </p>
          </div>
        </div>
      </Modal>
    </>
  )
}

function Card({icon, heading, paragraph, bgcolour, inverted, onClick}) {
  return (
    <section 
      style={{background: bgcolour}} 
      className="relative py-15 px-10 cursor-pointer overflow-hidden group transition-all duration-300" 
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
      {!inverted ? (
        <>
          {icon}
          <h2 className='uppercase font-bold text-3xl mb-8'>{heading}</h2>
          <p className="text-sm leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transform transition-all duration-300 group-hover:-translate-y-2">
            {paragraph}
          </p>
        </>
      ) : (
        <>
          <p className="text-sm leading-relaxed mb-15 opacity-0 group-hover:opacity-100 transform transition-all duration-300 group-hover:-translate-y-2">
            {paragraph}
          </p>
          {icon}
          <h2 className='uppercase font-bold text-3xl'>{heading}</h2>
        </>
      )}
    </section>
  )
}
export default Homepage