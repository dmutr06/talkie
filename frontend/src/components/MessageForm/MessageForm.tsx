import { type FormEvent, useEffect, useState } from "react";
import { useAuth } from "../../hooks/auth.hook";
import { useHttp } from "../../hooks/http.hook";
import Button from "../ui/Button";

import styles from "./MessageForm.module.scss";

interface MessageFormProps {
    chatId: string,
}

export default function MessageForm({ chatId }: MessageFormProps) {
    const [input, setInput] = useState("");
    const { token } = useAuth();
    const { post, loading, error } = useHttp(`${import.meta.env.VITE_API_ORIGIN}/chats/msg`);

    const sendMessage = async (e: FormEvent) => {
        e.preventDefault();

        if (!input) return;
        post({
            headers: {
                "Authorization": token,
            },
            body: {
                chatId,
                content: input,
            }
        }).then(() => setInput(""));
    };

    useEffect(() => {
        if (error) {
            console.log(error);
        }
    }, [error]);

    return (
        <form className={styles.form} onSubmit={sendMessage}>
            <input
                className={styles.input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <Button className={styles.submit} size="small" disabled={loading}>Send</Button>
        </form>
    );
}
