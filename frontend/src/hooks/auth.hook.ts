import { useContext, useEffect } from "react";
import { AuthContext, IAuthContext } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";

export function useAuth<DontCheck extends boolean = false>(dontCheck?: DontCheck): DontCheck extends false ? IAuthContext<true> : IAuthContext<false>  {
    const data = useContext(AuthContext);
    const navigate = useNavigate();
    if (!data) throw new Error("Could not find AuthProvider");
    
    useEffect(() => {
        if (!dontCheck && !data.token) 
            return navigate("/auth");
        if (!dontCheck && !data.user) 
            return navigate("/auth");
    }, [data, dontCheck, navigate]);

    return {
        ...data,
        user: data.user!,
        token: data.token!,
    };
}
