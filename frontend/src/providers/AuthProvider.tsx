import { type ReactNode, useEffect, useState  } from "react";
import { AuthContext } from "../contexts/authContext";
import useCookie from "react-use-cookie";
import { User } from "../types/user";
import { useHttp } from "../hooks/http.hook";

interface AuthProviderProps {
    children: ReactNode | ReactNode[],
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const [token, setToken, resetToken] = useCookie("token", "");
    const [userLoaded, setUserLoaded] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const { get, error } = useHttp<User>("http://localhost:6969/user");

    useEffect(() => {
        setUserLoaded(false);
        get({ "Authorization": token }).then(user => {
            if (!user) {
                return;
            }
            setUser(user);
            setUserLoaded(true);
        }).finally(() => setUserLoaded(true));
    }, [token, get]);

    const setTokenCookie = (token: string, days: number) => {
        setToken(token, {
            path: "/",
            days,
        });
    };

    return (
        userLoaded ?
            <AuthContext.Provider 
                value={{
                    token,
                    setToken: (token: string) => setTokenCookie(token, 7),
                    resetToken,
                    user,
                    status: error?.status || null,
                }}
            >{children}</AuthContext.Provider>
            : null
        
    );
}
