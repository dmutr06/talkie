import { Outlet } from "react-router-dom";

import styles from "./Dashboard.module.scss";
import ChatList from "../../components/ChatList/ChatList";
import UserInfo from "../../components/UserInfo/UserInfo";

export default function Dashboard() {
    return (
        <main className={styles.dashboard}>
            <div className={styles.left}>
                <h1 className={styles.header}>Talkie</h1>
                <div className={styles.list}>
                    <ChatList />
                </div>
                <div className={styles.user}>
                    <UserInfo />
                </div>
            </div>
            <div className={styles.right}>
                <Outlet />
            </div>
        </main>
    );
}
