import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../index.css'
import '../App.css'
import { SedanSVG } from '../assets/SedanSVG';
import Modal from '../components/Modal';

  
function Homepage() {
  const Bright_orange= "hsl(31, 77%, 52%)";
const Dark_cyan="hsl(184, 100%, 22%)";
const Very_dark_cyan= "hsl(179, 100%, 13%)";

const data = [
  {
    bgcolour: Bright_orange,
    icon: <SedanSVG className="mb-8"/>,
    heading: "Sedans",
    paragraph: "Texto A",
    inverted: false,
    onclick: (userType, setModal) => {
      if (userType !== "landlord") setModal("first");
      else navigate("/myads");
      },
    },
  {
    bgcolour: Dark_cyan,
    icon: <SedanSVG className="mb-8"/>,
    heading: "Sedans",
    paragraph: "Texto A",
    inverted: true,
    onclick: () => {navigate("/ads")},
    },
  {
    bgcolour: Very_dark_cyan,
    icon: <SedanSVG className="mb-8"/>,
    heading: "Sedans",
    paragraph: "Texto A",
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
  return (
    <>
    <div className='min-h-screen w-full flex items-center justify-center p-10 text-white'>
    
    <section className='rounded-md overflow-hidden grid grid-cols-1 md:grid-cols-3'>
    {/* Card */}
    {data.map((data,index)=> (
      <Card key={index} icon={data.icon} heading={data.heading} paragraph={data.paragraph} bgcolour={data.bgcolour} inverted={data.inverted} onClick={() => data.onclick(userType, setModal)}/>

    ))}
    </section>

    </div>
    <Modal open={modal == "first"} onClose={() => setModal(null)}>
      <div className="text-center w-56">
        <div className="mx-auto my-4 w-48">
          <h3 className="text-lg font-black text-gray-800">Acesso Inválido</h3>
          <p className="text-sm text-gray-500">
            É necessário fazer login com conta de senhorio para aceder à secção Publicar Anúncio
          </p>
        </div>
      </div>
    </Modal>

    <Modal open={modal == "third"} onClose={() => setModal(null)}>
      <div className="text-center w-56">
        <div className="mx-auto my-4 w-48">
          <h3 className="text-lg font-black text-gray-800">Acesso Inválido</h3>
          <p className="text-sm text-gray-500">Teste</p>
        </div>
      </div>
    </Modal>
    </>
  )
}

function Card({icon, heading, paragraph, bgcolour, inverted, onClick}){
  return(
    <section style = {{background: bgcolour}}      className="relative w-[260px] py-8 px-10 cursor-pointer overflow-hidden group transition-all duration-300" onClick={onClick}>
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
    {!inverted?(
    <>
      {icon}
      <h2 className='uppercase font-bold text-3xl mb-8'>{heading}</h2>
      <p className='text-sm leading-relaxed mb-12'>{paragraph}</p>

      <button style={{color: bgcolour}} className='px-6 bg-white rounded-full hover:ring-1 hover:!text-white hover:bg-inherit py-2 hover:ring-white transition-all'>
        Learn more{" "}
      </button>
    </>):(
    <>
      <button style={{color: bgcolour}} className='px-6 bg-white rounded-full hover:ring-1 hover:!text-white hover:bg-inherit py-2 hover:ring-white transition-all mb-8'>
        Learn more{" "}
      </button>
      <p className='text-sm leading-relaxed mb-12'>{paragraph}</p>
      {icon}
      <h2 className='uppercase font-bold text-3xl'>{heading}</h2>
  
      
    </>)
    }
    </section>
  )
}
export default Homepage