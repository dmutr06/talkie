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
import Spinner from "../../components/ui/Spinner";

export default function Chat() {
    const { token, user } = useAuth();
    const { id } = useParams();
    const [chat, setChat] = useState<ChatWithMessages | null>(null);
    const { get, loading, error } = useHttp<ChatWithMessages, { message: string }>(`${import.meta.env.VITE_API_ORIGIN}/chats/${id}`);
    const ref = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        get({ "Authorization": token }).then(setChat);
    }, [id, get, token]);

    useWs<Message>(`${import.meta.env.VITE_WS_ORIGIN}/chats/messages`, async (data) => {
        if (!chat) return;
        if (data.chatId != chat.id) return;
        setChat(({...chat, messages: [...chat.messages, data]}));
    });

    useEffect(() => {
        ref.current?.scrollTo({ top: ref.current.scrollHeight });
    }, [chat]);

    return (
        <div className={styles.chat}>
            <div className={styles.name}>
                {loading ? "Loading..." : null}
                {error && error.status ? error.error.message : null}
                {chat ? getChatName(user, chat) : null}
            </div>
            <div ref={ref} className={styles.scroll}>
                {loading ? <div className={styles.spinner}><Spinner /></div> : null}
                {chat ? <div className={styles.list}><MessageList chat={chat} /></div> : null}
            </div>
            {chat ? <div className={styles.form}><MessageForm chatId={chat.id} /></div> : null}
        </div>
    );
}
