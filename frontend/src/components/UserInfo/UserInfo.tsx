
import { useAuth } from "../../hooks/auth.hook";
import Button from "../ui/Button";
import styles from "./UserInfo.module.scss";

export default function UserInfo() {
    const { user, resetToken } = useAuth();
    return (
        <div className={styles.info}>
            <div className={styles.name}>{user?.name}</div>
            <Button size="square" onClick={resetToken}>X</Button>
        </div>
    );
}
