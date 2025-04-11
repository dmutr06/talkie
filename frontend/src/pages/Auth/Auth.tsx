import { useEffect } from "react";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/auth.hook";
import { useNavigate } from "react-router-dom";

import styles from "./Auth.module.scss";

export default function Auth() {
    const { user } = useAuth(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate("/chats");
    }, [user, navigate]);

    const auth = () => {
        window.location.href = "http://localhost:6969/auth/google";
    };

    return (
        <div className={styles.auth}>
            <Button onClick={auth} size="large">Auth</Button>
        </div>
    );
}
