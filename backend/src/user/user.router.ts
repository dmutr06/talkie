import { Elysia, t } from "elysia";
import { userService } from "./user.service";
import { userRepo } from "./user.repository";

export const userRouter = new Elysia({ prefix: "/user" })
    .use(userService)
    .use(userRepo)
    .get("/", async ({ getSignedUser }) => {
        const user = getSignedUser();
        return user; 
    }, { isSignIn: true })
    .get("/:id", async ({ getUser, params: { id } }) => {
        return await getUser(id);
    }, { isSignIn: true, params: t.Object({ id: t.String() }) })
    .post("/", async ({ error, createUser, body }) => {
        const user = await createUser(body);
        if (!user) return error(400, { message: "User with such email already exists" });

        return user; 
    }, { body: t.Object({ email: t.String(), name: t.String(), }) });
