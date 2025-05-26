import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import { TbWorld } from "react-icons/tb";

const languages = [
  {code: "En", lang: "English"},
  {code: "Pt", lang: "Portuguese"},
];

const LanguageSelector = () => {
  const {i18n} = useTranslation();

  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n, i18n.language]);

  const changeLanguage = (e) => {
    const { name, value } = e.target;
    i18n.changeLanguage(value);
  };

  return (
    <div className="relative inline-block justify-center w-max">
        <div className="absolute inset-y-0 left-0 items-center pl-3 pointer-events-none hidden sm:flex">
            <TbWorld className="text-lg" />
        </div>
        <select
            name="languageChanger"
            value={i18n.language}
            onChange={changeLanguage}
            className="appearance-none pr-3  border-2 rounded-full pl-3 sm:pl-8"
        >
            {languages.map((lng) => (
            <option key={lng.code} value={lng.code}>
                {lng.code === "En" ? "🇬🇧 " : "🇵🇹 "}{lng.code}
            </option>
            ))}
        </select>
    </div>
  );
};

export default LanguageSelector;