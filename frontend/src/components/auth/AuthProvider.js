import React, { createContext,useState,useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
export const AuthContext=createContext({
    user:null,
    handleLogin:(token)=>{},
    handleLogout:()=>{}
})

const AuthProvider = ({children}) => {
    const[user,setUser]=useState(null)

    const handleLogin=(token)=>{
        const decodedToken=jwtDecode(token)
        localStorage.setItem("userId",decodedToken.sub)
        localStorage.setItem("userRole",decodedToken.roles)
        localStorage.setItem("token",token)
        setUser(decodedToken)
    }

    const handleLogout=()=>{
        localStorage.removeItem("userId")
        localStorage.removeItem("userRole")
        localStorage.removeItem("token")
        setUser(null)
    }
    useEffect(() => {
        // Recheck token validity on app load
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const isTokenExpired = decodedToken.exp * 1000 < Date.now();
                if (isTokenExpired) {
                    handleLogout();
                } else {
                    setUser(decodedToken);
                }
            } catch (error) {
                handleLogout();
            }
        }
    }, []);

  return (
    <AuthContext.Provider value={{user,handleLogin,handleLogout}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

