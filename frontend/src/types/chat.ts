import { Message } from "./message";
import { User } from "./user";

interface GeneralChat {
    id: string,
    users: User[],
    isGroup: boolean,
}

export interface PrivateChat extends GeneralChat {
    isGroup: false,
}

export interface GroupChat extends GeneralChat {
    isGroup: true,
    name: string,
}

export type Chat = PrivateChat | GroupChat;

export type ChatWithMessages = Chat & { messages: Message[] };
