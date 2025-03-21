import { useAuth } from "../../hooks/auth.hook";
import { ChatWithMessages } from "../../types/chat";
import type { Message } from "../../types/message";
import { User } from "../../types/user";

import styles from "./MessageList.module.scss";

interface MessageListProps {
    chat: ChatWithMessages,
}

//TODO: dont load all messages at once 
export default function MessageList({ chat }: MessageListProps) {
    const { user } = useAuth();
    return (
        <ul className={styles.messages}>
            {chat.messages.map(
                message => <MessageListItem key={message.id} message={message} user={user} users={chat.users} />
            )}
        </ul>
    );
}

interface MessageListItemProps {
    message: Message,
    user: User,
    users: User[],
}

function MessageListItem({ message, user, users }: MessageListItemProps) {
    const isSelfMessage = () => {
        return message.userId == user.id;
    };

    const getName = () => {
        return [user, ...users].find(user => user.id == message.userId)?.name;
    };

    return (
        <li className={`${styles.message} ${styles[isSelfMessage() ? "right" : "left"]}`}>
            <div className={styles.user}>{getName()}</div>
            <div className={styles.content}>{message.content}</div>
        </li>
    );
}
