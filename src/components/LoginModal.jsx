import { useState } from 'react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { useAuth } from "../AuthContext";
import { useTranslation } from 'react-i18next';
import { showToast } from '../components/Toasts/ToastMessages';
import { useToast } from '../components/Toasts/ToastService';

function LoginModal({ isOpen, onClose, tabChosen, setTabChosen }) {
    const toast = useToast();
    const { login } = useAuth();
    const { t } = useTranslation();
    const loginPage = t("loginPage");

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [isHidden, setIsHidden] = useState(true);
    const [showAccounts, setShowAccounts] = useState(false);
    const [colour, setColour] = useState("");

    if (!isOpen) return null;

    const handleLogin = () => {
        if (tabChosen === 'SignIn') {
            if (email === "supreme_landlord@gmail.com" && password === "@123456Land") {
                login("landlord");
                localStorage.setItem("loggedInEmail", "supreme_landlord@gmail.com");
            } else if (email === "thestudent@gmail.com" && password === "@123456Tent") {
                login("tenant");
                localStorage.setItem("loggedInEmail", "tennant@gmail.com");
            } else {
                return; 
            }
        }
        onClose(); 
        showToast(toast, {
            type: "success",
            header: loginPage.modalTitle1,
            message: loginPage.modalVariation1
          });
    }

    return (
        <div className="fixed inset-0 visible bg-black/30 flex items-center transition-colors justify-center z-50"
                onClick={onClose}>                  
                  <div className="bg-white rounded-lg p-6 w-full max-w-md"
                  onClick={(e) => e.stopPropagation()}>
                    <div className="flex space-x-2 mb-4 mt-4 flex-col">
                      
                      <div className=" flex flex-row">
                        <div className=" border-l-1 border-t-1 border-b-1 mb-4 w-1/2">
                          <button
                            onClick={() => setTabChosen("SignIn")}
                            className={`w-full p-2 bg-gray-500 cursor-pointer text-white hover:bg-gray-700 ${tabChosen==='SignIn'?"bg-gray-700":"bg-gray-500"}`}
                          >
                            {loginPage.signIn}
                          </button>
                        </div>
                        <div className=" border-1 mb-4 w-1/2">
                          <button
                            onClick={()=>setTabChosen("SignUp")}
                            className={`w-full p-2 bg-gray-500 cursor-pointer text-white hover:bg-gray-700 ${tabChosen==='SignUp'?"bg-gray-700":"bg-gray-500"}`}
                          >
                            {loginPage.signUp}
                          </button>
                        </div>
                      </div>

                      <div className="flex space-x-2 mb-4 flex-col">
                        {tabChosen==='SignIn'?<>
                              <h2>Email</h2>
                              <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="w-full p-2 border rounded mb-2"
                              />

                              <h2>Password</h2>
                              <div className="flex flex-row space-x-2">
                                <input
                                  type={isHidden ? "password" : "text"}
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="Password"
                                  className="w-5/6 p-2 border rounded mb-2"
                                />
                                <input
                                  type="checkbox"
                                  onClick={() => setIsHidden(!isHidden)}
                                  className="hidden"
                                />
                                <button
                                  type="button"
                                  onClick={() => setIsHidden(!isHidden)}
                                  className="w-1/8 rounded mb-2 flex justify-center items-center"
                                >
                                  {isHidden ? <FaEyeSlash size={30} /> : <FaEye size={30} />}
                                </button>
                              </div>

                              <div className='flex flex-row justify-between w-full'>
                              <button
                                onClick={handleLogin}
                                className="w-1/3 p-2 mt-4 bg-gray-500 cursor-pointer text-white rounded hover:bg-gray-600 flex items-center justify-end"
                              >
                                {loginPage.signIn}
                              </button>

                              {/* Toggle button */}
                              <button
                                type="button"
                                onClick={() => setShowAccounts(!showAccounts)}
                                className="w-1/2 ml-2 p-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                {showAccounts ? loginPage.hideText : loginPage.showText}
                              </button>
                              </div>

                              {/* Toggleable section */}
                              {showAccounts && (
                                <div className="mt-4 space-y-4 p-4 border rounded bg-gray-100">
                                  <div>
                                    <h3 className="font-bold mb-2">{loginPage.landlordAccount}</h3>
                                    <p>Email: supreme_landlord@gmail.com</p>
                                    <p>Password: @123456Land</p>
                                  </div>

                                  <div>
                                    <h3 className="font-bold mb-2">{loginPage.tenantAccount}</h3>
                                    <p>Email: thestudent@gmail.com</p>
                                    <p>Password: @123456Tent</p>
                                  </div>
                                </div>
                              )}
                            </>
                            :<>
                            <div className=" flex flex-row justify-center  mb-4">
                              <div className=" border-l-1 border-t-1 border-b-1  w-1/3">
                                <button
                                  onClick={()=>setColour("blue")}
                                  className={`w-full p-2 bg-blue-500 cursor-pointer text-white hover:bg-blue-700 ${colour==='blue'?"bg-blue-700":"bg-blue-400"}`}
                                >
                                  {loginPage.landlord}
                                </button>
                              </div>
                              <div className=" border-1  w-1/3">
                                <button
                                  onClick={()=>setColour("orange")}
                                  className={`w-full p-2 bg-orange-500 cursor-pointer text-white hover:bg-orange-700 ${colour==='orange'?"bg-orange-700":"bg-orange-400"}`}
                                >
                                  {loginPage.tenant}
                                </button>
                              </div>
                            </div>
                            <h2>{loginPage.name}</h2>
                            <input
                            type="text"
                            value=""
                            onChange={{}}
                            placeholder={loginPage.name}
                            className={`w-full p-2 border rounded mb-2`}
                            />
                            <h2>Email</h2>
                            <input
                            type="text"
                            value=""
                            onChange={{}}
                            placeholder={`Email`}
                            className={`w-full p-2 border rounded mb-2`}
                            />
                            <div className='flex flex-row space-x-2'>
                              <div className='flex flex-col space-x-2'>
                                <h2>{loginPage.contact}</h2>
                                <input
                                type="text"
                                value=""
                                onChange={{}}
                                placeholder={loginPage.contact}
                                className={`w-full p-2 border rounded mb-2`}
                                />
                              </div>

                              <div className='flex flex-col space-x-2'>
                                <h2>{loginPage.nationality}</h2>
                                <input
                                type="text"
                                value=""
                                onChange={{}}
                                placeholder={loginPage.nationality}
                                className={`w-full p-2 border rounded mb-2`}
                                />
                                </div>
                            </div>
                            <h2>Password</h2>
                            <div className='flex flex-row space-x-2'>
                              <input
                              type="text"
                              value=""
                              onChange={{}}
                              placeholder={`Password`}
                              className={`w-1/2 p-2 border rounded mb-2 `}
                              />
                              <input
                              type="text"
                              value=""
                              onChange={{}}
                              placeholder={loginPage.confirm}
                              className={`w-1/2 p-2 border rounded mb-2 `}
                              />
                            </div>
                            <div className='flex flex-row space-x-2'>
                            <input
                              type="checkbox"
                              className={` w-1/6 p-2 mt-6 border rounded mb-3 text-black`}
                              />
                              <p className='text-xs mt-3'>{loginPage.terms}</p>
                              <button
                                onClick={handleLogin}
                                className="w-1/2 p-2 mt-3 bg-gray-500 cursor-pointer text-white rounded hover:bg-gray-600 flex items-center justify-end"
                                >
                                {loginPage.signUp}
                              </button>
                            </div> 
                          </>
                        }
                      </div>  
                    </div>
                    
                  </div>
        </div>
    );
}

export default LoginModal;
