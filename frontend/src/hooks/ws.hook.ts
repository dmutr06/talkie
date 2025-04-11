import { useEffect, useState } from "react";
import { useAuth } from "./auth.hook";


export function useWs<TData>(url: string, onMessage: (data: TData) => Promise<void> | void) {
    const { token } = useAuth();
    const [opened, setOpened] = useState(false);
    
    useEffect(() => {
        if (!token) return;
        const ws = new WebSocket(`${url}?token=${token}`);

        ws.addEventListener("open", () => {
            setOpened(true);
        })

        ws.addEventListener("message", async (e) => {
            const data = JSON.parse(e.data);
            onMessage(data);
        });

        return () => {
            if (opened) ws.close();
        }
    }, [url, token, onMessage]);
}
