import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/auth.hook";


export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, setToken } = useAuth(true);

    useEffect(() => {
        if (user) return navigate("/chats");
        const token = searchParams.get("token");
        if (!token) return navigate("/auth");
        setToken(token);
        return navigate("/auth");
    }, [searchParams, navigate, setToken]);

    return null;
}
