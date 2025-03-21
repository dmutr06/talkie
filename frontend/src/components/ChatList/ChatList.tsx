import { NavLink } from "react-router-dom";
import { Chat } from "../../types/chat";
import Button from "../ui/Button";

import styles from "./ChatList.module.scss";
import { getChatName } from "../../utils/chat";
import { User } from "../../types/user";
import { useAuth } from "../../hooks/auth.hook";

interface ChatListProps {
    chats: Chat[],
}

export default function ChatList({ chats }: ChatListProps) {
    const { user } = useAuth();
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
