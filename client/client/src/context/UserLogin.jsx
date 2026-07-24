import { createContext, useState } from "react";
import {UserData} from "./UserData";

export const UserContext = createContext();

const UserProvider = ({ children }) =>{
    const [user, setUser] = useState({});
    const [error, setError] = useState("");

    const login = (email, password)=>{
        const verify  = UserData.filter( (user)=>{
            user.username === email && user.password === password

        })


        if(verify){
             setUser(verify)
        }else{
            setError("Invalid Details")
        }
    }

    const logout = setUser({})

    return (
        <UserContext.Provider value={{user, error, login, logout}}>
            {children}
        </UserContext.Provider>
    )

}

