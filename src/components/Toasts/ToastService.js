import { createContext, useContext } from "react";

const ToastContext = createContext()
export const useToast = () => useContext(ToastContext) //Hook acts as a 
                                        //wrapper to the toast use Context
export default ToastContext