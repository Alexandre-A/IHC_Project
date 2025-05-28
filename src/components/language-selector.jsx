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
    <div className="relative inline-block w-max">
    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <TbWorld className="text-lg text-white" />
    </div>
    <select
        name="languageChanger"
        value={i18n.language}
        onChange={changeLanguage}
        className="appearance-none border-2 rounded-full pl-10 pr-4 py-1"
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