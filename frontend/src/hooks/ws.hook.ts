import { useEffect } from "react";
import { useAuth } from "./auth.hook";


export function useWs<TData>(url: string, onMessage: (data: TData) => Promise<void> | void) {
    const { token } = useAuth();
    
    useEffect(() => {
        const ws = new WebSocket(`${url}?token=${token}`);

        ws.addEventListener("message", async (e) => {
            const data = JSON.parse(e.data);
            onMessage(data);
        });

        return () => ws.close();
    }, [url, token, onMessage]);
}
