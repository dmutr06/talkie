import { Chat } from "../types/chat";
import { User } from "../types/user";

export function getChatName(user: User, chat: Chat): string {
    if (chat.isGroup) return chat.name;

    return chat.users.find(usr => usr.id != user.id)!.name;
}
