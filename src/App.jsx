import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import './App.css'
import Newadd from'./pages/newadd'
import NavbarInicial from './components/NavbarIncial'
import Homepage from './pages/Homepage'
import { AuthProvider } from './AuthContext';


function App() {
  const [count, setCount] = useState(0)
  return(
    <>
    <Homepage></Homepage>
    </>
  )
}

export default App
