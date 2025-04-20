export const AuthProvider = ({ children }) => {
    const [userType, setUserType] = useState(null);
  
    const login = (type) => setUserType(type);
    const logout = () => setUserType(null);
  
    return (
      <AuthContext.Provider value={{ userType, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  