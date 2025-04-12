import { type FormEvent, useState } from "react";
import { useAuth } from "../../hooks/auth.hook";

import Button from "../ui/Button";
import { useHttp } from "../../hooks/http.hook";
import { Chat } from "../../types/chat";

import styles from "./CreateChatForm.module.scss";

interface CreateChatFormProps {
    addNewChat: (chat: Chat) => void, 
}

export default function CreateChatForm({ addNewChat }: CreateChatFormProps) {
    const { token } = useAuth();
    const [email, setEmail] = useState("");
    const { post } = useHttp<Chat>(`${import.meta.env.VITE_API_ORIGIN}/chats/private`);

    const createChat = async (e: FormEvent) => {
        e.preventDefault();
        if (!email) return;

        post({
            headers: {
                "Authorization": token,
            },
            body: {
                userEmail: email,
            }
        }).then(chat => {
            if (!chat) return;
            setEmail("");
            addNewChat(chat);
        });
    };

    return (
        <form onSubmit={createChat} className={styles.form}>
            <input className={styles.input}
                placeholder="some@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Button size="full">Create</Button>
        </form>
    );
}
