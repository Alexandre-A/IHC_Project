import { useState } from 'react'
import { useAuth } from "../AuthContext";
import '../index.css'
import '../App.css'
import NavbarInicial from '../components/NavbarIncial'
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/language-selector';

function Ads() {
  const {t} = useTranslation()
  const { userType } = useAuth();
  const isLandlord = userType === "landlord";
  return (
    <div className='bg-gray-100'>
      <h1>{t("greeting")}</h1>
      <LanguageSelector></LanguageSelector>
    </div>
  )
}

export default Ads