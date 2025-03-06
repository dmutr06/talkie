import { useAuth } from "~/hooks/auth.hook";
import type { Route } from "./+types/chat";
import { useEffect, useRef, useState } from "react";
import type { ChatWithMessages } from "types/chat.interface";
import { useNavigate } from "react-router";
import MessageBox from "~/components/MessageBox";
import { MessageForm } from "~/components/MessageForm";
import type { Message } from "types/message.interface";

export default function Chat({ params: { id } }: Route.ComponentProps) {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [chat, setChat] = useState<ChatWithMessages | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const fetchChat = async () => {
    const res = await fetch(`http://localhost:6969/chats/${id}`, {
      headers: { "Authorization": token },
    });

    if (!res.ok) return navigate("/chats");

    setChat((await res.json()).chat);
  };

  useEffect(() => void fetchChat(), [id]);

  useEffect(() => {
    if (!chat) return;

    const ws = new WebSocket(`ws://localhost:6969/chats?token=${token}`);

    ws.addEventListener("message", e => {
      const newMsg = JSON.parse(e.data);
      setChat({ ...chat!, messages: [...chat!.messages, newMsg] });
    });

    return () => ws.close();
  }, [chat]);

  useEffect(() => {
      chatRef?.current?.scrollTo({ "top": chatRef.current.scrollHeight }); 
  }, [chat]);

  return (
    <div className="pb-16 pt-4 pl-4 pr-2 w-full flex flex-col max-h-full gap-12">
      {!chat ? "Loading..." :
        <div ref={chatRef} className="grow pr-10 overflow-y-scroll h-full"><ul className="flex flex-col gap-8 w-full">
          {chat.messages.map(msg => {
            return <li className="flex" key={msg.id}><MessageBox msg={msg} users={[user, ...chat.users]} /></li>
          })} 
        </ul></div>
      }
      <MessageForm chatId={chat?.id} />
    </div>
  );
}
