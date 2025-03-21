import Elysia, { t } from "elysia";
import { chatRepo } from "./chat.repo";
import { userRepo, userService } from "../user";
import { jwt } from "@elysiajs/jwt";

export const chatRouter = new Elysia({ prefix: "/chats" })
    .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET! }))
// .use(chatService)
    .use(chatRepo)
    .use(userService)
    .use(userRepo)
    .get("/", async ({ getSignedUser, getUsersChats }) => {
        const user = getSignedUser();

        return await getUsersChats(user.id)!;
    }, 
    {  
        isSignIn: true
    })
    .post("/private", async ({ error, body: { userEmail }, getSignedUser, createPrivateChat, getUserByEmail }) => {
        const creator = getSignedUser();

        const user = await getUserByEmail(userEmail);

        if (!user)
            return error(404, { message: "Not Found" });
        if (creator.id == user.id)
            return error(400, { message: "Can't create chat with yourself" });

        const chat = await createPrivateChat([creator.id, user.id]);

        if (!chat) return error(400, { message: "Bad request" });
        return chat;
    }, 
    {
        body: t.Object({
            userEmail: t.String(),
        }),
        isSignIn: true,
    })
    .post("/group", async ({ error, body, getSignedUser, createGroup }) => {
        const user = getSignedUser();

        if (body.initialUsers.length < 1) return error(400, { message: "Bad request" });
    
        const group = await createGroup(body.name, [user.id, ...body.initialUsers]);

        if (!group) return error(400, { message: "Bad request" });
        return group;
    }, 
    {
        isSignIn: true,
        body: t.Object({
            name: t.String(),
            initialUsers: t.Array(t.String()),
        })
    })
    .get("/:id", async ({ error, params: { id }, getChatWithMessages, getSignedUser }) => {
        const user = getSignedUser();
        const chat = await getChatWithMessages(id, user.id);

        if (!chat) return error(404, { messages: "Not Found" });
    
        return chat;
    }, { isSignIn: true })
    .post("/msg", async ({ error, server, body, getSignedUser, createMessage, getChatIfUserIn, getUsersFromChat }) => {
        const user = getSignedUser();
        const chat = await getChatIfUserIn(user.id, body.chatId);

        if (!chat) return "TODO: return something better";

        const msg = await createMessage({ ...body, userId: user.id });
    
        if (!msg) return error(400, { message: "Bad request" });

        const users = await getUsersFromChat(msg.chatId);
    
        users?.forEach(user => server?.publish(`notify:${user.id}`, JSON.stringify(msg)));

        return msg;
    }, { isSignIn: true, body: t.Object({ chatId: t.String(), content: t.String() }) })
    .ws("/messages", {
        query: t.Object({
            token: t.String(),
        }),
        body: t.String(),

        async open({ data: { query, jwt, getUser }, ...ws }) {
            const { token } = query;

      
            const payload = await jwt.verify(token);
            if (!payload || !payload.sub) return ws.close();

            const user = await getUser(payload.sub);
            if (!user) return ws.close();

            ws.subscribe(`notify:${user.id}`);
        },

        message(ws, chatId) {
            console.log(chatId);
            ws.subscribe(chatId);
        },
    });

