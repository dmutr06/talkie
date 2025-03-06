import { useState, type FormEvent } from "react";
import type { Message } from "types/message.interface";
import { useAuth } from "~/hooks/auth.hook";
import Button from "./ui/Button";


export interface MessageFormProps {
  chatId?: string,
}

export function MessageForm({ chatId }: MessageFormProps) {
  const { token } = useAuth();
  const [message, setMessage] = useState<string>("");

  const onSubmitForm = async (e: FormEvent) => {
    e.preventDefault();

    if (message.length == 0) return;

    const res = await fetch("http://localhost:6969/chats/msg", {
      method: "POST",
      headers: { "Authorization": token, "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, content: message })
    });

    if (res.ok) setMessage("");
  }

  return (
    <form className="shrink h-16 pr-10 flex gap-4 justify-between">
      <input 
        value={message} 
        onChange={(e) => setMessage(e.target.value)}
        className="block bg-indigo-950 h-full w-full p-4 outline-none" 
        placeholder="Your message" 
      />
      <Button className="bg-indigo-950" onClick={onSubmitForm}>Submit</Button>
    </form>
  );
}
