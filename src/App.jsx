import { useState } from 'react'
import { Routes, Route, useLocation } from "react-router-dom";
import './index.css'
import './App.css'
import { useAuth } from "./AuthContext";
import Forum from "./pages/Forum";
import Messages from "./pages/Messages";
import Ads from "./pages/Ads";
import MyAds from "./pages/MyAds";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/LoginPage";
import Registo from "./pages/RegisterPage";
import Homepage from './pages/Homepage'
import NavbarInicial from './components/NavbarIncial';


function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { userType } = useAuth();

  return(
    <div className="min-h-screen flex flex-col">
    <NavbarInicial homepage={isHome} complete={userType}/>
    <main className="flex-grow">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/ads" element={<Ads />} />
        <Route path="/myads" element={<MyAds />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registo" element={<Registo />} />
      </Routes>
      </main>
    </div>
        )
}

export default App
