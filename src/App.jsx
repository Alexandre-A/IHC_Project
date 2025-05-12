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
import Homepage from './pages/Homepage'
import NavbarInicial from './components/NavbarIncial';
import AdFormPage from './pages/AdFormPage';
import PersonalMessage from './pages/PersonalMessage';
import AdInfo from './pages/AdInfo';


function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { userType } = useAuth();

  return(
    <div className="min-h-screen flex flex-col">
    <NavbarInicial homepage={isHome} complete={userType}/>
    <main className="flex-grow bg-gray-100">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/ads" element={<Ads />} />
        <Route path="/myads" element={<MyAds />} />
        <Route path="/profile/:userType" element={<Profile />} />        
        <Route path="/settings" element={<Settings />} />
        <Route path="/form" element={<AdFormPage />} />
        <Route path="/privateMessage/:user" element={<PersonalMessage />} />
        <Route path="/adInfo/:ad" element={<AdInfo />} />

      </Routes>
      </main>
    </div>
        )
}

export default App
