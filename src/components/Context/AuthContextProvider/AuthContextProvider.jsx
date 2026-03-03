import axios from "axios"
import { createContext, useState } from "react"
import { get } from "react-hook-form";
import { set } from "zod";
import { useEffect } from "react";


export const AuthUsercontext=createContext()
// const navigate = useNavigate();


export default function AuthContextProvider({children}) {
    
    const [userData, setUserData] = useState(null);

    
    
// 

    
    const [token , setToken]=useState(function(){
       return localStorage.getItem("token")
    })

    useEffect(() => {
        if(token) {
            getUserData(token);
        }
    }, [token]);
    function setUserToken(newToken){
        if(newToken){
            localStorage.setItem("token", newToken)
            setToken(newToken)
            getUserData(newToken);
        } else {
            const storedToken = localStorage.getItem("token");
            setToken(storedToken);
            getUserData(storedToken);
        }
    }


   async function getUserData(tokenArg){
       const usedToken = tokenArg || token;
       try{
        const response = await axios.get("/users/profile-data", {
            headers: {
                "Authorization": `Bearer ${usedToken}`
            }
        })
        console.log(response);
        setUserData(response.data.data || response.data)
        setToken(usedToken)
       }
       catch(err){
            setUserData(null)
            console.error('Failed to fetch profile:', err);
       }
    }

      
    
  return (
    <AuthUsercontext.Provider value={{token , setUserToken ,setToken ,userData, getUserData}}>
        {children}
    </AuthUsercontext.Provider>
  )
}
