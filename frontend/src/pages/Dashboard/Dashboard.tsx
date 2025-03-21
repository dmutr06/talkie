import { Outlet } from "react-router-dom";

import styles from "./Dashboard.module.scss";
import ChatList from "../../components/ChatList/ChatList";
import UserInfo from "../../components/UserInfo/UserInfo";
import CreateChatForm from "../../components/CreateChatForm/CreateChatForm";
import { useAuth } from "../../hooks/auth.hook";
import { Chat } from "../../types/chat";
import { useEffect, useState } from "react";
import { useHttp } from "../../hooks/http.hook";

export default function Dashboard() {
    const { token } = useAuth();
    const [chats, setChats] = useState<Chat[] | null>(null);
    const { get } = useHttp<Chat[]>("http://localhost:6969/chats");

    useEffect(() => {
        get({ "Authorization": token }).then(setChats);
    }, [get, token]);

    const addNewChat = (chat: Chat) => {
        if (!chats) return;
        setChats([...chats, chat]);
    };

    return (
        <main className={styles.dashboard}>
            <div className={styles.left}>
                <h1 className={styles.header}>Talkie</h1>
                <div className={styles.list}>
                    <ChatList chats={chats || []} />
                </div>
                <div className={styles.new}>
                    <CreateChatForm addNewChat={addNewChat} />
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
