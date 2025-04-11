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
    const [user, setUser] = useState<User | null>(null);
    const [userLoaded, setUserLoaded] = useState<boolean>(false);
    const { get, error, loading } = useHttp<User>("http://localhost:6969/user");

    useEffect(() => {
        (async () => {
          if (token) {
            setUserLoaded(false);
            const maybeUser = await get({
              "Authorization": token,
            });
            if (maybeUser)
                setUser(maybeUser);
            else {
                setUser(null);
            }

            setUserLoaded(true);
          } else {
            setUser(null);
            setUserLoaded(true);
          }
        })();
    }, [token, get]);

    useEffect(() => {
      if (error) {
        if (error.status == 401) {
            resetToken();
        }
      }
    }, [error]);

    const setTokenCookie = (token: string, days: number) => {
        setToken(token, {
            path: "/",
            days,
        });
    };

    return (
      <>
        {error ? <p>Error...</p> : null}
        {loading ? <p>Loading...</p> : null}
        {userLoaded ?
              <AuthContext.Provider 
                  value={{
                      token,
                      setToken: (token: string) => setTokenCookie(token, 7),
                      resetToken,
                      user,
                      status: error?.status || null,
                  }}
              >{children}</AuthContext.Provider>
              : null}
        </>
    );
}
