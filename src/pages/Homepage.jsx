import { useState } from 'react'
import '../index.css'
import '../App.css'
import { SedanSVG } from '../assets/SedanSVG';

const Bright_orange= "hsl(31, 77%, 52%)";
const Dark_cyan="hsl(184, 100%, 22%)";
const Very_dark_cyan= "hsl(179, 100%, 13%)";

const data = [
  {
    bgcolour: Bright_orange,
    icon: <SedanSVG className="mb-8"/>,
    heading: "Sedans",
    paragraph: "Texto A",
    inverted: false
  },
  {
    bgcolour: Dark_cyan,
    icon: <SedanSVG className="mb-8"/>,
    heading: "Sedans",
    paragraph: "Texto A",
    inverted: true
  },
  {
    bgcolour: Very_dark_cyan,
    icon: <SedanSVG className="mb-8"/>,
    heading: "Sedans",
    paragraph: "Texto A",
    inverted: false
  }


]
  
function Homepage() {
  
  return (
    <div className='min-h-screen w-full flex items-center justify-center p-10 text-white'>
    
    <section className='rounded-md overflow-hidden grid grid-cols-1 md:grid-cols-3'>
    {/* Card */}
    {data.map((data,index)=> (
      <Card key={index} icon={data.icon} heading={data.heading} paragraph={data.paragraph} bgcolour={data.bgcolour} inverted={data.inverted}/>

    ))}
    </section>
    </div>
  )
}

function Card({icon, heading, paragraph, bgcolour, inverted}){
  return(
    <section style = {{background: bgcolour}}className=' w-[260px] py-8 px-10'>
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