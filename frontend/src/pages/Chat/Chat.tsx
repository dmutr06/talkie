import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import type { ChatWithMessages } from "../../types/chat";
import { useHttp } from "../../hooks/http.hook";
import { useAuth } from "../../hooks/auth.hook";
import { useWs } from "../../hooks/ws.hook";
import { getChatName } from "../../utils/chat";
import type { Message } from "../../types/message";

import styles from "./Chat.module.scss";
import MessageList from "../../components/MessageList/MessageList";
import MessageForm from "../../components/MessageForm/MessageForm";

export default function Chat() {
    const { token, user } = useAuth();
    const { id } = useParams();
    const [chat, setChat] = useState<ChatWithMessages | null>(null);
    const { get, loading, error } = useHttp<ChatWithMessages, { message: string }>(`http://localhost:6969/chats/${id}`);
    const ref = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        get({ "Authorization": token }).then(setChat);
    }, [id, get, token]);

    useWs<Message>("ws://localhost:6969/chats/messages", async (data) => {
        if (!chat) return;
        if (data.chatId != chat.id) return;
        setChat(({...chat, messages: [...chat.messages, data]}));
    });

    useEffect(() => {
        ref.current?.scrollTo({ top: ref.current.scrollHeight });
    }, [chat]);

    useEffect(() => {
        if (error)
            console.log(error);
    }, [error]);

    return (
        <div className={styles.chat}>
            <div className={styles.name}>
                {loading ? "Loading..." : null}
                {error && error.status ? error.error.message : null}
                {chat ? getChatName(user, chat) : null}
            </div>
            <div ref={ref} className={styles.scroll}>
                {chat ? <div className={styles.list}><MessageList chat={chat} /></div> : null}
            </div>
            {chat ? <div className={styles.form}><MessageForm chatId={chat.id} /></div> : null}
        </div>
    );
}
