import { NavLink } from "react-router-dom";
import { Chat } from "../../types/chat";
import Button from "../ui/Button";

import styles from "./ChatList.module.scss";
import { useEffect, useState } from "react";
import { useHttp } from "../../hooks/http.hook";
import { useAuth } from "../../hooks/auth.hook";
import { getChatName } from "../../utils/chat";
import { User } from "../../types/user";

export default function ChatList() {
    const { token, user } = useAuth();
    const [chats, setChats] = useState<Chat[] | null>(null);
    const { get, error } = useHttp<Chat[]>("http://localhost:6969/chats");

    useEffect(() => {
        get({ "Authorization": token }).then(setChats);
    }, [get, token]);

    useEffect(() => {
        // TODO: do something better, maybe nothing
        console.log(error);
    }, [error]);

    return (
        <ul className={styles.list}>
            {chats?.map(chat => <ChatListItem key={chat.id} chat={chat} user={user} />)}
        </ul>
    );
}

export interface ChatListItemProps {
    chat: Chat,
    user: User,
}

function ChatListItem({ chat, user }: ChatListItemProps) {
    return (
        <li>
            <NavLink to={chat.id}>
                <Button size="full" className={styles.link}>
                    {getChatName(user, chat)}
                </Button>
            </NavLink>
        </li>
    );
}
